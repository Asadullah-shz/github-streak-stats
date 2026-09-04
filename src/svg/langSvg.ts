import { Theme } from '@/config/themes';
import { escapeHTML } from '@/lib/security';
import { minifySVG } from '@/lib/minify';

export function generateLangSVG(
  username: string,
  langs: Array<{ name: string; color: string; percent: number }>,
  theme: Theme,
  options?: { hideTitle?: boolean }
) {
  const {
    bg_color,
    border_color,
    title_color,
    text_color,
    sideLabels_color,
  } = theme;

  const bgFill = bg_color.toLowerCase() === 'transparent' ? 'transparent' : `#${bg_color}`;
  const borderStroke = border_color.toLowerCase() === 'transparent' ? 'transparent' : `#${border_color}`;
  const safeUsername = escapeHTML(username);

  const hideTitle = options?.hideTitle || false;
  const svgWidth = 495;
  const svgHeight = hideTitle ? 150 : 195;
  const yOffset = hideTitle ? -35 : 0;

  let progressBarSvg = '';
  let currentX = 0;
  langs.forEach((lang) => {

    const width = (lang.percent / 100) * 400;
    progressBarSvg += `<rect x="${currentX}" y="0" width="${width}" height="12" fill="${lang.color}" />`;
    currentX += width;
  });

  let langListSvg = '';
  langs.forEach((lang, i) => {
    const col = i % 2; // 0 or 1
    const row = Math.floor(i / 2); // 0, 1, 2
    
    const xPos = col === 0 ? 0 : 220;
    const yPos = row * 28;
    
    langListSvg += `
      <g transform="translate(${xPos}, ${yPos})" style="opacity: 0; animation: fadein 0.5s ease forwards ${(i * 0.1 + 0.3).toFixed(2)}s;">
        <circle cx="5" cy="5" r="5" fill="${lang.color}" />
        <text x="18" y="9" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="12px" fill="#${text_color}">${lang.name}</text>
        <text x="${110}" y="9" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="12px" fill="#${sideLabels_color}">${lang.percent.toFixed(1)}%</text>
      </g>
    `;
  });

  return minifySVG(`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="isolation: isolate" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}px" height="${svgHeight}px" direction="ltr">
      
      <style>
        @keyframes fadein {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .progress-bar {
          opacity: 0;
          animation: fadein 0.8s ease forwards 0.2s;
        }
      </style>

      <defs>
        <clipPath id="outer_rectangle">
          <rect width="${svgWidth}" height="${svgHeight}" rx="4.5"/>
        </clipPath>
        <clipPath id="progress_clip">
          <rect width="400" height="12" rx="6"/>
        </clipPath>
      </defs>
      
      <g clip-path="url(#outer_rectangle)">
        <g style="isolation: isolate">
          <rect stroke="${borderStroke}" fill="${bgFill}" rx="4.5" x="0.5" y="0.5" width="${svgWidth - 1}" height="${svgHeight - 1}"/>
        </g>
${!hideTitle ? `
        <g style="isolation: isolate">
          <text x="25" y="35" transform="translate(0,0)" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="18px" fill="#${title_color}">${safeUsername}'s Top Languages</text>
        </g>
        ` : ''}
<g transform="translate(48, ${65 + yOffset})">
<g class="progress-bar" clip-path="url(#progress_clip)">
            ${progressBarSvg}
          </g>
<g transform="translate(0, 35)">
            ${langListSvg}
          </g>
          
        </g>
      </g>
    </svg>
  `);
}
