# Contributing to GitHub Streak Stats

First off, thank you for considering contributing to this project! It's people like you that make open-source such a great community.

## Local Development Setup

1. **Fork the repository** and clone it locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your `GITHUB_TOKEN` (Create a Personal Access Token on GitHub).
   - Add your `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Create a free Redis DB on Upstash).
4. Start the development server:
   ```bash
   npm run dev
   ```

## Adding a New Theme

If you want to contribute a new color theme:
1. Open `src/utils/themes.ts`.
2. Add a new object to the `themes` export with your custom colors (without the `#` hex symbol).
3. Open a Pull Request!

## Adding a New Card Type

If you want to build a completely new SVG card:
1. Create a new SVG generator in `src/utils/`.
2. Create a new API route in `src/app/api/[card-name]/route.ts`.
3. Ensure you wrap your API route with the `escapeHTML` security utility and Redis caching logic!

## Code Style

- We use standard Next.js conventions with the App Router.
- We use Tailwind CSS for the frontend UI.
- All SVG logic should be completely decoupled from the Next.js API routes (kept in `src/utils`).

Thank you for contributing!
