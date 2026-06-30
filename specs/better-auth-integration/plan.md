# Better Auth Integration Plan

## Overview
Add signup/signin functionality using Better Auth with Neon Postgres database, as required by the hackathon (50 bonus points).

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Docusaurus        │────▶│   Better Auth       │────▶│   Neon Postgres     │
│   (Frontend)        │     │   (Node.js Server)  │     │   (Database)        │
│   Port 3000         │     │   Port 3001         │     │                     │
└────────┬────────────┘     └─────────────────────┘     └─────────────────────┘
         │                                                     
         │ JWT Token (Authorization header)                    
         ▼                                                     
┌─────────────────────┐                                        
│   FastAPI Backend   │                                        
│   (Python)          │                                        
│   Port 8000         │                                        
│   Verifies JWT      │                                        
└─────────────────────┘                                        
```

## Components to Build

### 1. Better Auth Server (Node.js)
**Location:** `auth-server/`

Files:
- `auth-server/package.json` - Dependencies (better-auth, express, pg)
- `auth-server/auth.ts` - Better Auth configuration with Neon Postgres
- `auth-server/index.ts` - Express server mounting auth routes
- `auth-server/.env.example` - Environment variables template

**Config:**
- Database: Neon Postgres (via `pg` Pool)
- Auth methods: Email/password (enabled)
- JWT plugin enabled for FastAPI verification
- Trusted origins: Docusaurus frontend URL

### 2. Docusaurus Frontend Pages
**Location:** `book_content/src/pages/`

Files:
- `book_content/src/pages/signup.tsx` - Signup form page
- `book_content/src/pages/signin.tsx` - Signin form page
- `book_content/src/components/Auth/AuthForm.tsx` - Reusable auth form component
- `book_content/src/components/Auth/AuthContext.tsx` - React context for auth state
- `book_content/src/components/Auth/useAuth.ts` - Hook for auth client

**Dependencies to add:**
- `better-auth` (client-side)

### 3. FastAPI JWT Verification
**Location:** `backend/`

Files to modify:
- `backend/main.py` - Add JWT verification middleware
- `backend/requirements.txt` - Add `fastapi-betterauth` and `pyjwt`

**New endpoints:**
- `POST /api/auth/verify` - Verify JWT token from frontend

### 4. Neon Postgres Setup
- Create database tables via Better Auth CLI migration
- Tables: `user`, `session`, `account`, `verification`

## Environment Variables

### Auth Server (.env)
```
BETTER_AUTH_SECRET=<generate>
BETTER_AUTH_URL=http://localhost:3001
DATABASE_URL=<neon-postgres-url>
```

### Frontend (.env)
```
REACT_APP_AUTH_URL=http://localhost:3001
```

### Backend (.env)
```
BETTER_AUTH_URL=http://localhost:3001
```

## Implementation Steps

1. **Create auth-server/** with Better Auth + Express + Neon Postgres
2. **Run migrations** to create auth tables in Neon
3. **Add frontend pages** (signup/signin) with Better Auth React client
4. **Add JWT verification** to FastAPI backend
5. **Test flow**: signup → signin → get JWT → call protected endpoint
6. **Deploy** auth server to Vercel (as separate service) or integrate with existing backend

## User Flow

1. User visits `/signup` page
2. Fills form: name, email, password, software/hardware background questions
3. Submits → Better Auth creates user in Neon Postgres
4. Redirects to `/signin`
5. User signs in → Gets JWT token stored in localStorage
6. Token sent with API requests to FastAPI backend
7. FastAPI verifies JWT and identifies user

## Signup Form Fields (per hackathon requirements)
- Name (text)
- Email (email)
- Password (password)
- Software Background (select: beginner/intermediate/advanced)
- Hardware Background (select: none/basic/advanced)
- GitHub Username (optional text)

## Deployment Strategy

**Option A: Separate Services**
- Auth server deployed as separate Vercel project
- Frontend on GitHub Pages
- Backend on existing Vercel project

**Option B: Integrate Auth into Backend**
- Add auth routes to FastAPI using subprocess calls
- More complex, less clean

**Recommended: Option A** - Cleaner separation, easier to maintain.

## Files to Create

```
auth-server/
├── package.json
├── tsconfig.json
├── auth.ts
├── index.ts
├── .env.example
└── .gitignore

book_content/src/
├── pages/
│   ├── signup.tsx
│   └── signin.tsx
├── components/Auth/
│   ├── AuthForm.tsx
│   ├── AuthContext.tsx
│   └── useAuth.ts
└── lib/
    └── auth-client.ts
```

## Files to Modify

```
backend/main.py  (add JWT verification)
```

## Testing Checklist

- [ ] Auth server starts and connects to Neon Postgres
- [ ] Signup creates user in database
- [ ] Signin returns JWT token
- [ ] Frontend stores token and sends in requests
- [ ] FastAPI verifies JWT and returns user info
- [ ] Protected endpoints require valid JWT
- [ ] Logout clears token
