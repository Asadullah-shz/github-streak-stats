import { Theme } from '@/config/themes';
import { escapeHTML } from '@/lib/security';
import { minifySVG } from '@/lib/minify';

interface RankData {
  rank: string;
  percentile: number;
  stars: number;
  commits: number;
  pullRequests: number;
  issues: number;
  followers: number;
  score: number;
}

export function generateRankSVG(
  username: string,
  rankData: RankData,
  theme: Theme,
  options?: { hideTitle?: boolean }
) {
  const {
    bg_color,
    border_color,
    title_color,
    text_color,
    ring_color,
    fire_color,
  } = theme;

  const bgFill = bg_color.toLowerCase() === 'transparent' ? 'transparent' : `#${bg_color}`;
  const borderStroke = border_color.toLowerCase() === 'transparent' ? 'transparent' : `#${border_color}`;
  const safeUsername = escapeHTML(username);

  const hideTitle = options?.hideTitle || false;
  const svgWidth = 495;
  const svgHeight = hideTitle ? 150 : 195;
  const yOffset = hideTitle ? -20 : 0;

  let rankColor = `#${ring_color}`; // Default to accent
  if (rankData.rank === 'S+') rankColor = '#FBB117'; // Gold
  else if (rankData.rank === 'S') rankColor = '#FBB117';
  else if (rankData.rank === 'A') rankColor = '#4ADE80'; // Green
  else if (rankData.rank === 'B') rankColor = '#60A5FA'; // Blue
  else rankColor = '#94A3B8'; // Slate

  return minifySVG(`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="isolation: isolate" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}px" height="${svgHeight}px" direction="ltr">
      <style>
        @keyframes fadein {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.8) translate(70px, ${75 + yOffset}px); }
          50% { transform: scale(1.1) translate(70px, ${75 + yOffset}px); }
          100% { opacity: 1; transform: scale(1) translate(70px, ${75 + yOffset}px); }
        }
        .stat { opacity: 0; animation: fadein 0.5s ease forwards; }
        .rank-circle { opacity: 0; transform-origin: center; animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s; }
      </style>
      
      <defs>
        <clipPath id="outer_rectangle">
          <rect width="${svgWidth}" height="${svgHeight}" rx="4.5"/>
        </clipPath>
      </defs>
      
      <g clip-path="url(#outer_rectangle)">
        <g style="isolation: isolate">
          <rect stroke="${borderStroke}" fill="${bgFill}" rx="4.5" x="0.5" y="0.5" width="${svgWidth - 1}" height="${svgHeight - 1}"/>
        </g>
${!hideTitle ? `
        <g style="isolation: isolate">
          <text x="25" y="35" transform="translate(0,0)" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="18px" fill="#${title_color}">${safeUsername}'s GitHub Rank</text>
        </g>
        ` : ''}
<g class="rank-circle" style="transform: translate(70px, ${75 + yOffset}px)">
          <circle cx="45" cy="45" r="45" fill="transparent" stroke="${rankColor}" stroke-width="6" stroke-dasharray="283" stroke-dashoffset="0" />
          <text x="45" y="58" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="800" font-size="42px" fill="#${title_color}">${rankData.rank}</text>
          <text x="45" y="115" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="12px" fill="#${text_color}">Top ${rankData.percentile}%</text>
        </g>
<g transform="translate(220, ${45 + yOffset})">
<g class="stat" style="animation-delay: 0.4s;">
            <svg x="0" y="0" viewBox="0 0 16 16" version="1.1" width="16" height="16">
              <path fill="#${title_color}" fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
            </svg>
            <text x="25" y="12" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="13px" fill="#${text_color}">Total Stars Earned</text>
            <text x="230" y="12" text-anchor="end" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="13px" fill="#${title_color}">${rankData.stars}</text>
          </g>
<g class="stat" style="animation-delay: 0.5s;">
            <svg x="0" y="25" viewBox="0 0 16 16" version="1.1" width="16" height="16">
              <path fill="#${title_color}" fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path>
            </svg>
            <text x="25" y="37" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="13px" fill="#${text_color}">Total Commits</text>
            <text x="230" y="37" text-anchor="end" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="13px" fill="#${title_color}">${rankData.commits}</text>
          </g>
<g class="stat" style="animation-delay: 0.6s;">
            <svg x="0" y="50" viewBox="0 0 16 16" version="1.1" width="16" height="16">
              <path fill="#${title_color}" fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>
            </svg>
            <text x="25" y="62" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="13px" fill="#${text_color}">Total Pull Requests</text>
            <text x="230" y="62" text-anchor="end" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="13px" fill="#${title_color}">${rankData.pullRequests}</text>
          </g>
<g class="stat" style="animation-delay: 0.7s;">
            <svg x="0" y="75" viewBox="0 0 16 16" version="1.1" width="16" height="16">
              <path fill="#${title_color}" fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path>
            </svg>
            <text x="25" y="87" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="13px" fill="#${text_color}">Total Issues</text>
            <text x="230" y="87" text-anchor="end" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="13px" fill="#${title_color}">${rankData.issues}</text>
          </g>
<g class="stat" style="animation-delay: 0.8s;">
            <svg x="0" y="100" viewBox="0 0 16 16" version="1.1" width="16" height="16">
              <path fill="#${title_color}" fill-rule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-3.427-3.41 3 3 0 00-1.353-5.61z"></path>
            </svg>
            <text x="25" y="112" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="13px" fill="#${text_color}">Total Followers</text>
            <text x="230" y="112" text-anchor="end" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="13px" fill="#${title_color}">${rankData.followers}</text>
          </g>
        </g>
      </g>
    </svg>
  `);
}
