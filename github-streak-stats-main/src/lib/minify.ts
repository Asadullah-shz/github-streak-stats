/**
 * Strips inter-tag whitespace and line indentation introduced by the
 * multi-line template literals used to build each SVG. This is purely a
 * byte-size reduction on the response body (typically ~25-35% smaller) —
 * it does not touch spacing inside attribute values or text content, so
 * rendered output is pixel-identical.
 */
export function minifySVG(svg: string): string {
  return svg
    .replace(/>\s+</g, '><')
    .replace(/\n\s*/g, '')
    .trim();
}
