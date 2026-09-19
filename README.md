# ⚡ LeetMetric

> A high-octane, Gen-Z styled LeetCode statistics & aura tracker with dark cyber-glass aesthetics, live profile avatars, contest analytics, animated SVG progress rings, dynamic difficulty breakdown, and one-click stats sharing.

![LeetMetric Preview Banner](https://img.shields.io/badge/LeetMetric-Gen--Z%20Aesthetic-8A2BE2?style=for-the-badge&logo=leetcode)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/Vanilla-JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/Modern-CSS3-1572B6?style=for-the-badge&logo=css3)

---

## ✨ Features

- 🖼️ **Real LeetCode Profile Avatar**: Fetches and renders the coder's actual LeetCode profile picture with a glowing cyber border ring, with graceful gradient fallback to initial on default or missing avatars.
- 🏆 **Live Contest Analytics**: Displays competitive programming contest rating, worldwide ranking, top percentile rank (e.g. *Top 0.01%*), attended contests count, and official contest tier badges (**🛡️ Guardian**, **⚔️ Knight**).
- 📍 **Personal Details & Socials**: Displays real name, country tag, company/university affiliation, and direct links to GitHub, Twitter/X, LinkedIn, and personal portfolio websites.
- 🔮 **Gen-Z Cyber-Glass Aesthetic**: OLED dark mode with ambient glow orbs, specular gradients, frosted glass panels (`backdrop-filter: blur(20px)`), and subtle micro-animations.
- ⚡ **Dynamic Aura Rank & Score**: Automatically calculates custom aura titles (*👑 LeetCode Guardian God*, *🔥 Algorithm Demon*, *⚔️ Grandmaster*, *⚡ Daily Grinder*, *🌱 Rising Coder*) and numerical aura points based on solved problem tiers and contest performance.
- 📊 **Animated SVG Progress Rings**: Real-time animated stroke-dashoffset rings with glowing drop-shadows for **Easy**, **Medium**, and **Hard** difficulties.
- 🔢 **Animated Count-Up Numbers**: Satisfying numeric counter transitions for solved problems, contest rating, and rankings.
- 🚀 **One-Click Share & Copy**: Formats and copies a Discord/Twitter/LinkedIn-ready stats card summary to your clipboard with one tap.
- 🕒 **Recent Searches & Hot Picks**: Saves recent lookups locally in `localStorage` and provides one-tap hot picks for top competitive coders (`tourist`, `neal_wu`, `lee215`, `Yash8092`).
- 🛡️ **Bulletproof Error Handling**: Gracefully handles non-existent users, API timeouts, invalid handles, and network downtime with sleek in-app states and toast notifications instead of jarring browser `alert()` popups.
- 📱 **100% Mobile Responsive**: Looks stunning on phones, tablets, laptops, and ultra-wide displays.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic, accessible markup
- **CSS3**: Vanilla modern CSS with CSS variables, Glassmorphism, CSS Grid & Flexbox, SVG filter glows
- **JavaScript**: Pure ES6+ (`Promise.allSettled`, Fetch API with AbortController, SVG DOM manipulation, Clipboard API, LocalStorage)
- **APIs**: 
  - [Tashif LeetCode Stats API](https://github.com/JeremyTsaii/leetcode-stats-api) for problem stats
  - [Alfa LeetCode API](https://github.com/alfaarghya/alfa-leetcode-api) for live avatars, contest ratings, badges & profile metadata

---

## 🚀 Getting Started

No build tools, Node modules, or bundlers required! Simply open `index.html` in any modern web browser or serve it locally:

```bash
# Using Python
python -m http.server 3000

# Or using npx serve
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author

- GitHub: [@Yash8092-code](https://github.com/Yash8092-code)
- Repo: [leet-stats](https://github.com/Yash8092-code/leet-stats)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
