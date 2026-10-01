# BloxMine — Telegram Roblox Tap Miner

A high-performance tap-to-mine WebApp built with React, TypeScript, and Tailwind CSS. Users tap the 3D Roblox coin to mine coins, upgrade equipment, and claim Robux vouchers (1,000 Coins = 1 R$).

Designed for **Telegram Mini Apps (TMA)**, **GitHub Pages**, and **Shared Web Hosting (cPanel, Hostinger, Netlify, Vercel, Apache)**.

---

## 🚀 How to Publish

### 1. Build the Static Files
Run this command in your project terminal:
```bash
npm run build
```
This will compile the entire app into a self-contained static folder called:
📁 **`dist/`**

Everything inside `dist/` uses relative paths (`./assets/...`), so it works on any domain, subdomain, or subdirectory!

---

### 2. Publishing to GitHub Pages (2 Easy Options)

#### Option A: Quickest Fix (Using the `docs` folder)
1. In your GitHub repository (`ZPLAYBOX/ZPLAYBOXCOIN`), go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Branch**:
   - Select **`main`**
   - In the folder dropdown next to it, choose **`/docs`** (instead of `/ (root)`).
3. Click **Save**.
4. In ~30 seconds, your site will be live at `https://zplaybox.github.io/ZPLAYBOXCOIN/`!

#### Option B: Automatic via GitHub Actions
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, change from "Deploy from a branch" to **GitHub Actions**.
3. GitHub will use the included `.github/workflows/deploy.yml` to automatically build and deploy on every push!

---

### 3. Publishing to Shared Hosting (cPanel / Hostinger / GoDaddy / Namecheap)
1. Run `npm run build` on your computer.
2. Open your hosting File Manager or FTP client (like FileZilla).
3. Navigate to your website's root folder (usually `public_html/` or a subfolder like `public_html/bloxmine/`).
4. Upload all files from inside the **`dist/`** folder directly into `public_html/`.
   - Your folder structure will look like:
     ```
     public_html/
       ├── assets/
       │   ├── index-xxxx.js
       │   └── index-xxxx.css
       ├── index.html
       ├── .htaccess
       └── .nojekyll
     ```
5. Your website is live!

---

### 4. Connecting Your Website to Telegram

To connect this website to your Telegram Bot as a **Telegram Mini App (TMA)**:

1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/mybots` and select your bot (or send `/newbot` to create one).
3. Choose **Bot Settings** > **Menu Button** > **Configure menu button**.
4. Send the URL where your game is published (e.g., `https://yourusername.github.io/bloxmine/` or `https://yourdomain.com`).
5. Set a button title, like **"⛏️ Mine Robux"**.
6. Alternatively, create a WebApp attachment by sending `/newapp` to `@BotFather` and following the prompts.

When players open your bot on Telegram and tap the menu button, the game will launch full-screen inside Telegram!
