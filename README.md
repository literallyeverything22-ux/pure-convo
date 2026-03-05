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
