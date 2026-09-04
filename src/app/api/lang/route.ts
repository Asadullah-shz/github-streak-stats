import { fetchRepositories } from '@/lib/github';
import { cachedFetch } from '@/lib/redis';
import { processLanguageStats } from '@/utils/calculations';
import { generateLangSVG } from '@/svg/langSvg';
import { handleSvgRequest, UserNotFoundError } from '@/lib/api';

export const runtime = 'edge';

const FRESH_SECONDS = 1800;
const STALE_SECONDS = 604800;

export function GET(request: import('next/server').NextRequest) {
  return handleSvgRequest(request, {
    defaultHideTitle: false,
    customKeys: ['bg_color', 'border_color', 'title_color', 'text_color', 'sideLabels_color'],
    errorSize: { width: 495, height: hideTitle => hideTitle ? 150 : 195 },
    render: async ({ searchParams, username, theme, hideTitle }) => {
      const excludes = (searchParams.get('exclude_langs') || '').split(',').filter(Boolean);
      const rawData = await cachedFetch(`repos:${username}`, () => fetchRepositories(username), {
        freshSeconds: FRESH_SECONDS,
        staleSeconds: STALE_SECONDS,
      });
      if (!rawData) throw new UserNotFoundError();
      return generateLangSVG(username, processLanguageStats(rawData, excludes), theme, { hideTitle });
    },
  });
}
