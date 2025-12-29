
# 🌸 BloomFocus | 心花绽放
### *A Privacy-First, Bilingual Focus Coach for the Soul.*

**BloomFocus** is more than just a timer; it's an emotional companion designed to help you cultivate deep focus. Whether you need a gentle "Sweet" encouragement to keep blooming or a "Strong" stoic push to build iron discipline, BloomFocus adapts to your psychological state.

---

## 🚀 GitHub Pages Deployment

This project is optimized for GitHub Pages, including support for subfolder hosting and robust offline caching.

### Step-by-Step Setup:
1. **Repository Creation**: Push this code to a new GitHub repository.
2. **Settings**: Navigate to **Settings** > **Pages** in your repository.
3. **Branch**: Under **Build and deployment**, set the source to "Deploy from a branch".
4. **Folder**: Select the `main` branch and the `/(root)` folder.
5. **Enforce HTTPS**: Ensure "Enforce HTTPS" is checked (this is required for Service Workers).
6. **URL Structure**: Access your app at `https://<username>.github.io/<repo-name>/`. 
   - *Note: Ensure the trailing slash `/` is included in the URL for the Service Worker to register correctly.*

---

## ✨ The Core Philosophy: Sweet or Strong?

Most productivity apps are cold and clinical. BloomFocus believes in **Emotional Reinforcement**. At the end of every interval, you choose your path:

- **🍯 Golden Mode (Sweet):** For when you've succeeded. The UI transforms into soft pink and gold gradients.
- **⚔️ Iron Mode (Strong):** For when you've slipped. The UI shifts to deep indigo and bold orange.

---

## 🎨 Key Features

- **📱 PWA Ready:** Install BloomFocus on your phone or desktop for a native-app experience.
- **🌙 Immersive Duality:** Dynamic theme shifting based on your focus outcomes.
- **📊 The Meadow Dashboard:** Successful sessions become **Flowers**; failed ones become **Sturdy Stones**.
- **🗣️ 100+ Reinforcement Phrases:** A massive library of bilingual (English/Chinese) quotes.
- **🔊 Zen Soundscape:** Synthesized chime alerts and interactive particles.
- **🔒 Privacy First:** 100% local-only. No trackers, no accounts, no cloud.

---

## 🛠️ Technical Stack

- **Framework:** React 19 (ESM)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Persistence:** Browser `localStorage`.
- **Offline:** Custom Service Worker logic designed for GitHub Pages environments.

---

## 📜 Credits & Acknowledgments

The Service Worker architecture and subfolder scope-handling used in this project were inspired by and built upon the excellent template by **Mariko Kosaka (kosamari)**. 

Special thanks for the insights on handling `github.io` domain caching:
- [ServiceWorker for GitHub Pages Gist](https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e)

---

## 🛡️ Privacy & Security

BloomFocus does not have a backend.
- **Your data:** Stored locally in your browser.
- **Permissions:** Requests "Notification" access only to alert you when a timer finishes.

---

*Built with ❤️ for those who strive to bloom.*
