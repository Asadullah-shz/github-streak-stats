# GitHub Streak Stats

**GitHub README stats generator** for displaying your GitHub streak, contribution graph, top languages, GitHub rank, and trophies directly on your profile README.

Create and customize your GitHub profile statistics with multiple themes, custom colors, animations, and different card styles — all from one place.

> ❤️ **Inspired by the original GitHub Readme Streak Stats project by [DenverCoder1](https://github.com/DenverCoder1/github-readme-streak-stats). Full respect to the original developer and contributors. This is an independent open-source alternative focused on additional features, fixes, and improvements.**

[![GitHub Stars](https://img.shields.io/github/stars/Asadullah-shz/Github-streak?style=flat)](https://github.com/Asadullah-shz/Github-streak/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Asadullah-shz/Github-streak?style=flat)](https://github.com/Asadullah-shz/Github-streak/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Asadullah-shz/Github-streak?style=flat)](https://github.com/Asadullah-shz/Github-streak/issues)
[![License](https://img.shields.io/github/license/Asadullah-shz/Github-streak)](https://github.com/Asadullah-shz/Github-streak/blob/main/LICENSE)

**🌐 [Live Website](https://github-streak-plum.vercel.app/)** · **💻 [GitHub Repository](https://github.com/Asadullah-shz/Github-streak)**

---

## 📊 What Can You Generate?

GitHub Streak Stats brings multiple GitHub profile README graphics together in one place.

* 🔥 **GitHub Streak Stats** — display your contribution streak
* 📈 **GitHub Contribution Graph** — visualize your contribution activity
* 💻 **Top Languages** — show your most-used programming languages
* 🏆 **GitHub Trophies** — showcase your GitHub achievements
* 🏅 **GitHub Rank** — display your GitHub activity rank
* 🎨 **Custom Themes** — choose from 30+ ready-to-use themes
* 🌈 **Custom Colors** — create your own theme using custom colors
* ✨ **Animated Cards** — add optional visual effects and animations
* 🌍 **Multiple Languages** — multilingual card support

Everything is available through a single GitHub README stats generator and visual builder.

---

## 🎨 Builder Preview

The project includes an interactive builder that lets you configure your GitHub profile cards and preview the result before adding it to your README.

### Customize

* GitHub username
* Card type
* Theme
* Background colors
* Text colors
* Border colors
* Accent colors
* Animation effects
* Language
* Other supported visual options

The visual builder makes it possible to create a GitHub profile README design without manually editing SVG parameters.

---

## 🔥 Features

### GitHub Streak Stats

Display your GitHub contribution streak directly in your profile README.

Show information such as:

* Current streak
* Longest streak
* Total contributions
* Contribution activity
* Customizable visual styling

### 📈 Contribution Graph

Generate a contribution-focused card for showcasing GitHub activity on your profile.

### 💻 Top Languages

Display your most-used programming languages in a customizable language card.

### 🏆 GitHub Trophies

Showcase GitHub achievements and profile trophies in your README.

### 🏅 GitHub Rank

Display your GitHub activity rank using supported ranking levels:

```text
S+
S
A
B
C
```

### 🎨 Multiple Themes

Choose from a collection of ready-to-use themes.

You can also create your own visual style using custom colors.

### 🌈 Custom Color Themes

Design your own GitHub README theme by customizing colors for different parts of the generated cards.

### ✨ Animations

Supported visual effects include:

* Laser Scanner
* Sparkles
* Matrix Rain
* Breathing Pulse
* Additional card animations

Animations can be used to make GitHub profile README graphics more dynamic while keeping them SVG-based.

### 🌍 Multiple Language Support

Generate supported cards in multiple languages so developers can personalize their GitHub profile experience.

---

## 💡 Why This Project?

This project started from a simple goal: improve some of the issues I experienced while using GitHub README streak statistics.

The focus is on:

* Improving reliability
* Reducing broken or unavailable README graphics
* Providing more customization
* Bringing multiple GitHub profile cards into one place
* Making custom themes easier to create
* Providing a visual configuration experience
* Keeping the project completely open source

The project is continuously evolving based on real-world usage, testing, bug reports, and community feedback.

---

## 🛡️ Reliability

A major focus of this project is keeping generated GitHub README graphics available and reducing issues such as:

* Broken README images
* Empty generated cards
* Temporary service failures
* API availability problems
* Unexpected service downtime

The application uses caching and GitHub token pooling to improve reliability and reduce unnecessary GitHub API requests.

> **Note:** No hosted service can guarantee 100% uptime. Reliability improvements depend on GitHub API availability, hosting infrastructure, caching services, and deployment configuration.

---

## 🔐 Security

Security is an important part of the project.

The application includes security-focused measures such as:

* SVG output sanitization
* XSS protection
* CORS configuration
* HTTP security headers
* Controlled API responses
* Environment-based secrets
* GitHub token handling

Never commit your GitHub Personal Access Token or other secrets directly to the repository.

---

## ⚡ Architecture

The project is built using modern web technologies and follows a modular structure.

### Core Technologies

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **SVG generation**
* **Vercel Edge Runtime**
* **Upstash Redis**
* **GitHub API**

### Project Structure

The main application is separated into areas such as:

```text
src/
├── app/        # Application routes and API endpoints
├── lib/        # Core application logic and utilities
└── svg/        # SVG/card generation
```

Additional project configuration and documentation can be found throughout the repository.

---

## 🚀 Quick Start

The easiest way to use GitHub Streak Stats is through the hosted builder.

### 1. Open the Website

Visit:

**https://github-streak-plum.vercel.app/**

### 2. Enter Your GitHub Username

Enter the GitHub username for which you want to generate statistics.

### 3. Choose a Card

Select the type of GitHub README statistic you want to display.

### 4. Customize It

Choose a theme or create your own custom color theme.

### 5. Preview

Use the live preview to see how your GitHub README graphic will look.

### 6. Add It to Your README

Copy the generated configuration/Markdown and add it to your GitHub profile README.

---

## ☁️ Deploy Your Own Instance

You can deploy your own instance using Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAsadullah-shz%2FGithub-streak&env=GITHUB_TOKEN,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN&project-name=github-streak-stats&repo-name=github-streak-stats)

### Requirements

* GitHub account
* GitHub Personal Access Token
* Vercel account
* Upstash Redis database

### Environment Variables

Configure the following environment variables:

```env
GITHUB_TOKEN=your_github_token
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

For multiple GitHub tokens, configure them according to the project's token-pooling implementation.

### GitHub Token

Create a GitHub Personal Access Token from your GitHub account settings.

For public repository statistics, the application is designed to work without requiring broad repository permissions.

**Never expose your GitHub token publicly or commit it to Git.**

---

## 📝 GitHub Profile README

GitHub Streak Stats is designed specifically for developers who want to showcase their GitHub activity on their profile README.

A typical profile can include several cards together:

```text
┌─────────────────────────────────────┐
│         GitHub Streak Stats         │
├─────────────────────────────────────┤
│                                     │
│       🔥 Contribution Streak        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       📈 Contribution Graph         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       💻 Top Languages              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       🏆 GitHub Trophies            │
│                                     │
└─────────────────────────────────────┘
```

Combine different cards to create a GitHub profile that reflects your development activity and style.

---

## 🎨 Themes

The project provides multiple ready-to-use themes.

Themes allow you to quickly change the appearance of your GitHub README statistics without manually configuring every color.

You can also create a completely custom theme using your own colors.

### Customization Options

Depending on the selected card, customization can include:

* Background
* Text
* Accent
* Border
* Ring
* Progress elements
* Additional visual elements

---

## 🧩 Use Cases

GitHub Streak Stats can be used for:

* 👨‍💻 Developer portfolios
* 📚 Student GitHub profiles
* 🚀 Open-source profiles
* 🏢 Developer team profiles
* 🎓 Coding portfolios
* 💼 Job-seeking developer profiles
* 🌐 Personal developer websites
* 📖 GitHub profile README pages

---

## 🤝 Contributing

Contributions are welcome!

This project is open source and community contributions can help improve its reliability, features, themes, documentation, and overall developer experience.

### You Can Contribute By

* 🐛 Reporting bugs
* 💡 Suggesting features
* 🎨 Creating themes
* 🌍 Improving translations
* 📝 Improving documentation
* ⚡ Improving performance
* 🔐 Improving security
* 🧪 Adding tests
* 🔧 Fixing issues
* 🚀 Submitting pull requests

Before contributing, please read:

**[CONTRIBUTING.md](CONTRIBUTING.md)**

---

## 🐛 Bug Reports

If you encounter a problem, please open an issue and include as much useful information as possible.

Helpful information includes:

* What you were trying to do
* GitHub username
* Card type
* Configuration used
* Error message
* Expected behavior
* Actual behavior
* Screenshot, if applicable

Please avoid posting secrets such as GitHub tokens or private credentials.

**[Report a Bug](https://github.com/Asadullah-shz/Github-streak/issues/new)**

---

## 💡 Feature Requests

Have an idea for a new feature?

Open an issue and describe:

* What you want to add
* Why it would be useful
* How you expect it to work
* Any examples or references

Community feedback helps guide future improvements.

**[Request a Feature](https://github.com/Asadullah-shz/Github-streak/issues/new)**

---

## ❤️ Credits & Inspiration

This project was inspired by the original **GitHub Readme Streak Stats** project created by [DenverCoder1](https://github.com/DenverCoder1) and its contributors.

Huge respect to the original developer and everyone who contributed to the original project.

This repository is an **independent open-source alternative** created to address issues encountered during usage and to experiment with additional features, customization, reliability improvements, and a unified GitHub README statistics experience.

There is no intention to disrespect, diminish, or claim ownership of the original work.

If you are looking for the original project, please visit:

**[DenverCoder1/github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats)**

---

## 📄 License

This project is open source.

See the repository's **[LICENSE](LICENSE)** file for the applicable license and usage terms.

---

## ⭐ Support the Project

If GitHub Streak Stats is useful to you:

⭐ **Star the repository**

🍴 **Fork the project**

🐛 **Report bugs**

💡 **Suggest improvements**

🤝 **Contribute**

Sharing the project with other developers also helps the project grow.

---

## 🔗 Links

* 🌐 **Live Website:** https://github-streak-plum.vercel.app/
* 💻 **GitHub Repository:** https://github.com/Asadullah-shz/Github-streak
* 🐛 **Issues:** https://github.com/Asadullah-shz/Github-streak/issues
* 📖 **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🙌 Built for the GitHub Developer Community

Made with ❤️ for developers who want to showcase their GitHub contributions, streaks, languages, achievements, and profile statistics in a customizable README.

**If you find a bug, have an idea, or want to contribute — you're welcome here.**
