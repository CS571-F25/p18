# Web Project Publish - Submission Checklist

## Criteria (2 points total)

### ✅ Criterion 1: Some Code is Pushed (1 pt)
**Status:** ⬜ Not Done
- [ ] Code is pushed to GitHub repository
- [ ] Repository is accessible at: `https://github.com/cs571-f25/p18`

### ✅ Criterion 2: Website is Accessible via URL (1 pt)
**Status:** ⬜ Not Done
- [ ] Website is deployed to GitHub Pages
- [ ] Website is accessible at: `https://cs571-f25.github.io/p18/`

---

## Step-by-Step Instructions

### Step 1: Push Code to GitHub

1. **Initialize git and commit all files:**
   ```bash
   git add .
   git commit -m "Initial commit - MadForum proof of concept"
   ```

2. **Add remote repository (if not already added):**
   ```bash
   git remote add origin https://github.com/cs571-f25/p18.git
   ```
   *(If the remote already exists, you'll get an error - that's fine, skip this step)*

3. **Push to GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

   **Note:** Make sure you have:
   - Created the repository `p18` under the `cs571-f25` organization on GitHub
   - Access/permissions to push to it

### Step 2: Deploy to GitHub Pages

1. **Deploy the site:**
   ```bash
   npm run deploy
   ```

   This will:
   - Build the production version
   - Create/update the `gh-pages` branch
   - Push it to GitHub

2. **Enable GitHub Pages in repository settings:**
   - Go to: `https://github.com/cs571-f25/p18/settings/pages`
   - Under "Source", select: **"Deploy from a branch"**
   - Branch: **`gh-pages`**
   - Folder: **`/ (root)`**
   - Click **"Save"**

3. **Wait 1-2 minutes** for GitHub Pages to build and deploy

4. **Verify the site is accessible:**
   - Visit: `https://cs571-f25.github.io/p18/`
   - You should see the MadForum homepage with posts

### Step 3: Submit on Canvas

Submit the following URL:
```
https://cs571-f25.github.io/p18/
```

---

## Verification Checklist

Before submitting, verify:

- [ ] Code is visible in GitHub repository
- [ ] `gh-pages` branch exists with the built files
- [ ] GitHub Pages is enabled in repository settings
- [ ] Website loads at `https://cs571-f25.github.io/p18/`
- [ ] Website shows the MadForum interface with posts
- [ ] Filters and search work correctly

---

## Troubleshooting

**If you can't push to GitHub:**
- Make sure you're authenticated (`git config --global user.name` and `git config --global user.email`)
- Verify you have access to the `cs571-f25/p18` repository
- Check if the repository exists on GitHub

**If the website doesn't load:**
- Wait 2-3 minutes after deployment (GitHub Pages takes time)
- Check repository Settings > Pages to confirm it's enabled
- Verify the `gh-pages` branch exists
- Check that the base path in `vite.config.ts` is `/p18/`

**If you see a 404 error:**
- Make sure `vite.config.ts` has `base: '/p18/'`
- Rebuild and redeploy: `npm run deploy`

