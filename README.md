# MadForum - Campus Forum

A lightweight campus forum for rehoming second-hand furniture and posting small paid "bounty" tasks.

## Project Overview

MadForum is a proof-of-concept React application that demonstrates the core features of a campus forum system. This initial publish showcases:

- **Post Feed**: Browse posts with filtering and search
- **Post Types**: Filter by Sale, Free, or Bounty
- **Status Tracking**: View post status (Open, Claimed, Completed, Closed)
- **Tags & Location**: Posts include tags and location information

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **GitHub Pages** for deployment

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages at `https://cs571-f25.github.io/p18/`

### First Time Setup

1. Make sure you have `gh-pages` installed:
```bash
npm install
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

This will:
- Build the project
- Deploy to the `gh-pages` branch
- Make your site available at `https://cs571-f25.github.io/p18/`

### Updating Your Site

After making changes, simply run:
```bash
npm run deploy
```

### GitHub Repository Settings

Make sure your GitHub repository has GitHub Pages enabled:
1. Go to Settings > Pages
2. Source should be set to "Deploy from a branch"
3. Branch should be `gh-pages` with `/ (root)` folder

## Project Structure

```
p18/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # App-specific styles
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration (base path for GitHub Pages)
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Group Members

- Tianyi Chen (GitHub: Ricardo-ChenTY)
- Jingwen Qian (GitHub: Kelsey-Qian)

## Next Steps

This is a proof-of-concept. Future enhancements will include:
- Backend integration (Supabase or Express + SQLite)
- User authentication
- Post creation and editing
- Comment threads
- Image uploads
- Real-time updates

