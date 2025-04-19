# Portfolio Website

A dynamic portfolio website with fluid animations, interactive map, and an admin panel using React, Three.js, and Firebase.

## Features

- Modern, responsive design
- Interactive 3D animations with Three.js
- Firebase integration for data storage and authentication
- Fluid animations and transitions
- Support for GitHub Pages deployment

## GitHub Pages Deployment

This portfolio is configured to deploy automatically to GitHub Pages. Here's how it works:

1. The repository is set up with GitHub Actions for automatic deployment
2. When you push to the main/master branch, it will automatically build and deploy to GitHub Pages
3. The site will be available at: https://christopherjoshy.github.io/ProtfolioV2/

### Manual Deployment

You can also deploy manually:

```bash
# Install dependencies
npm install

# Build for GitHub Pages
npm run build:gh-pages

# Deploy to GitHub Pages
npm run deploy
```

### Environment Variables

For the build to work correctly, you need to set up the following secrets in your GitHub repository:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

These can be added in your repository settings under Secrets and Variables > Actions.

