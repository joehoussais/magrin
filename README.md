# Magrin Week (Vite + React + Tailwind)

This is a ready-to-run project for Cursor. It includes:
- React + TypeScript
- TailwindCSS (preconfigured)
- Your cute cartoony map in `public/magrin-map.png`
- The app UI with Map, T-E-R leaderboard, People, Info, Chat

## Run locally (Cursor / VS Code)

1. **Open Folder** in Cursor: select this project folder.
2. Open a terminal and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the URL printed in the terminal (usually http://localhost:5173).

## Deploy (optional)

- **Vercel**: `npm run build` then import the repo in Vercel (or `vercel` if you have the CLI).
- **Netlify**: build command `npm run build`, publish `dist/`.

## Notes

- To change the map: put a new file in `/public` and set it in **Settings** inside the app.
- All data persists to `localStorage`. Use Settings → Copy/Import JSON to share state.
