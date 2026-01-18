# Development Guide - AI Code Review Platform

This guide helps you set up and run the AI Code Review Platform locally for development.

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-code-review-platform

# Install all dependencies (root, frontend, backend)
npm run install:all
```

### 2. Set Up Environment Variables

**Backend (.env)**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/code_review
JWT_SECRET=your-super-secret-jwt-key-change-this
CLAUDE_API_KEY=your-claude-api-key-here
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env)**

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Set Up Database

**Option A: Local PostgreSQL**

Install PostgreSQL locally and create database:

```bash
createdb code_review
```

**Option B: Docker**

```bash
docker-compose up -d postgres
```

**Option C: Supabase (Recommended)**

1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Use it as `DATABASE_URL`

### 4. Run Database Migrations

```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run prisma:seed  # Optional: adds demo data
```

### 5. Start Development Servers

**Option A: Start All (Recommended)**

```bash
# From root directory
npm run dev
```

This starts both frontend and backend concurrently.

**Option B: Start Separately**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health
- **Prisma Studio**: Run `npm run prisma:studio` in backend directory

## Project Structure

```
ai-code-review-platform/
├── backend/               # Express API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   ├── app.ts        # Express app setup
│   │   └── server.ts     # Server entry point
│   ├── prisma/           # Database schema & migrations
│   └── package.json
│
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ui/       # Base UI components
│   │   │   ├── layout/   # Layout components
│   │   │   ├── code-editor/
│   │   │   ├── feedback/
│   │   │   └── dashboard/
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── store/        # Zustand stores
│   │   ├── lib/          # Utilities
│   │   ├── types/        # TypeScript types
│   │   ├── styles/       # Global styles
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   └── package.json
│
├── shared/               # Shared types
│   └── types/
│
└── package.json          # Root package.json
```

## Development Workflow

### Making Changes

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Backend changes in `backend/src/`
   - Frontend changes in `frontend/src/`
   - Both have hot-reload enabled

3. **Test your changes**

   ```bash
   # Backend tests (when implemented)
   cd backend
   npm test

   # Frontend tests (when implemented)
   cd frontend
   npm test
   ```

4. **Lint your code**

   ```bash
   # Backend
   cd backend
   npm run lint
   npm run lint:fix  # Auto-fix issues

   # Frontend
   cd frontend
   npm run lint
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

### Database Changes

When modifying the Prisma schema:

```bash
cd backend

# Create a migration
npx prisma migrate dev --name your_migration_name

# Generate Prisma Client
npx prisma generate

# View data in Prisma Studio
npx prisma studio
```

### Adding New Dependencies

```bash
# Backend
cd backend
npm install package-name
npm install -D @types/package-name  # For TypeScript types

# Frontend
cd frontend
npm install package-name
```

## API Development

### Creating a New Endpoint

1. **Define types** in `backend/src/types/`
2. **Create service** in `backend/src/services/`
3. **Create controller** in `backend/src/controllers/`
4. **Add route** in `backend/src/routes/`
5. **Register route** in `backend/src/app.ts`

Example:

```typescript
// 1. Service (services/example.service.ts)
export class ExampleService {
  async getData() {
    return await prisma.example.findMany();
  }
}

// 2. Controller (controllers/example.controller.ts)
export class ExampleController {
  getData = asyncHandler(async (req, res) => {
    const data = await exampleService.getData();
    res.json({ success: true, data });
  });
}

// 3. Route (routes/example.routes.ts)
const router = Router();
router.get("/", authenticate, exampleController.getData);
export default router;

// 4. Register in app.ts
import exampleRoutes from "./routes/example.routes";
app.use("/api/example", exampleRoutes);
```

## Frontend Development

### Creating a New Component

```typescript
// components/example/Example.tsx
import { Card } from '@/components/ui/card';

interface ExampleProps {
  data: string;
}

export const Example = ({ data }: ExampleProps) => {
  return (
    <Card>
      <p>{data}</p>
    </Card>
  );
};
```

### Creating a New Page

```typescript
// pages/Example.tsx
import { Example } from '@/components/example/Example';

export const ExamplePage = () => {
  return (
    <div className="space-y-6">
      <h1>Example Page</h1>
      <Example data="Hello" />
    </div>
  );
};

// Add route in App.tsx
<Route path="/example" element={<ExamplePage />} />
```

### Using API Hooks

```typescript
// In your component
import { useCodeReview } from "@/hooks/useCodeReview";

const { useSubmissions } = useCodeReview();
const { data, isLoading, error } = useSubmissions();
```

## Debugging

### Backend Debugging

1. **View logs**
   - Logs are in `backend/logs/` directory
   - Console logs show in terminal

2. **Debug with VS Code**
   - Add breakpoints in code
   - Run "Debug: Attach to Node Process"
   - Select the backend process

3. **Database queries**
   - Prisma logs all queries in development
   - Use Prisma Studio to inspect data

### Frontend Debugging

1. **React DevTools**
   - Install React DevTools extension
   - Inspect component tree and state

2. **Network requests**
   - Open browser DevTools > Network tab
   - View API requests and responses

3. **Console logs**
   - Use `console.log()` for debugging
   - Remove before committing

## Common Issues

### Port Already in Use

```bash
# Find and kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Or change PORT in backend/.env
PORT=3001
```

### Database Connection Failed

- Check PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Ensure database exists

### Module Not Found

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Out of Sync

```bash
cd backend
npx prisma generate
```

## Performance Tips

### Backend

- Use indexes on frequently queried fields
- Implement caching for expensive operations
- Use pagination for large datasets
- Monitor N+1 query problems

### Frontend

- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Optimize images and assets
- Use proper keys in lists

## Git Workflow

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build process or auxiliary tools

Example:

```
feat(auth): add password reset functionality

Implemented password reset via email with secure tokens.
Tokens expire after 1 hour.

Closes #123
```

## Next Steps

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add E2E tests
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger)
- [ ] Implement caching layer
- [ ] Add rate limiting per user
- [ ] Implement WebSockets for real-time updates

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Claude API Documentation](https://docs.anthropic.com/)

## Getting Help

- Check existing GitHub issues
- Read the documentation
- Ask in discussions
- Contact maintainers

Happy coding! 🚀
