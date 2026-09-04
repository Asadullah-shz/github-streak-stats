import { fetchContributions } from '@/lib/github';
import { cachedFetch } from '@/lib/redis';
import { generateGraphSVG } from '@/svg/graphSvg';
import { handleSvgRequest, UserNotFoundError } from '@/lib/api';
import { getLocale } from '@/config/locales';

export const runtime = 'edge';

const FRESH_SECONDS = 1800;
const STALE_SECONDS = 604800;

export function GET(request: import('next/server').NextRequest) {
  return handleSvgRequest(request, {
    defaultHideTitle: true,
    customKeys: ['bg_color', 'border_color', 'title_color', 'text_color', 'ring_color', 'fire_color', 'currStreakNum_color', 'sideNums_color', 'currStreakLabel_color', 'sideLabels_color', 'dates_color'],
    errorSize: { width: 840, height: hideTitle => hideTitle ? 210 : 260 },
    render: async ({ searchParams, username, theme, hideTitle }) => {
      const localeStrings = getLocale(searchParams.get('locale') || 'en');
      const yearValue = searchParams.get('year');
      const year = yearValue && /^\d{4}$/.test(yearValue) ? Number(yearValue) : undefined;
      const animation = searchParams.get('animation') || 'fade';
      const cacheKey = year ? `contrib:${username}:${year}` : `contrib:${username}`;
      const contributions = await cachedFetch(cacheKey, () => fetchContributions(username, year), {
        freshSeconds: FRESH_SECONDS,
        staleSeconds: STALE_SECONDS,
      });
      if (!contributions) throw new UserNotFoundError();
      const stats = {
        totalContributions: contributions.contributionsCollection.contributionCalendar.totalContributions,
        weeks: contributions.contributionsCollection.contributionCalendar.weeks,
      };
      return generateGraphSVG(username, stats, theme, localeStrings, { hideTitle, animation });
    },
  });
}
