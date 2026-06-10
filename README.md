# 🎯 JobTracker v2

A full-stack MERN application to track job applications — built with authentication, a professional SaaS-style dark UI, analytics dashboard, and notes per application.

> **Live Demo:** [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

---

## ✨ What's New in v2

| Feature | v1 | v2 |
|---|---|---|
| User Authentication | ❌ | ✅ JWT + bcrypt |
| Per-user data isolation | ❌ | ✅ |
| Expanded job fields | ❌ | ✅ salary, location, link, resume version |
| Notes per application | ❌ | ✅ timestamped |
| Analytics chart | ❌ | ✅ Recharts pie chart |
| Component architecture | ❌ Single file | ✅ 6 components |
| Tests | ❌ | ✅ Frontend + backend |
| Pagination | ❌ | ✅ |
| Error handling | ❌ | ✅ |
| Professional dark UI | ❌ | ✅ |

---

## 🖥️ Tech Stack

**Frontend:** React 18, Axios, Recharts  
**Backend:** Node.js, Express 4, MongoDB, Mongoose  
**Auth:** JWT, bcryptjs  
**Testing:** Jest, React Testing Library, Supertest  
**Deploy:** Vercel (frontend), Render (backend)

---

## 🏗️ Project Structure

```
job-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model with bcrypt
│   │   └── Job.js           # Job model with notes subdocument
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── routes/
│   │   ├── auth.js          # /auth/register, /auth/login, /auth/me
│   │   └── jobs.js          # Full CRUD + notes + stats + pagination
│   ├── __tests__/
│   │   └── api.test.js      # Integration tests with Supertest
│   └── server.js
└── src/
    ├── context/
    │   └── AuthContext.js   # Global auth state
    ├── pages/
    │   ├── AuthPage.js      # Login + Register
    │   └── DashboardPage.js # Main app
    ├── components/
    │   ├── Sidebar.js       # Navigation + filters
    │   ├── Dashboard.js     # Stats cards + Recharts pie
    │   ├── JobForm.js       # Add job form
    │   ├── JobCard.js       # Job row with edit + notes
    │   ├── JobList.js       # List + pagination
    │   └── SearchFilter.js  # Search input
    ├── __tests__/
    │   └── components.test.js
    └── api.js               # Axios instance with interceptors
```

---

## 🚀 Local Setup

### 1. Clone
```bash
git clone https://github.com/yourusername/job-tracker
cd job-tracker
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm run dev
```

### 3. Frontend
```bash
cd ..
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000
npm start
```

### 4. Run tests
```bash
# Backend
cd backend && npm test

# Frontend
cd .. && npm test
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | — | Create account |
| POST | /auth/login | — | Sign in |
| GET | /auth/me | ✅ | Current user |
| GET | /jobs | ✅ | List jobs (filter, search, paginate) |
| GET | /jobs/stats | ✅ | Dashboard counts |
| POST | /jobs | ✅ | Add job |
| PUT | /jobs/:id | ✅ | Update job |
| DELETE | /jobs/:id | ✅ | Delete job |
| POST | /jobs/:id/notes | ✅ | Add note |
| DELETE | /jobs/:id/notes/:noteId | ✅ | Delete note |

---

## 🎓 What I Learned

- Implementing stateless JWT authentication with bcrypt password hashing
- Mongoose schema design with subdocuments (notes) and aggregation pipelines (stats)
- React Context API for global auth state management
- Axios interceptors for automatic token injection and 401 handling
- Component-based architecture with clean separation of concerns
- Writing integration tests with Supertest and unit tests with React Testing Library
- Pagination with MongoDB `skip` and `limit`

---

## 📸 Screenshots

> *(Add screenshots here after deploying)*

---

## 📄 License

MIT
