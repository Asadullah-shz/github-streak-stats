import { NextRequest, NextResponse } from 'next/server';
import { getTheme, Theme } from '@/config/themes';
import { generateErrorSVG } from '@/svg/errorSvg';

const HEX_COLOR = /^(?:[0-9a-fA-F]{3,8}|transparent)$/;
const GITHUB_USERNAME = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

export interface SvgRouteContext {
  searchParams: URLSearchParams;
  username: string;
  theme: Theme;
  themeParam: string;
  hideTitle: boolean;
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found on GitHub');
  }
}

interface SvgRouteOptions {
  defaultHideTitle: boolean;
  customKeys: readonly (keyof Theme)[];
  errorSize: { width: number; height: (hideTitle: boolean) => number };
  render: (context: SvgRouteContext) => Promise<string>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred';
}

function applyThemeOverrides(theme: Theme, searchParams: URLSearchParams, keys: readonly (keyof Theme)[]): Theme {
  const result = { ...theme };
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value && HEX_COLOR.test(value)) {
      result[key] = value;
    }
  }
  if (searchParams.get('hide_border') === 'true') {
    result.border_color = 'transparent';
  }
  return result;
}

function svgResponse(svg: string, cacheControl = 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400'): NextResponse {
  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': cacheControl },
  });
}

export async function handleSvgRequest(request: NextRequest, options: SvgRouteOptions): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('user');
  const themeParam = searchParams.get('theme') || 'default';
  const hideTitle = searchParams.get('hide_title')
    ? searchParams.get('hide_title') === 'true'
    : options.defaultHideTitle;

  if (!username) {
    return new NextResponse('Missing user parameter', { status: 400 });
  }
  if (!GITHUB_USERNAME.test(username)) {
    return new NextResponse('Invalid user parameter', { status: 400 });
  }

  const theme = applyThemeOverrides(getTheme(themeParam), searchParams, options.customKeys);
  const context: SvgRouteContext = { searchParams, username, theme, themeParam, hideTitle };

  try {
    return svgResponse(await options.render(context));
  } catch (error: unknown) {
    const errorSvg = generateErrorSVG(
      getErrorMessage(error),
      theme,
      options.errorSize.width,
      options.errorSize.height(hideTitle),
    );
    return svgResponse(errorSvg, 'no-cache, no-store');
  }
}
