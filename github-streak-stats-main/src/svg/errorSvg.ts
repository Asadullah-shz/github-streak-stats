import { Theme } from '@/config/themes';
import { escapeHTML } from '@/lib/security';
import { minifySVG } from '@/lib/minify';

export function generateErrorSVG(
  message: string,
  theme: Theme,
  width: number = 495,
  height: number = 195
) {
  const {
    bg_color,
    border_color,
    title_color,
    text_color,
  } = theme;

  const bgFill = bg_color.toLowerCase() === 'transparent' ? 'transparent' : `#${bg_color}`;
  const borderStroke = border_color.toLowerCase() === 'transparent' ? 'transparent' : `#${border_color}`;
  
  const safeErrorMessage = escapeHTML(message);

  return minifySVG(`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="isolation: isolate" viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px" direction="ltr">
      <defs>
        <clipPath id="outer_rectangle">
          <rect width="${width}" height="${height}" rx="4.5"/>
        </clipPath>
      </defs>
      
      <g clip-path="url(#outer_rectangle)">
        <g style="isolation: isolate">
          <rect stroke="${borderStroke}" fill="${bgFill}" rx="4.5" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}"/>
        </g>
        
        <g transform="translate(${width / 2}, ${height / 2})">
          <text x="0" y="-10" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="18px" fill="#${title_color}">An error occurred</text>
          <text x="0" y="15" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="14px" fill="#${text_color}">${safeErrorMessage}</text>
        </g>
      </g>
    </svg>
  `);
}
