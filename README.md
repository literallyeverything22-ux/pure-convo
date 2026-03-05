<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/20207bd0-30b4-4303-b623-ffcaa66ff881

## 🚀 Getting Started

**Prerequisites:** Node.js installed on your computer.

### 1. Get your Gemini API Key
To run this project, you need your own Gemini API Key from Google AI Studio:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account.
3. Click on **"Get API key"** in the left sidebar and create a new key.
4. Copy your API key. Keep it secret!

### 2. Set up the Environment
Never commit your API key to GitHub. Instead, use an environment variables file:
1. Clone this repository to your computer.
2. In the project folder, make a copy of the `.env.example` file and rename the new copy to `.env` (or `.env.local`).
3. Open the new `.env` file and paste your API key:
   ```env
   GEMINI_API_KEY=your_copied_api_key_here
   ```

### 3. Install & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## 🪄 How to Use Chat Purifier

Watch the tool tutorial below to see how it works!

<video src="pure-chat-tutorial.mp4" controls="controls" width="100%" height="auto">
</video>

This tool helps you extract clean, readable conversations from messy AI chat interfaces (like ChatGPT or Claude) that are full of timestamps, system UI, and copy buttons.

### Method 1: The One-Click Capture (Recommended)
We've built a handy browser bookmarklet to make grabbing your chats effortless:
1. Open the Chat Purifier app.
2. Click **"Install One-Click Capture"** to open the setup modal.
3. Drag the **"Purify Chat"** button into your browser's Bookmarks/Favorites bar.
4. Go to any long chat on ChatGPT or Claude.
5. Click the **"Purify Chat"** bookmark. It will automatically scroll through your chat to load everything and copy the raw text to your clipboard.
6. Return to Chat Purifier, paste the text into the large text box, and click **"Clean Conversation"**.

### Method 2: Manual Copy & Paste
1. Go to your AI chat (ChatGPT, Claude, etc.).
2. Manually highlight and copy the entire page text (or press `Ctrl+A` / `Cmd+A` and copy).
3. Paste all of that messy text directly into the Chat Purifier text area.
4. Click **"Clean Conversation"**.

### Exporting Your Cleaned Chat
Once Gemini processes your text, you will see a clean, distraction-free view of your conversation. You can then:
* **Copy Text:** Quickly copy the cleaned text to your clipboard.
* **Export as Markdown (.md):** Great for Obsidian, Notion, or GitHub.
* **Export as JSON (.json):** Perfect for developers building datasets.
* **Export as Plain Text (.txt):** Simple, unformatted text.
* **Export as Web Page (.html):** Creates a standalone, styled web page of your chat that you can open in any browser.

Attachments detected in your original chat will be neatly listed at the bottom of the export!
