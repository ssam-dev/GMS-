# GMS Project - Complete Setup & Development Guide

## 🎯 Project Overview

**GMS (Gym Management System)** is a full-stack web application for managing gym operations:
- Member management (CRUD, search, filter)
- Trainer management with certifications
- Equipment tracking with maintenance scheduling
- Image uploads for profiles and equipment
- Authentication with email/password and Google OAuth
- Persistent sessions with localStorage
- Responsive dashboard with statistics

**Tech Stack:**
- Frontend: React 18, Vite, Tailwind CSS, Shadcn UI
- Backend: Express.js, MongoDB, Mongoose
- Authentication: localStorage, Google OAuth

---

## 📂 Project Structure

```
GMS/
├── frontend/               ← React application
│   └── src/
│       ├── pages/         ← Login, Dashboard, Members, Trainers, Equipment
│       ├── components/    ← Reusable React components
│       ├── entities/      ← Business logic (User, Member, Trainer, Equipment)
│       └── config/        ← Authentication config
│
├── backend/                ← Express API server
│   ├── models/            ← MongoDB schemas
│   ├── routes/            ← API endpoints
│   ├── config/            ← Configuration
│   ├── middleware/        ← Middleware (ready for expansion)
│   ├── controllers/       ← Business logic (ready for expansion)
│   └── uploads/           ← Uploaded files
│
├── docs/                   ← Documentation
│   ├── README.md
│   ├── API.md             ← API endpoint reference
│   ├── BACKEND.md         ← Backend guide
│   ├── FRONTEND.md        ← Frontend guide
│   ├── STRUCTURE.md       ← Project structure guide
│   └── GOOGLE_*.md        ← OAuth setup guides
│
└── [Config files]
    ├── README.md
    ├── .gitignore
    ├── .env.example
    └── .env
```

**See [docs/STRUCTURE.md](docs/STRUCTURE.md) for detailed structure breakdown.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org))
- MongoDB ([Download](https://www.mongodb.com/try/download/community))
- Git (optional)

### Step 1: Install Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/gms
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Step 2: Install Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

### Step 3: Start MongoDB

```bash
# Windows
mongod.exe

# macOS
mongod

# Linux
mongod
```

### Step 4: Start Backend

```bash
cd backend
npm start
# Server runs on http://127.0.0.1:5000
```

### Step 5: Start Frontend

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 6: Login

- **Email:** `admin@gym.com`
- **Password:** `admin123`
- OR click "Continue with Google (Test Mode)" (no setup required)

---

## 🔐 Authentication

### Email/Password Login
1. Frontend sends credentials to `/api/members` (if implemented) or uses mock
2. User object stored in `localStorage`
3. Session persists until logout

### Google OAuth
**Test Mode (Default):**
- Click "Continue with Google (Test Mode)" button
- No Google Cloud setup required
- Creates mock user for testing

**Real Google OAuth:**
1. Follow [docs/GOOGLE_SETUP_GUIDE.md](docs/GOOGLE_SETUP_GUIDE.md)
2. Get Google Client ID from Google Cloud Console
3. Update `frontend/src/config/auth.js`:
   ```javascript
   const USE_MOCK_GOOGLE = false;  // Enable real OAuth
   export const GOOGLE_CLIENT_ID = "your-client-id-here";
   ```
4. Login with real Google account

---

## 📚 API Documentation

See **[docs/API.md](docs/API.md)** for complete endpoint reference.

### Main Endpoints:

**Members:**
- `GET /api/members` - Get all members
- `POST /api/members` - Create member
- `GET /api/members/:id` - Get by ID
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

**Trainers:**
- `GET /api/trainers` - Get all trainers
- `POST /api/trainers` - Create trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

**Equipment:**
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create (with image upload)
- `PUT /api/equipment/:id` - Update
- `DELETE /api/equipment/:id` - Delete
- `DELETE /api/equipment/:id/remove-image` - Remove image

**Uploads:**
- `POST /api/uploads` - Upload files

---

## 🔧 Development Guides

### For Backend Development
See **[docs/BACKEND.md](docs/BACKEND.md)**
- Model schemas and structure
- Route organization
- Adding new endpoints
- Database setup

### For Frontend Development
See **[docs/FRONTEND.md](docs/FRONTEND.md)**
- Component structure
- Page layout
- Entity classes
- Adding new features
- State management

### For Project Structure
See **[docs/STRUCTURE.md](docs/STRUCTURE.md)**
- Directory organization
- File naming conventions
- Best practices
- How to find code

---

## 💡 Adding a New Feature

### Example: Add a "Classes" Feature

1. **Backend:**
   - Create `backend/models/Class.js` with schema
   - Create `backend/routes/classes.js` with endpoints
   - Test with Postman

2. **Frontend:**
   - Create `frontend/src/entities/Class.js` with API methods
   - Create `frontend/src/components/classes/ClassCard.jsx`
   - Create `frontend/src/components/classes/ClassForm.jsx`
   - Create `frontend/src/pages/Classes.jsx`
   - Add route to `frontend/src/App.jsx`
   - Add navigation in `frontend/src/components/Layout.jsx`

3. **Documentation:**
   - Update [docs/API.md](docs/API.md) with new endpoints

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
- Kill process: `netstat -ano | findstr :5000` (Windows)
- Or change port in `backend/.env`

### Frontend Issues

**CORS Errors:**
```
Access to XMLHttpRequest blocked by CORS policy
```
- Backend not running on port 5000
- Check `VITE_API_URL` in `frontend/.env`
- Verify `CORS_ORIGIN` in `backend/.env`

**Google OAuth Errors:**
- Use test mode (default)
- OR follow [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)

**Image Upload Not Working:**
- Ensure `backend/uploads/equipment/` folder exists
- Check file permissions
- Check file size limits

### General Issues

**npm install fails:**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port conflicts:**
- Frontend usually uses 3000, can use 3001+ if occupied
- Backend uses 5000, configure in `.env`

---

## 📊 Feature Checklist

### Core Features
- ✅ Member Management (CRUD, search, filter)
- ✅ Trainer Management (CRUD, search)
- ✅ Equipment Management (CRUD, search, images)
- ✅ Dashboard with statistics
- ✅ Image uploads (file, camera, URL)
- ✅ Image deletion

### Authentication
- ✅ Email/Password login
- ✅ Persistent sessions (localStorage)
- ✅ Google OAuth integration
- ✅ Google test mode (no setup)
- ✅ Logout functionality
- ✅ Protected routes

### UI/UX
- ✅ Responsive design
- ✅ Tailwind CSS styling
- ✅ Shadcn UI components
- ✅ Framer Motion animations
- ✅ Lucide React icons
- ✅ Form validation

### Developer Experience
- ✅ Clear project structure
- ✅ Comprehensive documentation
- ✅ API reference guide
- ✅ Setup guides
- ✅ Troubleshooting guide
- ✅ Component organization

---

## 📖 Documentation Index

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | Project overview & quick start |
| [docs/API.md](API.md) | API endpoints & examples |
| [docs/BACKEND.md](BACKEND.md) | Backend development guide |
| [docs/FRONTEND.md](FRONTEND.md) | Frontend development guide |
| [docs/STRUCTURE.md](STRUCTURE.md) | Project structure & organization |
| [docs/GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) | OAuth setup basics |
| [docs/GOOGLE_SETUP_GUIDE.md](GOOGLE_SETUP_GUIDE.md) | Detailed OAuth instructions |

---

## 🔗 Useful Links

- [Node.js Documentation](https://nodejs.org/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Tailwind CSS](https://tailwindcss.com)
- [Google Cloud Console](https://console.cloud.google.com)

---

## 🎓 Learning Resources

**New to the project?**
1. Read [README.md](../README.md) for overview
2. Read [docs/STRUCTURE.md](STRUCTURE.md) to understand organization
3. Choose path:
   - **Backend dev:** Read [docs/BACKEND.md](BACKEND.md)
   - **Frontend dev:** Read [docs/FRONTEND.md](FRONTEND.md)
4. Check [docs/API.md](API.md) for available endpoints

**Need to add a feature?**
1. See "Adding a New Feature" section above
2. Refer to similar existing components
3. Check API documentation
4. Test with Postman or browser

**Stuck or confused?**
1. Check relevant documentation file
2. Search codebase for similar patterns
3. Check browser console for errors
4. Check backend logs for API errors

---

## 💾 Saving Progress

### Git Workflow
```bash
# Stage changes
git add .

# Commit
git commit -m "Feature: Add classes management"

# Push
git push origin main
```

### .gitignore
Already configured to ignore:
- `node_modules/`
- `.env` files
- Uploaded files (configured)
- IDE files (.vscode, .idea)

---

## 🚀 Deployment (Future)

When deploying to production:

1. **Backend:**
   - Deploy to Heroku, AWS, or similar
   - Update `MONGODB_URI` to production database
   - Update `CORS_ORIGIN` to production frontend URL

2. **Frontend:**
   - Deploy to Vercel, Netlify, or similar
   - Build: `npm run build`
   - Update `VITE_API_URL` to production API

3. **Google OAuth:**
   - Add production URLs to Google Cloud Console
   - Use production Client ID

4. **Database:**
   - Use managed MongoDB (Atlas, etc.)
   - Configure backups
   - Set up indexes

---

## 📞 Support

**For issues:**
1. Check relevant documentation
2. Review console errors
3. Check backend logs
4. See Troubleshooting section

**Common problems:**
- MongoDB not running
- Port conflicts
- Missing .env variables
- Google OAuth not configured (use test mode)

---

## 📝 Version History

- **v1.0** (Jan 2, 2026)
  - Reorganized project structure
  - Created comprehensive documentation
  - Professional file organization
  - API documentation
  - Development guides

---

**Last Updated:** January 2, 2026

**Project Status:** ✅ Ready for Development & Deployment
