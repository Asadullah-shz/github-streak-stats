import { fetchContributions } from '@/lib/github';
import { cachedFetch } from '@/lib/redis';
import { calculateStats } from '@/utils/calculations';
import { generateSVG } from '@/svg/streakSvg';
import { getLocale } from '@/config/locales';
import { handleSvgRequest, UserNotFoundError } from '@/lib/api';

export const runtime = 'edge';

const FRESH_SECONDS = 1800;
const STALE_SECONDS = 604800;

export function GET(request: import('next/server').NextRequest) {
  return handleSvgRequest(request, {
    defaultHideTitle: true,
    customKeys: ['bg_color', 'border_color', 'title_color', 'text_color', 'ring_color', 'fire_color', 'currStreakNum_color', 'sideNums_color', 'currStreakLabel_color', 'sideLabels_color', 'dates_color'],
    errorSize: { width: 495, height: hideTitle => hideTitle ? 150 : 195 },
    render: async ({ searchParams, username, theme, hideTitle }) => {
      const localeStrings = getLocale(searchParams.get('locale') || 'en');
      const contributions = await cachedFetch(`contrib:${username}`, () => fetchContributions(username), {
        freshSeconds: FRESH_SECONDS,
        staleSeconds: STALE_SECONDS,
      });
      if (!contributions) throw new UserNotFoundError();
      const stats = calculateStats(contributions.contributionsCollection.contributionCalendar.weeks);
      return generateSVG(username, stats, theme, localeStrings, { hideTitle });
    },
  });
}
