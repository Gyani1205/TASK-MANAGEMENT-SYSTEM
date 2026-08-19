Task Management System

A modern full-stack Task Management System designed to help users organize workspaces, projects, tasks, subtasks, comments, labels, and team collaboration in one centralized platform.

The application provides a clean and responsive interface inspired by modern project-management tools, with secure authentication and a RESTful backend API.

🚀 Features

🔐 User Authentication
  - User registration and login
  - JWT-based authentication
  - Refresh token support
  - Logout functionality
  - Guest access
  - Google OAuth integration support
🏢 Workspace Management
   - Create workspaces
   - Switch between workspaces
   - Update workspace details
   - Add and remove workspace members
   - Delete workspaces
📁 Project Management
   - Create projects
   - View projects
   - Update project information
   - Delete projects
✅ Task Management
   - Create tasks
   - View task details
   - Update tasks
   - Delete tasks
   - Reorder tasks
   - Organize and manage task workflows
📌 Additional Features
   - Subtasks
   - Comments
   - Labels
   - Activity tracking
   - User profile management
   - Theme settings
   - Field visibility settings
   - Dark mode support
   - Responsive user interface
🛠️ Tech Stack
   - Frontend
   - Next.js 15
   - React 18
   - TypeScript
   - Tailwind CSS
   - Zustand
   - TanStack React Query
   - React Hook Form
   - Zod
   - Axios
   - Radix UI
   - Lucide React
   - Sonner
   - dnd-kit
   - Backend
   - NestJS
   - TypeScript
   - Prisma ORM
   - Passport.js
   - JWT Authentication
   - Cookie Parser
   - Swagger API Documentation
   - Throttler / Rate Limiting
   - Database
   - PostgreSQL
   - Prisma ORM
 📂 Project Structure
TASK-MANAGEMENT-SYSTEM/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── package.json
│   └── next.config.mjs
│
├── backend/
│   ├── src/
│   │   ├── common/
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
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── prisma/
│   └── package.json
│
└── README.md
⚙️ Installation and Setup
1. Clone the Repository
   git clone https://github.com/Gyani1205/TASK-MANAGEMENT-SYSTEM.git
   
   cd TASK-MANAGEMENT-SYSTEM

   🖥️ Frontend Setup

Navigate to the frontend directory: 

cd frontend

Install dependencies:

npm install

Create a .env.local file:

NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

Start the development server:

npm run dev

The frontend will run at:

http://localhost:3000

⚙️ Backend Setup

Open a new terminal and navigate to the backend directory:

cd backend

Install dependencies:

npm install

Configure the required environment variables in your backend .env file.

Example:

PORT=4000
FRONTEND_URL=http://localhost:3000

DATABASE_URL=your_database_connection_string

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

Run Prisma migrations if required:

npx prisma migrate dev

Generate the Prisma client:

npx prisma generate

Start the backend:

npm run start:dev

The backend API will run at:

http://localhost:4000

📚 API Documentation

Swagger API documentation is available when the backend is running:

http://localhost:4000/api/docs

The backend uses the following API prefix:

/api/v1

🔗 Main API Modules
| Module         | Endpoint             |
| -------------- | -------------------- |
| Authentication | `/api/v1/auth`       |
| Users          | `/api/v1/users`      |
| Workspaces     | `/api/v1/workspaces` |
| Projects       | `/api/v1/projects`   |
| Tasks          | `/api/v1/tasks`      |
| Subtasks       | `/api/v1/subtasks`   |
| Comments       | `/api/v1/comments`   |
| Labels         | `/api/v1/labels`     |
| Activities     | `/api/v1/activities` |
| Theme          | `/api/v1/theme`      |
| Settings       | `/api/v1/settings`   |

🧪 Build Verification

The project frontend and backend were successfully built locally.

Backend
npm run build

Frontend
npm run build

The frontend build includes the following main pages:
- /
- /login
- /signup
- /tasks
- /tasks/[taskId]
- /projects
- /projects/[projectId]
- /profile
- /settings

🔒 Security Features

The backend includes several security-oriented features:

- JWT-based authentication
- Refresh token support
- Password-based authentication
- Input validation using NestJS ValidationPipe
- Whitelisting of request DTO fields
- Rate limiting using NestJS Throttler
-  CORS configuration
-  Protected API routes
-  HTTP exception handling

🎨 User Interface

The frontend provides:

- Modern dashboard layout
- Workspace switcher
- Project and task management screens
- Responsive design
- Dark mode
- Custom accent colors
- Toast notifications
- Drag-and-drop functionality
- Loading states and skeleton components

⚠️ Environment Configuration

Google OAuth requires valid credentials.

If you are running automated tests or CI workflows, make sure the required environment variables are configured, especially:

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
These values should be configured securely using environment variables or GitHub Actions Secrets rather than committing real credentials to the repository.

🧑‍💻 Author

Sadasivuni Gyaneswari

GitHub: Gyani1205

Project Repository: TASK-MANAGEMENT-SYSTEM

📄 License

This project was developed for educational and portfolio purposes.
