# Deployment Guide for GitHub Pages

## Quick Start (Following Official Instructions)

### Step 1: Build the Project
```bash
npm run build
```
This creates the `docs` folder with your production build.

### Step 2: Commit and Push to GitHub
```bash
git add -A
git commit -m "Build for deployment"
git push origin main
```

### Step 3: Configure GitHub Pages
1. Go to your repository: `https://github.com/CS571-F25/p18`
2. Navigate to: **Settings > Pages**
3. Under "Source", select: **"Deploy from a branch"**
4. Branch: **`main`**
5. Folder: **`/docs`**
6. Click **"Save"**

### Step 4: Wait and Verify
- GitHub Pages will take 1-2 minutes to build and deploy
- Your site will be available at: `https://cs571-f25.github.io/p18/`

## Important Notes

- **Always run `npm run build` before pushing** to ensure your latest changes are in the `docs` folder
- The `docs` folder is committed to the repository (not ignored)
- Changes are deployed from the `main` branch, not a separate `gh-pages` branch

## Submission URL

Once deployed, your submission URL will be:
```
https://cs571-f25.github.io/p18/
```

## Troubleshooting

- **404 Error**: Make sure the base path in `vite.config.ts` is set to `/p18/`
- **Blank Page**: Check browser console for errors. Ensure all assets are loading correctly.
- **Build Fails**: Run `npm install` again and check for TypeScript errors
- **Changes not showing**: Make sure you ran `npm run build` and committed the `docs` folder
