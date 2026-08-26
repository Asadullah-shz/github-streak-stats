import { NextRequest, NextResponse } from 'next/server';
import { fetchRankData } from '@/lib/github';
import { calculateRank } from '@/utils/calculations';
import { generateRankSVG } from '@/svg/rankSvg';
import { generateErrorSVG } from '@/svg/errorSvg';
import { getTheme, Theme } from '@/config/themes';
import { getRedisClient } from '@/lib/redis';

export const runtime = 'edge';

const redis = getRedisClient();

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

    const cacheKey = `rank_stats:${username}`;
    let rankData: any = null;

    if (redis) {
      try {
        rankData = await redis.get(cacheKey);
      } catch (e) {
        console.error('Redis cache GET error:', e);
      }
    }

    if (!rankData) {
      const rawData = await fetchRankData(username);
      
      if (!rawData) {
        const errorSvg = generateErrorSVG(`User ${username} not found on GitHub`, theme, 495, hideTitleParam ? 150 : 195);
        return new NextResponse(errorSvg, {
          headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store' },
        });
      }

      rankData = calculateRank(rawData);
      
      if (redis) {
        try {
          await redis.setex(cacheKey, 14400, JSON.stringify(rankData));
        } catch (e) {
          console.error('Redis cache SET error:', e);
        }
      }
    } else if (typeof rankData === 'string') {
      rankData = JSON.parse(rankData);
    }

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
