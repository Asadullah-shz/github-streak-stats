import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions } from '@/lib/github';
import { cachedFetch } from '@/lib/redis';
import { generateGraphSVG } from '@/svg/graphSvg';
import { generateErrorSVG } from '@/svg/errorSvg';
import { getTheme, Theme } from '@/config/themes';
import { getLocale } from '@/config/locales';

export const runtime = 'edge';

const FRESH_SECONDS = 1800;      // 30 min: serve straight from cache, no revalidation
const STALE_SECONDS = 604800;    // 7 days: outer bound before a truly synchronous refetch

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('user');
  const themeParam = searchParams.get('theme') || 'default';
  const localeParam = searchParams.get('locale') || 'en';
  const hideTitleParam = searchParams.get('hide_title') ? searchParams.get('hide_title') === 'true' : true;
  const yearParam = searchParams.get('year') ? parseInt(searchParams.get('year') as string, 10) : undefined;
  const animationParam = searchParams.get('animation') || 'fade';

  if (!username) {
    return new NextResponse('Missing user parameter', { status: 400 });
  }

  try {
    const baseTheme = getTheme(themeParam);
    const localeStrings = getLocale(localeParam);

    const theme: Theme = { ...baseTheme };
    const customKeys = ['bg_color', 'border_color', 'title_color', 'text_color', 'ring_color', 'fire_color', 'currStreakNum_color', 'sideNums_color', 'currStreakLabel_color', 'sideLabels_color', 'dates_color'] as const;
    customKeys.forEach(key => {
      const val = searchParams.get(key);
      if (val) (theme as any)[key] = val;
    });

    if (searchParams.get('hide_border') === 'true') {
      theme.border_color = 'transparent';
    }

    // Same cache key shape as /api/streak when no year is given: a README
    // embedding both cards reuses one cached GitHub call. A year filter
    // still gets its own cache entry since it's a different data slice.
    const cacheKey = yearParam ? `contrib:${username}:${yearParam}` : `contrib:${username}`;
    const contributions = await cachedFetch(cacheKey, () => fetchContributions(username, yearParam), { freshSeconds: FRESH_SECONDS, staleSeconds: STALE_SECONDS });

    if (!contributions) {
      const errorSvg = generateErrorSVG(`User ${username} not found on GitHub`, theme, 840, hideTitleParam ? 210 : 260);
      return new NextResponse(errorSvg, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store' },
      });
    }

    const stats = {
      totalContributions: contributions.contributionsCollection.contributionCalendar.totalContributions,
      weeks: contributions.contributionsCollection.contributionCalendar.weeks,
    };

    const svg = generateGraphSVG(username, stats, theme, localeStrings, { hideTitle: hideTitleParam, animation: animationParam });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    const errorSvg = generateErrorSVG(error.message || 'An unexpected error occurred', getTheme(themeParam), 840, hideTitleParam ? 210 : 260);
    return new NextResponse(errorSvg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store' },
    });
  }
}
