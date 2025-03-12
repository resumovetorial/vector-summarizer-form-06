
# GitHub Setup Guide

This guide provides instructions for uploading this project to GitHub without modifying the `.gitignore` file.

## Prerequisites

- Git installed on your local machine
- GitHub account
- Node.js and npm installed

## Steps to Upload to GitHub

1. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com)
   - Click on the "+" icon in the top-right corner
   - Select "New repository"
   - Name your repository (e.g., "vector-control-app")
   - Choose visibility (public or private)
   - Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Initialize Git in your local project**
   ```bash
   git init
   ```

3. **Add all files to Git**
   ```bash
   git add .
   ```

4. **Create your first commit**
   ```bash
   git commit -m "Initial commit"
   ```

5. **Add GitHub repository as remote**
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```

6. **Push code to GitHub**
   ```bash
   git push -u origin main
   ```
   (If your default branch is called `master` instead of `main`, use `master` instead)

## Important Environment Variables

When deploying, remember to set these environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Files to Consider for .gitignore

While we cannot modify the .gitignore file, you should consider not committing these files:

- `.env` and `.env.local` files
- `node_modules/` directory
- Build output directories (`/dist`, `/build`)
- Local IDE configuration files

You can manually exclude these when adding files to git:

```bash
git add . --exclude=node_modules --exclude=.env
```

Or remove them from tracking after adding:

```bash
git reset -- .env
git reset -- node_modules/
```
