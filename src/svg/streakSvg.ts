import { Theme } from '@/config/themes';
import { LocaleStrings } from '@/config/locales';
import { escapeHTML } from '@/lib/security';

export function generateSVG(
  username: string,
  stats: {
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
    totalDateRange: string;
    currentStreakRange: string;
    longestStreakRange: string;
  },
  theme: Theme,
  strings: LocaleStrings,
  options?: { hideTitle?: boolean }
) {
  const {
    bg_color,
    border_color,
    title_color,
    text_color,
    ring_color,
    fire_color,
    currStreakNum_color,
    sideNums_color,
    currStreakLabel_color,
    sideLabels_color,
    dates_color,
  } = theme;

  const bgFill = bg_color.toLowerCase() === 'transparent' ? 'transparent' : `#${bg_color}`;
  const borderStroke = border_color.toLowerCase() === 'transparent' ? 'transparent' : `#${border_color}`;

  const hideTitle = options?.hideTitle || false;
 
  const yOffset = hideTitle ? -9 : 16;
  const safeUsername = escapeHTML(username);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="isolation: isolate" viewBox="0 0 495 195" width="495px" height="195px" direction="ltr">
      
      <defs>
        <clipPath id="outer_rectangle">
          <rect width="495" height="195" rx="4.5"/>
        </clipPath>
      </defs>
      
      <g clip-path="url(#outer_rectangle)">
        <g style="isolation: isolate">
          <rect stroke="${borderStroke}" fill="${bgFill}" rx="4.5" x="0.5" y="0.5" width="494" height="194"/>
        </g>
        
        <g style="isolation: isolate">
          <line x1="165" y1="${38 + yOffset}" x2="165" y2="${168 + yOffset}" vector-effect="non-scaling-stroke" stroke-width="1" stroke="#${border_color}" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
          <line x1="330" y1="${38 + yOffset}" x2="330" y2="${168 + yOffset}" vector-effect="non-scaling-stroke" stroke-width="1" stroke="#${border_color}" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
        </g>
${!hideTitle ? `
        <g transform="translate(25, 35)">
          <text x="0" y="0" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="18px" fill="#${title_color}">${strings.title.replace('{username}', safeUsername)}</text>
        </g>
        ` : ''}

        <g style="isolation: isolate">
<g transform="translate(82.5, ${48 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="28px" fill="#${sideNums_color}">${stats.totalContributions}</text>
          </g>
          <g transform="translate(82.5, ${108 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="14px" fill="#${sideLabels_color}">${strings.totalContributions}</text>
          </g>
          <g transform="translate(82.5, ${128 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="10px" fill="#${dates_color}">${stats.totalDateRange}</text>
          </g>
        </g>

        <g style="isolation: isolate">
<g transform="translate(247.5, ${108 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="14px" fill="#${currStreakLabel_color}">${strings.currentStreak}</text>
          </g>

          <g>
            <circle cx="247.5" cy="${71 + yOffset}" r="40" fill="none" stroke="#${ring_color}" stroke-width="5" stroke-dasharray="215.3 36" stroke-dashoffset="233.3" transform="rotate(-90 247.5 ${71 + yOffset})"></circle>
          </g>

          <g transform="translate(247.5, ${19.5 + yOffset})">
            <path d="M -12 -0.5 L 15 -0.5 L 15 23.5 L -12 23.5 L -12 -0.5 Z" fill="none"/>
            <path d="M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z" fill="#${fire_color}"/>
          </g>

          <g transform="translate(247.5, ${48 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="28px" fill="#${currStreakNum_color}">${stats.currentStreak}</text>
          </g>
          <g transform="translate(247.5, ${128 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="10px" fill="#${dates_color}">${stats.currentStreakRange}</text>
          </g>
        </g>

        <g style="isolation: isolate">
<g transform="translate(412.5, ${48 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="28px" fill="#${sideNums_color}">${stats.longestStreak}</text>
          </g>
          <g transform="translate(412.5, ${108 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="14px" fill="#${sideLabels_color}">${strings.longestStreak}</text>
          </g>
          <g transform="translate(412.5, ${128 + yOffset})">
            <text x="0" y="32" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="10px" fill="#${dates_color}">${stats.longestStreakRange}</text>
          </g>
        </g>
      </g>
    </svg>
  `;
}
