
export function minifySVG(svg: string): string {
  return svg
    .replace(/>\s+</g, '><')
    .trim();
}
