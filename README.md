# MadForum

A campus forum for UW-Madison students to buy/sell furniture and post small tasks. Need help moving? Looking for a cheap desk? Want to give away some stuff? This is the place.

## What it does

MadForum lets students post four types of things:
- **Bounties**: Paid tasks like "Help me move boxes" ($30 reward)
- **Sales**: Secondhand items with prices
- **Free**: Stuff you're giving away
- **Activities**: Finding people to do things with

You can browse posts, filter by type or tags, search for specific items, and see everything on a map if the post has coordinates. When you find something interesting, you can comment, claim it (if it's a bounty), or save it to your watchlist.

## Features

**Posting**: Create posts with title, description, location, optional GPS coordinates, tags, and price/reward. Edit or delete your own posts anytime.

**Browsing**: The main feed shows all posts in a card grid. Filter by type (bounties, secondhand, activities), search by text, or click tags to filter. Sort by newest, distance from you, or relevance.

**Map view**: Posts with latitude/longitude show up as pins on a map. Click a pin to see details, or use "Take me there" to get Google Maps directions.

**Comments**: Ask questions or express interest through comments. You can edit or delete your own comments.

**Status tracking**: Posts go through a simple lifecycle - open → claimed → completed → closed. Owners control the status.

**Watchlist**: Star posts you're interested in. They'll be highlighted so you can find them easily later.

**My Bounties**: See all your posts in one place, filter by status, and manage them easily.

**User accounts**: Register to attach your name to posts, or post anonymously. Login with email or username.

## Tech stuff

Built with React 18, Vite for bundling, and React Router for navigation. Styling is a mix of React Bootstrap and Tailwind CSS - Bootstrap for components like the navbar and forms, Tailwind for custom layouts and spacing.

For the map, we're using Leaflet with OpenStreetMap tiles. It's free, open-source, and works great.

Data is stored in localStorage, so everything persists in your browser. No backend needed for this prototype - it's all client-side.

## Getting started

Visit the live site: **https://cs571-f25.github.io/p18/**

If you want to run it locally:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Project structure

```
src/
├── components/     # Reusable UI bits
│   ├── CommentList.jsx
│   ├── FilterBar.jsx
│   ├── ImageCarousel.jsx
│   ├── Layout.jsx
│   ├── NavigationBar.jsx
│   ├── PostCard.jsx
│   ├── StatusBadge.jsx
│   ├── StatusButtons.jsx
│   └── TypeBadge.jsx
├── screens/        # Full pages
│   ├── BountyDetail.jsx    # View a single post
│   ├── BountyFeed.jsx      # Main feed
│   ├── EditBounty.jsx      # Edit post form
│   ├── Login.jsx
│   ├── MapView.jsx         # Map with markers
│   ├── MyBounties.jsx      # Your posts
│   ├── NewBounty.jsx       # Create post form
│   └── Register.jsx
├── App.jsx         # Routes and providers
├── main.jsx        # Entry point
└── store.jsx       # Context for auth, posts, toasts
```

## Routes

- `/` - Main feed
- `/bounties/new` - Create a post
- `/bounties/:id` - View post details
- `/bounties/:id/edit` - Edit a post
- `/bounties/mine` - Your posts
- `/register` - Sign up
- `/login` - Sign in
- `/map` - Map view

## Design notes

The UI uses color-coded badges to make scanning easier - blue for sales, green for free items, purple for bounties, teal for activities. Status badges use similar color coding.

Everything is responsive and works on mobile. We tried to keep the design clean and simple - no unnecessary clutter.

Accessibility was important too. All forms have proper labels, colors meet WCAG AA contrast standards, and keyboard navigation works throughout.

## Data storage

Everything lives in localStorage:
- `madforum_posts` - All posts
- `madforum_user` - Current logged-in user
- `madforum_users` - User registry

This means data persists between sessions, but it's browser-specific. Clear your browser data and you'll lose everything. For a real app, you'd want a proper backend, but for a prototype this works fine.

## Deployment

Live at: **https://cs571-f25.github.io/p18/**

Built with Vite, output goes to `docs/` for GitHub Pages. Uses HashRouter to avoid routing issues on static hosting.

## Authors

- Tianyi Chen ([@Ricardo-ChenTY](https://github.com/Ricardo-ChenTY))
- Jingwen Qian ([@Kelsey-Qian](https://github.com/Kelsey-Qian))

Built for CS 571 at UW-Madison.
