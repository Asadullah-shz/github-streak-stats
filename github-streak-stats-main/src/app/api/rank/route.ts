import { NextRequest, NextResponse } from 'next/server';
import { fetchRepositories, fetchUserMeta } from '@/lib/github';
import { cachedFetch } from '@/lib/redis';
import { calculateRank } from '@/utils/calculations';
import { generateRankSVG } from '@/svg/rankSvg';
import { generateErrorSVG } from '@/svg/errorSvg';
import { getTheme, Theme } from '@/config/themes';

export const runtime = 'edge';

const FRESH_SECONDS = 1800;      // 30 min: serve straight from cache, no revalidation
const STALE_SECONDS = 604800;    // 7 days: outer bound before a truly synchronous refetch

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('user');
  const themeParam = searchParams.get('theme') || 'default';
  const hideTitleParam = searchParams.get('hide_title') ? searchParams.get('hide_title') === 'true' : false;

  if (!username) {
    return new NextResponse('Missing user parameter', { status: 400 });
  }

  try {
    const baseTheme = getTheme(themeParam);
    const theme: Theme = { ...baseTheme };
    const customKeys = ['bg_color', 'border_color', 'title_color', 'text_color', 'ring_color'] as const;
    customKeys.forEach(key => {
      const val = searchParams.get(key);
      if (val) (theme as any)[key] = val;
    });

    if (searchParams.get('hide_border') === 'true') {
      theme.border_color = 'transparent';
    }

    // repos data is shared with /api/lang via the same cache key. Both cache
    // reads (and, on a cold cache, both GitHub calls) run in parallel instead
    // of the route waiting on them one after another.
    const [repoData, userMeta] = await Promise.all([
      cachedFetch(`repos:${username}`, () => fetchRepositories(username), { freshSeconds: FRESH_SECONDS, staleSeconds: STALE_SECONDS }),
      cachedFetch(`user_meta:${username}`, () => fetchUserMeta(username), { freshSeconds: FRESH_SECONDS, staleSeconds: STALE_SECONDS }),
    ]);

    if (!repoData || !userMeta) {
      const errorSvg = generateErrorSVG(`User ${username} not found on GitHub`, theme, 495, hideTitleParam ? 150 : 195);
      return new NextResponse(errorSvg, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store' },
      });
    }

    const rankData = calculateRank({ ...userMeta, repositories: repoData.repositories });

    const svg = generateRankSVG(username, rankData, theme, { hideTitle: hideTitleParam });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    const errorSvg = generateErrorSVG(error.message || 'An unexpected error occurred', getTheme(themeParam), 495, hideTitleParam ? 150 : 195);
    return new NextResponse(errorSvg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store' },
    });
  }
}
