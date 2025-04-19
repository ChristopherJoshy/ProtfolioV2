@echo off
echo Building for GitHub Pages...
set NODE_ENV=production
call npx vite build --config vite.config.ts

echo Creating .nojekyll file...
type nul > dist\public\.nojekyll

echo Deploying to GitHub Pages...
cd dist\public
git init
git add .
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/ChristopherJoshy/ProtfolioV2.git
git push -f origin gh-pages

echo Deployment complete!
cd ..\..