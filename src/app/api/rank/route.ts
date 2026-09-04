import { fetchRepositories, fetchUserMeta } from '@/lib/github';
import { cachedFetch } from '@/lib/redis';
import { calculateRank } from '@/utils/calculations';
import { generateRankSVG } from '@/svg/rankSvg';
import { handleSvgRequest, UserNotFoundError } from '@/lib/api';

export const runtime = 'edge';

const FRESH_SECONDS = 1800;
const STALE_SECONDS = 604800;

export function GET(request: import('next/server').NextRequest) {
  return handleSvgRequest(request, {
    defaultHideTitle: false,
    customKeys: ['bg_color', 'border_color', 'title_color', 'text_color', 'ring_color'],
    errorSize: { width: 495, height: hideTitle => hideTitle ? 150 : 195 },
    render: async ({ username, theme, hideTitle }) => {
      const [repoData, userMeta] = await Promise.all([
        cachedFetch(`repos:${username}`, () => fetchRepositories(username), { freshSeconds: FRESH_SECONDS, staleSeconds: STALE_SECONDS }),
        cachedFetch(`user_meta:${username}`, () => fetchUserMeta(username), { freshSeconds: FRESH_SECONDS, staleSeconds: STALE_SECONDS }),
      ]);
      if (!repoData || !userMeta) throw new UserNotFoundError();
      const rankData = calculateRank({ ...userMeta, repositories: repoData.repositories });
      return generateRankSVG(username, rankData, theme, { hideTitle });
    },
  });
}
