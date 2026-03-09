# Script Factory — Deployment Guide

## What you need before starting
- A GitHub account (free) → github.com
- A Vercel account (free) → vercel.com
- Your Anthropic API key → console.anthropic.com

## Step 1 — Upload to GitHub
1. Go to github.com → click the "+" icon → "New repository"
2. Name it "script-factory" → click "Create repository"
3. Click "uploading an existing file"
4. Drag and drop ALL the files from this folder
5. Click "Commit changes"

## Step 2 — Connect to Vercel
1. Go to vercel.com → Sign up with your GitHub account
2. Click "Add New Project"
3. Find "script-factory" → click "Import"
4. Click "Deploy" — don't change any settings

## Step 3 — Add your API key
1. In Vercel, go to your project → "Settings" → "Environment Variables"
2. Name: VITE_ANTHROPIC_API_KEY
3. Value: (paste your Anthropic API key here)
4. Click "Save"
5. Go to "Deployments" → click the three dots → "Redeploy"

## Step 4 — You're live!
Vercel gives you a URL like: https://script-factory-xyz.vercel.app
That's your Script Factory living on the internet permanently.

## Getting your Anthropic API key
1. Go to console.anthropic.com
2. Sign up / log in
3. Click "API Keys" → "Create Key"
4. Copy it — you only see it once so save it somewhere safe
5. Add $5 credit — that covers hundreds of scripts
