# GitHub Streak Stats

Showcase your GitHub contributions, current streak, top languages, and GitHub rank on your profile README with perfectly aligned SVG graphics.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdevencoder%2Fgithub-streak-stats&env=GITHUB_TOKEN,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN&project-name=github-streak-stats&repo-name=github-streak-stats)

## 🔥 Features
- **4 Custom Cards**: Streak Stats, Contribution Graph, Top Languages, and GitHub Rank (S+, S, A, B, C).
- **Interactive Builder UI**: A sleek, live-preview React frontend where users can pick from 30+ themes or design their own custom hex colors using visual pickers.
- **Enterprise Reliability**: Zero-downtime architecture using Upstash Redis fallback caching and GitHub Token Pooling.
- **Vercel Edge Runtime**: Global, sub-millisecond API execution speeds.
- **Custom Animations**: Laser Scanner, Sparkles, Matrix Rain, and Breathing Pulse.
- **Rock-Solid Security**: Full XSS sanitization and robust CORS/HTTP security headers.

## 🚀 Setup Instructions
1. Click the **Deploy with Vercel** button above.
2. Generate a [GitHub Personal Access Token](https://github.com/settings/tokens) (no special scopes needed for public repos).
3. Create a free Redis database on [Upstash](https://upstash.com/).
4. Enter the Environment Variables during deployment:
   - `GITHUB_TOKEN`: Your comma-separated list of GitHub tokens (e.g. `token1,token2`).
   - `UPSTASH_REDIS_REST_URL`: Provided by Upstash.
   - `UPSTASH_REDIS_REST_TOKEN`: Provided by Upstash.

Once deployed, visit your Vercel URL to use the visual Premium Card Builder!

## 🤝 Contributing
We love open-source! This project is built using modern **Next.js (App Router)** and **Tailwind CSS**. 
The codebase is cleanly separated into routing (`src/app`), core logic (`src/lib`), and visual generators (`src/svg`). 

Check out [CONTRIBUTING.md](CONTRIBUTING.md) to see how to run the project locally and add your own custom cards and themes.

---
Created with ❤️ by [Asad (Devencoder)](https://github.com/Asadullah-shz)
