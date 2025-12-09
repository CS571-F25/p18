# MadForum - Campus Forum

## Project Description

MadForum is a lightweight campus forum focused on two use cases:
(1) rehoming second-hand furniture and (2) posting small paid "bounty" tasks such as moving, assembly, or pickup. The app intentionally avoids online payments—people coordinate offline—so the backend remains simple and safe. The core interactive flows are: discovering items and tasks with rich filters, creating a post with photos and tags, and coordinating through threaded comments.

The feed supports quick filters (type: sale/free/bounty), price or reward range, tags, status (open/claimed/completed/closed), and text search. Each post page shows an image gallery, description, location text, badges (e.g., "Bounty", "Free"), and a comment thread where interested users can ask questions or express intent. Authors can edit, close, or soft-delete their own posts; admins can moderate comments. The status lifecycle is intentionally small– open -> claimed -> completed -> closed—and expired posts can auto-close.

To keep the project feasible, we will build the backend with Supabase (Postgres + Auth + Storage) or a minimal Express + SQLite service. The schema includes four tables (users, posts, post_images, comments). The UI is built with React + TypeScript + Tailwind and emphasizes responsive design, inline validation, drag-and-drop photo upload, and live preview when posting. Stretch goals include watchlists, simple DMs, and map-style location picking. MadForum demonstrates meaningful interactivity, clear data modeling, and practical value for students while staying well within the course timeline.

## Group Members

- **Tianyi Chen** (GitHub: [Ricardo-ChenTY](https://github.com/Ricardo-ChenTY))
- **Jingwen Qian** (GitHub: [Kelsey-Qian](https://github.com/Kelsey-Qian))

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS and Bootstrap for styling
- GitHub Pages for deployment

## Development

```bash
# Install dependencies
npm install

npm install leaflet react-leaflet@4.2.1

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The project is deployed at: [https://cs571-f25.github.io/p18/](https://cs571-f25.github.io/p18/)
