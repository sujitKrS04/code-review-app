# AI Code Review Teaching Assistant

A modern, responsive AI-powered code review platform for programming education that helps students learn better coding practices through intelligent feedback and progress tracking.

## Features

### Core Features

- 🤖 **AI-Powered Code Review** - Intelligent feedback using Claude API
- 📊 **Multi-Language Support** - Python, JavaScript, Java, C++
- 📈 **Progress Tracking** - Visual skill progression and analytics
- 🎯 **Practice Problems** - AI-generated challenges targeting weak areas
- 🔍 **Plagiarism Detection** - AST-based code similarity analysis
- 🎨 **Modern UI** - Responsive design with light/dark themes

### Technical Features

- Style checking with language-specific linting
- Time/space complexity analysis
- Security vulnerability scanning
- Code maintainability metrics
- Best practices detection (SOLID principles, design patterns)
- Common mistake pattern recognition

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite for fast build tooling
- TailwindCSS + Shadcn/ui
- Monaco Editor
- Chart.js for visualizations
- Zustand for state management
- React Query for API calls

### Backend

- Node.js with Express.js
- TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- Claude API integration
- Winston logging

### Free Services

- Database: Supabase (PostgreSQL)
- AI Model: Claude API
- Hosting: Vercel (frontend) + Railway/Render (backend)
- Code Analysis: ESLint, Pylint, Checkstyle

## Getting Started

### Quick Start - Local Development

📖 **See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guide.**

```bash
# 1. Clone and install
git clone https://github.com/sujitKrS04/code-review-app.git
cd code-review-app
npm run install:all

# 2. Set up environment variables
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env
# Edit both .env files with your values

# 3. Set up database and run migrations
cd backend
npx prisma migrate dev
npx prisma generate
npm run prisma:seed  # Optional: adds demo data

# 4. Start development servers
cd ..
npm run dev
```

**Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Production Deployment

🚀 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.**

**Recommended Stack:**

- **Database**: Supabase (PostgreSQL) - Free tier
- **Backend**: Railway or Render - $5-20/month
- **Frontend**: Vercel - Free tier
- **AI**: Claude API - Pay per use

**Quick deployment:**

1. Set up Supabase database and get connection string
2. Deploy backend to Railway/Render with environment variables
3. Deploy frontend to Vercel
4. Run database migrations: `npx prisma migrate deploy`

**Estimated monthly cost**: $10-75 depending on usage

## Project Structure

```
ai-code-review-platform/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── shared/            # Shared TypeScript types
└── package.json       # Root package.json with scripts
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Code Submissions

- `POST /api/code/submit` - Submit code for review
- `GET /api/code/submissions` - Get user submissions
- `GET /api/code/submission/:id` - Get specific submission

### Reviews

- `POST /api/review/analyze` - Analyze code
- `GET /api/review/:submissionId` - Get review results

### Progress

- `GET /api/progress/:userId` - Get user progress
- `GET /api/progress/:userId/skills` - Get skill breakdown

### Plagiarism

- `POST /api/plagiarism/check` - Check for plagiarism
- `GET /api/plagiarism/report/:submissionId` - Get plagiarism report

### Practice

- `GET /api/practice/problems` - Get practice problems
- `POST /api/practice/generate` - Generate new problems
- `POST /api/practice/submit` - Submit practice solution

## Deployment

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive step-by-step deployment guide.

**Services:**

- **Frontend**: Vercel (Free tier)
- **Backend**: Railway ($5-20/month) or Render (Free with sleep)
- **Database**: Supabase (Free tier)
- **AI**: Claude API (Pay per use)

**Docker Support:**

Build and run locally:

```bash
# Backend
cd backend
docker build -t ai-code-review-api .
docker run -p 3000:3000 --env-file .env ai-code-review-api

# Frontend
cd frontend
docker build -t ai-code-review-frontend .
docker run -p 8080:8080 ai-code-review-frontend
```

Or use Docker Compose:

```bash
docker-compose up -d
```

### Environment Variables

**Backend Required:**

- `DATABASE_URL` - PostgreSQL connection string from Supabase
- `JWT_SECRET` - Secret key for JWT tokens (min 32 chars)
- `CLAUDE_API_KEY` - API key from Anthropic
- `CORS_ORIGIN` - Frontend URL for CORS

**Frontend Required:**

- `VITE_API_URL` - Backend API URL

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed configuration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
