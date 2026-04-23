# Tech Academy API

REST API backend for the Tech Academy e-learning platform. Built with Node.js, Express, and MongoDB (Mongoose).

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: JWT + bcryptjs
- **Deployment**: Render

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | No | Health check |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/courses` | No | List all courses (filter: category, level, search) |
| GET | `/api/courses/:id` | No | Get course details |
| POST | `/api/courses` | Admin | Create a course |
| PUT | `/api/courses/:id` | Admin | Update a course |
| DELETE | `/api/courses/:id` | Admin | Delete a course |
| POST | `/api/enrollments` | JWT | Enroll in a course |
| GET | `/api/enrollments/my` | JWT | Get my enrollments |
| DELETE | `/api/enrollments/:courseId` | JWT | Unenroll from course |

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/your-username/tech-academy-api.git
cd tech-academy-api
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### 3. Seed database
```bash
npm run seed
```

### 4. Start development server
```bash
npm run dev
```

API runs at: `http://localhost:5001`

## Demo Credentials
- **Admin**: admin@techacademy.com / admin123
- **Student**: student@techacademy.com / student123

## Deployment on Render
1. Create a MongoDB database (e.g., using MongoDB Atlas)
2. Create a Web Service pointing to this repo
3. Set environment variables:
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — a strong random string
   - `CLIENT_URL` — your frontend URL
   - `NODE_ENV=production`
4. Build command: `npm install`
5. Start command: `node src/index.js`
