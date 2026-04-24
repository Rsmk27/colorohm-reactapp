# Contributing to ColorOhm 🎨

Thanks for taking the time to contribute! ColorOhm is an open-source resistor color code calculator built with React Native + Expo. Whether you're fixing a bug, improving the UI, or adding a new feature — all contributions are welcome.

---

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Types of Contributions](#types-of-contributions)
- [Workflow](#workflow)
- [Code Style](#code-style)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/colorohm.git
   cd colorohm
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the app:**
   ```bash
   npx expo start
   ```

Make sure you have [Node.js](https://nodejs.org/) and the [Expo CLI](https://docs.expo.dev/get-started/installation/) set up before you begin.

---

## How to Contribute

> **We use an Issues-first workflow.** Please open or comment on an issue before submitting a pull request. This helps avoid duplicate work and ensures your effort is aligned with the project's direction.

1. **Open an issue** describing what you want to fix or build
2. Wait for a maintainer to acknowledge/assign the issue
3. Fork the repo and work on your changes in a dedicated branch
4. Submit a **Pull Request** referencing the issue

---

## Types of Contributions

### 🐛 Bug Reports & Fixes
Found something broken? Open an issue with:
- A clear description of the bug
- Steps to reproduce it
- Expected vs. actual behavior
- Device/OS/Expo SDK version if relevant

### ✨ New Features & Enhancements
Have an idea? Open a feature request issue first. Describe the use case, not just the solution. Small, focused PRs are preferred over large sweeping changes.

### 🎨 UI/UX Improvements
Design tweaks, accessibility improvements, responsiveness fixes — all welcome. Include before/after screenshots in your PR if possible.

### 📝 Documentation
Spotted a typo? Want to improve setup instructions or add usage examples? Documentation PRs are always appreciated and don't need a long review cycle.

---

## Workflow

```
Open Issue → Get acknowledged → Fork → Branch → Code → PR → Review → Merge
```

- Branch naming: `fix/issue-title`, `feat/issue-title`, `docs/issue-title`
- Keep PRs focused — one issue per PR
- Link your PR to the related issue using `Closes #issue-number` in the PR description

---

## Code Style

- Follow the existing code structure (React Native + Expo conventions)
- Use functional components and hooks
- Keep components small and single-purpose
- No unused imports or `console.log` statements in final PRs

---

## Commit Message Guidelines

Use clear, lowercase commit messages:

```
fix: band color not rendering on dark mode
feat: add 6-band resistor support
docs: update README with APK download link
style: adjust padding on result card
```

---

## Questions?

Open a [GitHub Discussion](../../discussions) or reach out via [rsmk.me](https://rsmk.me). Happy contributing! ⚡
