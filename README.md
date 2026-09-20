# TaskFlow AI

**Plan smarter. Work better. Achieve more.**

TaskFlow AI is a full-stack project and task management SaaS application built for the Innovation Hacks Full Stack Development Internship. It connects a React/Vite frontend to an Express REST API and MongoDB, with JWT authentication, CRUD operations, analytics, activity tracking and an AI assistant with a safe deterministic fallback.

## Features

- Landing, registration and login flows
- JWT authentication with httpOnly cookie + bearer-token compatibility
- MongoDB/Mongoose persistence
- Project and task CRUD
- Task status updates and Kanban board
- Search, filtering and sorting
- Dashboard statistics calculated from real database records
- Activity history
- AI task generation, descriptions, summaries, prioritization and productivity suggestions
- AI fallback when no external provider is configured
- Responsive sky-blue + soft-pink SaaS UI
- Recharts analytics
- Loading, empty, success and error states
- Helmet, CORS, rate limiting and express-validator
- Optional seed data
- Production frontend build

## Technology Stack

Frontend: React, Vite, React Router, Axios, Lucide React, Recharts, CSS3.

Backend: Node.js, Express, JWT, bcryptjs, express-validator, Helmet, CORS, express-rate-limit.

Database: MongoDB + Mongoose.

AI: Provider-agnostic HTTP integration plus deterministic fallback.

## Architecture

```text
React/Vite
   |
   | Axios / REST + JWT cookie
   v
Express API
   |
   +-- Auth middleware
   +-- Validation
   +-- Controllers
   +-- Services
   |
   v
MongoDB / Mongoose
```

## Folder Structure

```text
taskflow-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── seed/
│   ├── server.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

Prerequisite: Node.js 18+ and MongoDB (local or MongoDB Atlas).

```bash
git clone <YOUR_GITHUB_URL>
cd taskflow-ai
npm install
npm run install-all
```

## Environment Variables

Copy the root example to `server/.env`:

```bash
cp .env.example server/.env
```

On Windows, create `server/.env` manually from `.env.example`.

Set at least:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow-ai
JWT_SECRET=use-a-long-random-secret
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
```

Optional AI variables can be left blank.

## MongoDB Setup

### Local MongoDB

Start MongoDB and use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow-ai
```

### MongoDB Atlas

Create a cluster, database user and network access rule, then put the Atlas connection string in `MONGODB_URI`.

Never commit `.env`.

## Run the Application

Terminal 1:

```bash
cd server
npm install
npm run dev
```

Terminal 2:

```bash
cd client
npm install
npm run dev
```

Or from the root:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## Seed Demo Data

```bash
cd server
npm run seed
```

The seed script creates a demo user:

- Email: `demo@taskflow.ai`
- Password: `Demo@12345`

Use seed data only for demonstrations.

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

### AI

- `POST /api/ai/generate-tasks`
- `POST /api/ai/generate-description`
- `POST /api/ai/suggestions`
- `POST /api/ai/prioritize`

### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/activity`

## Validation and Security

- Passwords hashed with bcryptjs
- JWT stored in an httpOnly cookie
- Bearer token supported for development/API clients
- Helmet security headers
- CORS restricted to configured client URL
- Rate limiting
- express-validator request validation
- Passwords never returned
- Environment variables for secrets
- Centralized error handling
- Proper 2xx/4xx/5xx response codes

## Testing the Demo

1. Register a user.
2. Log in.
3. Create a project.
4. Open the project and create tasks.
5. Change task statuses.
6. Check dashboard statistics.
7. Use the AI Assistant.
8. Accept an AI-generated task.
9. Refresh the browser and verify MongoDB persistence.
10. Test search/filter/sort and Kanban.
11. Edit profile/settings.
12. Log out.
13. Try a bad URL to see the custom 404 page.

## Production Build

```bash
cd client
npm run build
```

Serve the generated `client/dist` from a static host and deploy the Express server separately or behind a reverse proxy.

Set production environment variables, including:

```env
CLIENT_URL=https://your-frontend-domain.example
COOKIE_SECURE=true
```

Use HTTPS in production.

## Deployment

Frontend options: Vercel, Netlify or another static hosting service.

Backend options: Render, Railway, Fly.io or another Node-compatible host.

Database: MongoDB Atlas.

After deployment, update `CLIENT_URL` on the backend and make sure the frontend's API base URL points to the deployed backend.

## Screenshots

Add screenshots of:
- Landing page
- Dashboard
- Projects
- Project details
- Kanban
- AI Assistant
- Analytics
- Mobile layout

## Future Improvements

- Real-time collaboration with WebSockets
- Team invitations and roles
- File attachments
- Calendar integrations
- Email reminders
- More AI providers
- Audit logs and advanced permissions

## Demo Link

`<YOUR_DEMO_LINK>`

## GitHub Link

`<YOUR_GITHUB_LINK>`
