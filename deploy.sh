#!/bin/bash
# Deploys to GitHub Pages.

BRANCH=`git rev-parse --symbolic-full-name --abbrev-ref HEAD`
git checkout -b deploy
npm run build
rm .gitignore
git add dist/app
git commit -m "Deployed to GitHub Pages"
git push origin :gh-pages
git subtree push --prefix dist/app origin gh-pages
git checkout $BRANCH
git reset --hard HEAD
git branch -D deploy
