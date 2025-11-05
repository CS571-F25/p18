# Deployment Guide for GitHub Pages

## Quick Start

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MadForum proof of concept"
   git branch -M main
   git remote add origin https://github.com/cs571-f25/p18.git
   git push -u origin main
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages in Repository Settings**
   - Go to your GitHub repository: `https://github.com/cs571-f25/p18`
   - Navigate to: Settings > Pages
   - Under "Source", select: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - Click "Save"

4. **Wait for deployment**
   - GitHub Pages will take a few minutes to build and deploy
   - Your site will be available at: `https://cs571-f25.github.io/p18/`

## Verify Deployment

After deployment, visit: `https://cs571-f25.github.io/p18/`

You should see:
- MadForum header
- Filter buttons (All, For Sale, Free, Bounty)
- Search bar
- Sample posts showing different types and statuses

## Updating Your Site

Whenever you make changes:
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Redeploy:
   ```bash
   npm run deploy
   ```

## Troubleshooting

- **404 Error**: Make sure the base path in `vite.config.ts` is set to `/p18/`
- **Blank Page**: Check browser console for errors. Ensure all assets are loading correctly.
- **Build Fails**: Run `npm install` again and check for TypeScript errors with `npm run build`

## Submission URL

Once deployed, your submission URL will be:
```
https://cs571-f25.github.io/p18/
```

