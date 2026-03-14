# Spotify Integration Setup Guide

This guide will help you set up Spotify's Web Playback SDK integration for your Fittr app.

## Prerequisites

- A Spotify account (Free or Premium - Premium required for full playback)
- Spotify Developer account

## Setup Steps

### 1. Register Your App with Spotify

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in the details:
   - **App name**: Fittr (or any name you prefer)
   - **App description**: Workout timer with music integration
   - **Redirect URI**: `http://localhost:8080/fittr` (or your production URL)
   - **API/SDKs**: Check "Web Playback SDK"
5. Accept the terms and click **"Save"**
6. Click on your new app to view its details
7. Copy your **Client ID**

### 2. Configure Your Application

1. In your project root, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Spotify Client ID:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### 3. Add Additional Redirect URIs (Optional)

If you deploy to production, add your production URL to Spotify:

1. Go back to your app in Spotify Developer Dashboard
2. Click **"Edit Settings"**
3. Add your production URL to **Redirect URIs**:
   - Example: `https://yourdomain.com/fittr`
4. Click **"Save"**

## How to Use

1. Click the Spotify or YouTube button in the left menu
2. Switch to the Spotify tab
3. Click **"Connect with Spotify"** - you'll be redirected to Spotify to authorize
4. Once connected, paste any Spotify link (playlist, album, or track)
5. Press Enter or click to play
6. Use the playback controls (previous, play/pause, next)

## Features

- ✅ Spotify Web Playback SDK integration
- ✅ OAuth authentication
- ✅ Play playlists, albums, and tracks
- ✅ Playback controls (play, pause, skip)
- ✅ Current track display
- ✅ Tab switching between Spotify and YouTube without unmounting

## Troubleshooting

### "Spotify Client ID not configured" error
- Make sure you created the `.env` file
- Verify your Client ID is correct
- Restart the dev server after adding the `.env` file

### "Failed to play track" error
- Ensure you have an active Spotify session (open Spotify app)
- Check that you have Spotify Premium (required for Web Playback SDK)
- Verify the Spotify URL/URI is valid

### Authentication keeps redirecting
- Check your Redirect URI matches exactly in Spotify Developer Dashboard
- Clear browser cache and try again

## Important Notes

- **Spotify Premium is required** for the Web Playback SDK to work
- Free users can authenticate but won't be able to play tracks
- The player requires an internet connection
- Songs play through the Spotify Web Player, not embedded iframes

## Security

- Never commit your `.env` file to git (it's already in `.gitignore`)
- Keep your Client ID private
- For production, consider using a backend to handle tokens securely
