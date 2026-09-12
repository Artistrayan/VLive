# V.Live Architecture & Documentation

## Overview
V.Live is a real-time live streaming, social interaction, and gaming platform built with modern web technologies.

## Production Architecture

```
                  ┌─────────────────────────────────────────┐
                  │            React Frontend               │
                  │       (Vite Client / PWA / Web)        │
                  └────┬───────────────────────────────┬────┘
                       │                               │
    1. Direct Realtime DB, Auth,                       │ 2. HTTP Requests
       Storage & Financial RPCs                        │    (/api/livekit/token,
                       │                               │     /api/translate,
                       ▼                               │     /api/ai-security/*)
         ┌───────────────────────────┐                 ▼
         │      Supabase Cloud       │      ┌───────────────────────────┐
         │  (PostgreSQL + RLS +      │      │      Node.js Server       │
         │   Auth + Realtime +       │      │        (server.js)        │
         │   Storage Engine)         │      │      Render Port 10000    │
         └───────────────────────────┘      └─────────────┬─────────────┘
                                                          │
                                                          │ 3. Sign LiveKit JWTs
                                                          ▼
                                            ┌───────────────────────────┐
                                            │   LiveKit Media Server    │
                                            │ (wss://livekit.vlive.app) │
                                            └───────────────────────────┘
```

### Key Components:
1. **Frontend**: React (Vite, Jetpack Compose / Android WebView Wrapper).
2. **Database & Realtime Engine**: Supabase Cloud (PostgreSQL with RLS, Supabase Auth, Realtime Engine, Storage Buckets, and Financial RPC Functions).
3. **Node.js Backend (`server.js`)**: Production server hosted on Render (Port 10000) for issuing signed LiveKit JWTs, secure Gemini AI moderation proxies, and translation services.
4. **Media Engine**: LiveKit Media Server for real-time video streaming.

## Environment Variables
See `.env.example` for required environment variables.
- `VITE_SUPABASE_URL`: Supabase project endpoint
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `LIVEKIT_URL`: LiveKit Media Server URL
- `LIVEKIT_API_KEY`: LiveKit API Key
- `LIVEKIT_API_SECRET`: LiveKit API Secret
- `GEMINI_API_KEY`: Google Gemini API Key for AI Moderation
