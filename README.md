# GitHub Streak Stats

Showcase your GitHub contributions, current streak, and longest streak on your profile README with perfectly aligned SVG graphics.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fgithub-streak-stats&env=GITHUB_TOKEN,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN&project-name=github-streak-stats&repo-name=github-streak-stats)

## Features
- **4 Custom Cards**: Streak Stats, Contribution Graph, Top Languages, and GitHub Rank.
- **Enterprise Reliability**: Zero-downtime architecture using Upstash Redis fallback caching and GitHub Token Pooling.
- **Vercel Edge Runtime**: Global, sub-millisecond API execution speeds.
- **Custom Animations**: Laser Scanner, Sparkles, Matrix Rain, and Breathing Pulse.

## Setup Instructions
1. Click the **Deploy with Vercel** button above.
2. Generate a [GitHub Personal Access Token](https://github.com/settings/tokens) (no special scopes needed for public repos).
3. Create a free Redis database on [Upstash](https://upstash.com/).
4. Enter the Environment Variables during deployment:
   - `GITHUB_TOKEN`: Your comma-separated list of GitHub tokens (e.g. `token1,token2`).
   - `UPSTASH_REDIS_REST_URL`: Provided by Upstash.
   - `UPSTASH_REDIS_REST_TOKEN`: Provided by Upstash.

Once deployed, visit your Vercel URL to use the visual Premium Card Builder!
