import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions } from '@/lib/github';
import { calculateStats } from '@/utils/calculations';
import { generateSVG } from '@/svg/streakSvg';
import { generateErrorSVG } from '@/svg/errorSvg';
import { getTheme, Theme } from '@/config/themes';
import { getLocale } from '@/config/locales';
import { getRedisClient } from '@/lib/redis';

export const runtime = 'edge';

const redis = getRedisClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('user');
  const themeParam = searchParams.get('theme') || 'default';
  const localeParam = searchParams.get('locale') || 'en';
  const hideTitleParam = searchParams.get('hide_title') ? searchParams.get('hide_title') === 'true' : true;

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
      if (val) theme[key] = val;
    });

    if (searchParams.get('hide_border') === 'true') {
      theme.border_color = 'transparent';
    }

    const cacheKey = `streak_stats:${username}`;
    let stats: any = null;

    if (redis) {
      try {
        stats = await redis.get(cacheKey);
      } catch (e) {
        console.error('Redis cache GET error:', e);
      }
    }

    if (!stats) {

      const contributions = await fetchContributions(username);
      
      if (!contributions) {
        const errorSvg = generateErrorSVG(`User ${username} not found on GitHub`, theme, 495, hideTitleParam ? 150 : 195);
        return new NextResponse(errorSvg, {
          headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store' },
        });
      }

      stats = calculateStats(contributions.contributionsCollection.contributionCalendar.weeks);
      
      if (redis) {
        try {

          await redis.setex(cacheKey, 14400, JSON.stringify(stats));
        } catch (e) {
          console.error('Redis cache SET error:', e);
        }
      }
    } else if (typeof stats === 'string') {
      stats = JSON.parse(stats);
    }

    const svg = generateSVG(username, stats, theme, localeStrings, { hideTitle: hideTitleParam });

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
