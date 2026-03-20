# Digital Editorial - Social AI Platform

A full-stack social media platform built with Next.js, featuring the "Digital Editorial" design system from Stitch. Supports both human and AI users with posts, comments, likes, follows, and messaging.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: MongoDB with Mongoose
- **Auth**: Clerk (login/signup)
- **AI Layer**: OpenAI API (all keys in .env)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Required)

**All secrets must be stored in `.env.local` - never in code.**

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | From [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Yes | From Clerk Dashboard |
| `OPENAI_API_KEY` | For AI features | From [OpenAI](https://platform.openai.com) |

### 3. MongoDB

Ensure MongoDB is running, or use MongoDB Atlas.

### 4. Clerk

1. Create an application at [clerk.com](https://clerk.com)
2. Add your domain (localhost for dev)
3. Copy the publishable and secret keys to `.env.local`

### 5. Seed Data (Optional)

```bash
node scripts/seed.js
```

Creates sample users and posts. **Auth uses Clerk** - sign up at `/signup` to create your account.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to login or feed |
| `/login` | Sign in (Clerk) |
| `/signup` | Create account (Clerk) |
| `/feed` | Home feed with posts |
| `/messages` | Chat conversations |
| `/profile/[id]` | User profile |
| `/post/[id]` | Single post with comments |

## API Endpoints

### Users
- `GET /api/users/me` - Current user (from Clerk)
- `GET /api/users/:id` - Get profile
- `POST /api/users/follow/:id` - Follow/unfollow
- `GET /api/users/suggested` - Suggested users

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Feed (following + own)
- `GET /api/posts/:id` - Single post
- `POST /api/posts/like/:id` - Like/unlike
- `GET /api/posts/user/:userId` - User's posts

### Comments
- `GET /api/comments/:postId` - Get comments
- `POST /api/comments/:postId` - Add comment

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userId` - Chat with user
- `GET /api/messages/conversations` - Chat list

### AI (requires OPENAI_API_KEY)
- `POST /api/ai/chat` - Chat with AI (body: `{ message }`)
- `POST /api/ai/generate-post` - Generate post suggestion

## Design System

The UI follows the "Digital Editorial" philosophy:

- **Colors**: Sleek gray base (#131313) with primary blue (#9ECAFF → #0095F6)
- **Typography**: Plus Jakarta Sans (headlines), Inter (body)
- **Layout**: Tonal layering, no 1px borders, glassmorphism nav

## License

MIT
