import { Theme } from '@/config/themes';
import { LocaleStrings } from '@/config/locales';
import { escapeHTML } from '@/lib/security';

export function generateGraphSVG(
  username: string,
  stats: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
      }>;
    }>;
  },
  theme: Theme,
  strings: LocaleStrings,
  options?: { hideTitle?: boolean; animation?: string }
) {
  const {
    bg_color,
    border_color,
    title_color,
    text_color,
    ring_color,
    sideNums_color,
    sideLabels_color,
  } = theme;

  const bgFill = bg_color.toLowerCase() === 'transparent' ? 'transparent' : `#${bg_color}`;
  const borderStroke = border_color.toLowerCase() === 'transparent' ? 'transparent' : `#${border_color}`;
  const safeUsername = escapeHTML(username);

  const hideTitle = options?.hideTitle || false;
  const yOffset = hideTitle ? -45 : 0;

  const svgWidth = 840;
  const svgHeight = hideTitle ? 210 : 260;

  const cellSize = 11;
  const cellGap = 4;
  const cellTotal = cellSize + cellGap; // 15px per column/row

  const numWeeks = stats.weeks.length; // usually 52 or 53
  const gridWidth = numWeeks * cellTotal;
  const startX = (svgWidth - (gridWidth + 30)) / 2 + 30;
  const startY = 80 + yOffset;

  const getLevelColor = (count: number) => {
    if (count === 0) return `fill="#777777" fill-opacity="0.15"`;
    if (count <= 3) return `fill="#${ring_color}" fill-opacity="0.4"`;
    if (count <= 6) return `fill="#${ring_color}" fill-opacity="0.6"`;
    if (count <= 9) return `fill="#${ring_color}" fill-opacity="0.8"`;
    return `fill="#${ring_color}" fill-opacity="1.0"`;
  };

  let gridSvg = '';
  let flashSvg = '';
  let monthsSvg = '';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let currentMonth = -1;
  const animType = options?.animation || 'fade';
  const isScanner = animType === 'scanner';
  const isPulse = animType === 'pulse';
  const isMatrix = animType === 'matrix';
  const isSparkles = animType === 'sparkles';
  const isTyping = animType === 'typing';
  const isOverlayAnim = isScanner || isPulse || isMatrix || isSparkles || isTyping;
  
  stats.weeks.forEach((week, weekIndex) => {
  
    const delay = (weekIndex * 0.03).toFixed(2);

    let columnSvg = `<g transform="translate(${weekIndex * cellTotal}, 0)" class="anim-col" style="animation-delay: ${delay}s">`;
    
    week.contributionDays.forEach((day) => {
      const colorAttr = getLevelColor(day.contributionCount);
      const weekday = new Date(day.date).getUTCDay(); // 0 (Sun) to 6 (Sat)
      const yPos = weekday * cellTotal;
      columnSvg += `<rect x="0" y="${yPos}" width="${cellSize}" height="${cellSize}" rx="2" ${colorAttr} />`;
      
      if (isOverlayAnim && day.contributionCount > 0) {
        let animClass = '';
        let animDelay = '0';
        
        if (isScanner) {
          animClass = 'flash-sq';
          animDelay = (0.5 + (weekIndex / numWeeks) * 3).toFixed(2);
        } else if (isPulse) {
          animClass = 'pulse-sq';
          animDelay = (0.5 + (weekIndex + weekday * 2) * 0.05).toFixed(2);
        } else if (isMatrix) {
          animClass = 'matrix-sq';
          animDelay = (0.5 + (weekday / 7) * 2).toFixed(2);
        } else if (isSparkles) {
          animClass = 'sparkle-sq';

          animDelay = (0.5 + Math.random() * 2.5).toFixed(2);
        } else if (isTyping) {
          animClass = 'typing-sq';

          animDelay = (0.5 + (weekIndex * 7 + weekday) * 0.005).toFixed(3);
        }
        
        flashSvg += `<rect x="${weekIndex * cellTotal}" y="${yPos}" width="${cellSize}" height="${cellSize}" rx="2" fill="#${ring_color}" class="${animClass}" style="animation-delay: ${animDelay}s" />`;
      }
    });
    
    columnSvg += `</g>`;
    gridSvg += columnSvg;

    if (week.contributionDays.length > 0) {
      const dateStr = week.contributionDays[0].date;
      const month = parseInt(dateStr.split('-')[1], 10) - 1;
      if (month !== currentMonth) {

        monthsSvg += `<text x="${weekIndex * cellTotal}" y="-8" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10px" fill="#${sideLabels_color}">${monthNames[month]}</text>`;
        currentMonth = month;
      }
    }
  });

  const daysSvg = `
    <text x="-30" y="${1 * cellTotal + 9}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10px" fill="#${sideLabels_color}">Mon</text>
    <text x="-30" y="${3 * cellTotal + 9}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10px" fill="#${sideLabels_color}">Wed</text>
    <text x="-30" y="${5 * cellTotal + 9}" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10px" fill="#${sideLabels_color}">Fri</text>
  `;

  const legendY = 7 * cellTotal + 25;
  const legendX = gridWidth - (5 * cellTotal + 70); 
  const legendSvg = `
    <g transform="translate(${legendX}, ${legendY})" style="opacity: 0; animation: fadein 0.8s ease forwards 0.6s;">
      <text x="0" y="10" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10px" fill="#${sideLabels_color}">Less</text>
      <rect x="30" y="1" width="${cellSize}" height="${cellSize}" rx="2" fill="#777777" fill-opacity="0.15" />
      <rect x="${30 + cellTotal}" y="1" width="${cellSize}" height="${cellSize}" rx="2" ${getLevelColor(1)} />
      <rect x="${30 + cellTotal * 2}" y="1" width="${cellSize}" height="${cellSize}" rx="2" ${getLevelColor(4)} />
      <rect x="${30 + cellTotal * 3}" y="1" width="${cellSize}" height="${cellSize}" rx="2" ${getLevelColor(7)} />
      <rect x="${30 + cellTotal * 4}" y="1" width="${cellSize}" height="${cellSize}" rx="2" ${getLevelColor(10)} />
      <text x="${30 + cellTotal * 5 + 5}" y="10" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="10px" fill="#${sideLabels_color}">More</text>
    </g>
  `;

  const laserSvg = isScanner ? `
    <rect class="laser-line" x="0" y="-5" width="2" height="${7 * cellTotal + 10}" fill="#${ring_color}" style="animation-delay: 0.5s;" />
  ` : '';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="isolation: isolate" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}px" height="${svgHeight}px" direction="ltr">
      
      <style>
        .anim-col {
          opacity: 0;
          animation: fadein 0.5s ease forwards;
        }
        @keyframes fadein {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        ${isScanner ? `
        .flash-sq {
          opacity: 0;
          animation: flash 3s forwards linear;
        }
        @keyframes flash {
          0% { opacity: 0; }
          2% { opacity: 1; }
          15% { opacity: 0; }
          100% { opacity: 0; }
        }
        .laser-line {
          opacity: 0;
          animation: sweep 3s forwards linear;
        }
        @keyframes sweep {
          0% { transform: translateX(0px); opacity: 0; }
          1% { opacity: 1; }
          99% { opacity: 1; }
          100% { transform: translateX(${gridWidth}px); opacity: 0; }
        }
        ` : ''}

        ${isPulse ? `
        .pulse-sq {
          opacity: 0;
          animation: pulseAnim 3s forwards ease-in-out;
        }
        @keyframes pulseAnim {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        ` : ''}

        ${isMatrix ? `
        .matrix-sq {
          opacity: 0;
          animation: matrixAnim 2s forwards linear;
        }
        @keyframes matrixAnim {
          0% { opacity: 0; }
          5% { opacity: 1; }
          30% { opacity: 0; }
          100% { opacity: 0; }
        }
        ` : ''}

        ${isSparkles ? `
        .sparkle-sq {
          opacity: 0;
          animation: sparkleAnim 3s forwards ease-in-out;
        }
        @keyframes sparkleAnim {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        ` : ''}

        ${isTyping ? `
        .typing-sq {
          opacity: 0;
          animation: typingAnim 1.5s forwards ease-out;
        }
        @keyframes typingAnim {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 0; }
        }
        ` : ''}
      </style>
      
      <defs>
        <clipPath id="outer_rectangle">
          <rect width="${svgWidth}" height="${svgHeight}" rx="6"/>
        </clipPath>
      </defs>
      
      <g clip-path="url(#outer_rectangle)">
<g style="isolation: isolate">
          <rect stroke="${borderStroke}" fill="${bgFill}" rx="6" x="0.5" y="0.5" width="${svgWidth - 1}" height="${svgHeight - 1}"/>
        </g>
${!hideTitle ? `
        <g transform="translate(${startX}, 35)">
          <text x="0" y="0" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="20px" fill="#${title_color}">
            ${safeUsername}'s Contribution Graph
          </text>
        </g>
        <g transform="translate(${startX}, 58)">
          <text x="0" y="0" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="14px" fill="#${sideNums_color}" style="opacity: 0; animation: fadein 0.8s ease forwards 0.2s;">
            ${stats.totalContributions} contributions in the last year
          </text>
        </g>
        ` : ''}
<g transform="translate(${startX}, ${startY + 15})">
          <g style="opacity: 0; animation: fadein 0.8s ease forwards 0.5s;">
            ${daysSvg}
            ${monthsSvg}
          </g>
          ${gridSvg}
          ${flashSvg}
          ${laserSvg}
          ${legendSvg}
        </g>
      </g>
    </svg>
  `;
}
