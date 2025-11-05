# Initial Publish Checklist

## ✅ Requirements Check

### 1. Create React App
- ✅ React + Vite project created
- ✅ npm install completed
- ⚠️ Note: Using TypeScript (not JavaScript) - this is fine and more robust

### 2. Remove StrictMode
- ✅ StrictMode removed from main.tsx
- ✅ App component renders directly without StrictMode wrapper

### 3. Install React-Bootstrap
- ✅ react-bootstrap installed
- ✅ bootstrap installed
- ✅ Bootstrap CSS link in index.html (with correct integrity hash)
- ✅ Bootstrap CSS import in main.tsx

### 4. Install React Router
- ✅ react-router installed
- ⚠️ HashRouter not yet implemented (fine for initial proof-of-concept)

### 5. Configure Vite Build
- ✅ vite.config.ts has base: '/p18/'
- ✅ vite.config.ts has build.outDir: 'docs'
- ✅ npm run build works successfully
- ✅ docs folder created with built files

### 6. Push to GitHub
- ✅ Code pushed to main branch
- ✅ docs folder committed and pushed
- ✅ Repository: https://github.com/CS571-F25/p18

### 7. Configure GitHub Pages
- ⏳ **ACTION REQUIRED**: Go to Settings > Pages
  - Source: "Deploy from a branch"
  - Branch: `main`
  - Folder: `/docs`
  - Click "Save"

## Final Step

After configuring GitHub Pages, your site will be at:
**https://cs571-f25.github.io/p18/**

## Note

React Router (HashRouter) is installed but not yet used in the app. This is fine for the initial publish (proof-of-concept). You can add routing later for future check-ins.

