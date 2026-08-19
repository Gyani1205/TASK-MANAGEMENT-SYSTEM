TaskFlow — Complete Task Management System

A full-stack task management application inspired by modern productivity tools such as Jira, Linear, and ClickUp.

TaskFlow allows users to manage workspaces, projects, tasks, subtasks, comments, labels, team members, and personal preferences through a modern Kanban-based interface.

🚀 Features
🔐 Authentication
User signup and login
Guest login
Google OAuth integration
JWT authentication
Refresh token support
Secure HTTP-only cookies
Logout functionality
Protected routes
🏢 Workspace Management
Create and manage workspaces
Switch between workspaces
Add and remove workspace members
Role-based access control
Workspace owner, admin, member, and guest roles
📁 Project Management
Create projects
Update project details
Delete projects
Project-specific task management
Project key and description support
✅ Task Management
Create, edit, and delete tasks
Task statuses:
To Do
Doing
Completed
On Hold
Priority levels
Due dates
Task descriptions
Assignees and reporters
Labels
Search and filtering
Sorting and pagination
📋 Kanban Board
Drag-and-drop task management
Multiple task columns
Optimistic UI updates
Automatic task reordering
Board and list views
📝 Task Details
Full task detail page
Inline task editing
Status and priority updates
Due date management
Assignee management
Label management
Activity timeline
☑️ Subtasks
Create subtasks
Mark subtasks as completed
Delete subtasks
Automatic progress calculation
💬 Comments
Add comments to tasks
Reply to comments
Nested comment support
Author-based delete permissions
🎨 Personalization
Light mode
Dark mode
System theme support
Multiple accent colors
Theme preferences stored in the backend
Task field visibility settings
👤 User Profile
Update name and username
Avatar URL support with preview
View email and role information
Delete account
🛠️ Tech Stack
Frontend
Next.js 15
TypeScript
Tailwind CSS
React Hook Form
Zod
TanStack Query
Zustand
Axios
Radix UI / shadcn-style components
dnd-kit
Backend
NestJS
TypeScript
Prisma ORM
PostgreSQL
Passport.js
JWT Authentication
Google OAuth
Swagger
class-validator
Testing
Jest
Supertest
Vitest
React Testing Library
DevOps & Deployment
Docker
Docker Compose
GitHub Actions
Render
Vercel
📁 Project Structure
TASK-MANAGEMENT-SYSTEM/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── workspaces/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   ├── subtasks/
│   │   │   ├── comments/
│   │   │   ├── labels/
│   │   │   ├── activities/
│   │   │   ├── theme/
│   │   │   └── settings/
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── package.json
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── render.yaml
└── README.md
🏗️ Architecture

TaskFlow follows a full-stack client-server architecture.

Next.js Frontend
       │
       │ REST API
       ▼
NestJS Backend
       │
       │ Prisma ORM
       ▼
PostgreSQL Database

The frontend communicates with the NestJS backend through REST APIs. Prisma handles database access and PostgreSQL stores application data.

🔌 API

The backend uses the following API prefix:

/api/v1
Authentication
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/guest
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/google
GET    /api/v1/auth/google/callback
Users
GET     /api/v1/users/me
PATCH   /api/v1/users/me
DELETE  /api/v1/users/me
GET     /api/v1/users
GET     /api/v1/users/:id
Workspaces
POST    /api/v1/workspaces
GET     /api/v1/workspaces
GET     /api/v1/workspaces/:id
PATCH   /api/v1/workspaces/:id
DELETE  /api/v1/workspaces/:id


POST    /api/v1/workspaces/:id/members
DELETE  /api/v1/workspaces/:id/members/:userId
Projects
POST    /api/v1/projects
GET     /api/v1/projects
GET     /api/v1/projects/:id
PATCH   /api/v1/projects/:id
DELETE  /api/v1/projects/:id
Tasks
POST    /api/v1/tasks
GET     /api/v1/tasks
GET     /api/v1/tasks/:id
PATCH   /api/v1/tasks/:id
PATCH   /api/v1/tasks/:id/reorder
DELETE  /api/v1/tasks/:id
Additional Modules

The API also includes endpoints for:

Subtasks
Comments
Labels
Activities
Theme preferences
Field visibility settings
📖 Swagger Documentation

Swagger API documentation is available when the backend is running:

http://localhost:4000/api/docs
⚙️ Local Installation
Prerequisites

Make sure you have installed:

Node.js 18+
npm
PostgreSQL or Docker
Option 1: Run with Docker

Clone the repository:

git clone https://github.com/Gyani1205/TASK-MANAGEMENT-SYSTEM.git

Navigate to the project:

cd TASK-MANAGEMENT-SYSTEM

Run the application:

docker compose up --build

Services:

Frontend: http://localhost:3000
Backend:  http://localhost:4000
Swagger:  http://localhost:4000/api/docs
Option 2: Run Locally
Backend
cd backend

Install dependencies:

npm install

Create the environment file:

cp .env.example .env

Configure the required environment variables, including:

DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
FRONTEND_URL=http://localhost:3000

Generate Prisma Client:

npx prisma generate

Run database migrations:

npx prisma migrate dev

Start the backend:

npm run start:dev

Backend:

http://localhost:4000
Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Create the environment file:

cp .env.local.example .env.local

Add your backend API URL:

NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

Start the frontend:

npm run dev

Open:

http://localhost:3000
🧪 Testing
Backend Unit Tests
cd backend
npm test
Backend E2E Tests

A PostgreSQL database is required.

cd backend
npx prisma migrate deploy
npm run test:e2e
Frontend Tests
cd frontend
npm test
🏗️ Production Build
Backend
cd backend
npm run build
Frontend
cd frontend
npm run build

The backend and frontend production builds have been successfully compiled locally.

🔄 CI/CD

GitHub Actions is configured to automatically run checks for:

Backend
Type checking
Unit tests
E2E tests
Production build
Frontend
Type checking
Unit and component tests
Production build
🚀 Deployment
Backend

The backend can be deployed using Render.

The repository includes:

render.yaml

Configure the required environment variables in the deployment environment:

DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
FRONTEND_URL
Frontend

The frontend can be deployed on Vercel.

Set the root directory to:

frontend

Configure:

NEXT_PUBLIC_API_URL

Example:

NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
🔒 Security Features
JWT authentication
Refresh tokens
HTTP-only cookies
Password hashing
Role-based access control
Protected API routes
Global validation
Input validation using DTOs
CORS configuration
Global exception handling
🔮 Future Improvements

Possible future enhancements include:

Avatar file uploads
Email change workflow
Workspace invitation emails
Real-time notifications
WebSocket-based live comments
Real-time task updates
Advanced analytics and reporting
Mobile application
👩‍💻 Author

Sadasivuni Gyaneswari

GitHub: Gyani1205

Repository: TASK-MANAGEMENT-SYSTEM

📄 License

This project was developed for educational, learning, and portfolio purposes.
