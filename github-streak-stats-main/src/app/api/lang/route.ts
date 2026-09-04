import { NextRequest, NextResponse } from 'next/server';
import { fetchRepositories } from '@/lib/github';
import { cachedFetch } from '@/lib/redis';
import { processLanguageStats } from '@/utils/calculations';
import { generateLangSVG } from '@/svg/langSvg';
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
  const excludeLangsParam = searchParams.get('exclude_langs') || '';
  const excludeLangs = excludeLangsParam ? excludeLangsParam.split(',') : [];

  if (!username) {
    return new NextResponse('Missing user parameter', { status: 400 });
  }

  try {
    const baseTheme = getTheme(themeParam);
    const theme: Theme = { ...baseTheme };
    const customKeys = ['bg_color', 'border_color', 'title_color', 'text_color', 'sideLabels_color'] as const;
    customKeys.forEach(key => {
      const val = searchParams.get(key);
      if (val) (theme as any)[key] = val;
    });

    if (searchParams.get('hide_border') === 'true') {
      theme.border_color = 'transparent';
    }

    // Same cache key as /api/rank uses for its repo data. The exclude_langs
    // filter is applied after this shared fetch rather than baked into the
    // cache key, so different exclude_langs values for the same user reuse
    // one cached repo list instead of triggering a separate GitHub call each.
    const cacheKey = `repos:${username}`;
    const rawData = await cachedFetch(cacheKey, () => fetchRepositories(username), { freshSeconds: FRESH_SECONDS, staleSeconds: STALE_SECONDS });

    if (!rawData) {
      const errorSvg = generateErrorSVG(`User ${username} not found on GitHub`, theme, 495, hideTitleParam ? 150 : 195);
      return new NextResponse(errorSvg, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store' },
      });
    }

    const stats = processLanguageStats(rawData, excludeLangs);

    const svg = generateLangSVG(username, stats, theme, { hideTitle: hideTitleParam });

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
