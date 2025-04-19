# Portfolio Deployment Guide

This guide provides instructions for both local development and GitHub Pages deployment.

## Local Development

### Option 1: Client-Only Development (Recommended)

This option runs only the client-side code without the server, which is simpler and more reliable:

1. Run the client-only development script:
   ```
   client-only-dev.bat
   ```

2. Your site will be available at http://localhost:5173

### Option 2: Full-Stack Development (Advanced)

If you need to test the server-side functionality:

1. First build the client:
   ```
   npm run build:client
   ```

2. Then start the server:
   ```
   npm run dev:server
   ```

## GitHub Pages Deployment

### Method 1: Direct Deployment (Recommended)

This method creates and pushes directly to the gh-pages branch:

1. Run the deployment script:
   ```
   deploy-gh-pages.bat
   ```

2. Enter your GitHub credentials when prompted.

3. Your site will be deployed to: https://christopherjoshy.github.io/ProtfolioV2/

### Method 2: Using GitHub Actions

If you prefer automatic deployment through GitHub Actions:

1. Push your changes to the main branch:
   ```
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. The GitHub Actions workflow will automatically build and deploy your site.

3. You can monitor the deployment progress in the Actions tab of your repository.

## Troubleshooting

### GitHub Pages Not Showing

If your GitHub Pages site is not showing up:

1. Check if the gh-pages branch exists:
   ```
   git branch -a
   ```

2. Verify that GitHub Pages is enabled in your repository settings:
   - Go to Settings > Pages
   - Source should be set to "Deploy from a branch"
   - Branch should be set to "gh-pages" and folder to "/ (root)"

3. Check if there are any errors in the deployment process:
   - Look at the output of the deployment script
   - Check the Actions tab in your repository

### Local Development Issues

If you encounter issues with local development:

1. Make sure all dependencies are installed:
   ```
   npm install
   ```

2. Try the client-only development option, which is more reliable.

3. Check for any error messages in the console.

## Environment Variables

For Firebase functionality to work, you need to set up environment variables:

1. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. For GitHub Pages deployment, add these as repository secrets in your GitHub repository settings.