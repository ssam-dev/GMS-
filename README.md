# GMS - Gym Management System

A comprehensive full-stack web application for managing gym operations including members, trainers, and equipment.

**Status: ✅ Production Ready** - See [PRODUCTION_READY.md](PRODUCTION_READY.md) for details

## 📋 Project Structure

```
GMS/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── pages/           # Page components (Dashboard, Members, Trainers, Equipment, Login)
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Base UI components (button, input, card, etc.)
│   │   │   ├── admin/       # Admin profile components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── members/     # Member-related components
│   │   │   ├── trainers/    # Trainer-related components
│   │   │   └── equipment/   # Equipment-related components
│   │   ├── entities/        # Business logic entities (User, Member, Trainer, Equipment)
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files (auth.js)
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── vite.config.js       # Vite build configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── postcss.config.js    # PostCSS configuration
│   ├── package.json         # Frontend dependencies
│   └── index.html           # HTML template
│
├── backend/                  # Express.js backend API
│   ├── models/              # Mongoose schemas (Member, Trainer, Equipment)
│   ├── routes/              # API routes
│   │   ├── members.js       # Member endpoints
│   │   ├── trainers.js      # Trainer endpoints
│   │   ├── equipment.js     # Equipment endpoints
│   │   └── uploads.js       # File upload endpoints
│   ├── controllers/         # Business logic (future refactoring)
│   ├── middleware/          # Express middleware (future expansion)
│   ├── config/              # Configuration files
│   ├── uploads/             # Uploaded files storage
│   ├── index.js             # Server entry point
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
├── docs/                     # Documentation
│   ├── GOOGLE_OAUTH_SETUP.md    # OAuth configuration guide
│   ├── GOOGLE_SETUP_GUIDE.md    # Detailed setup instructions
│   └── API.md               # API endpoint documentation
│
├── BACKEND_ENV_VARIABLES.md     # Backend environment variables guide
├── MONGODB_CONNECTION_STRING.md  # MongoDB connection string guide
├── DEPLOY_GUIDE.md              # Complete deployment guide
├── QUICK_DEPLOY.md              # Quick deployment reference
└── SPLIT_REPOSITORIES.md        # Repository separation guide
│
├── .env.example             # Example environment variables
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

### Environment Setup

Create `.env` files in both backend and frontend directories:

**backend/.env**
```
MONGODB_URI=mongodb://localhost:27017/gms
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://127.0.0.1:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

## 🔐 Authentication

### Email/Password Login
- Demo Email: `admin@gym.com`
- Demo Password: `admin123`

### Google OAuth
- **Test Mode**: Click "Continue with Google (Test Mode)" - no setup required
- **Real OAuth**: See [GOOGLE_SETUP_GUIDE.md](docs/GOOGLE_SETUP_GUIDE.md)

## 📚 API Documentation

See [docs/API.md](docs/API.md) for complete endpoint documentation.

### Main Endpoints
- `GET/POST /api/members` - Member management
- `GET/POST /api/trainers` - Trainer management
- `GET/POST /api/equipment` - Equipment management
- `POST /api/uploads` - File uploads

## 🔧 Key Features

- ✅ Member management (CRUD operations)
- ✅ Trainer profiles and management
- ✅ Equipment tracking and maintenance
- ✅ Image upload (file, camera, URL)
- ✅ Authentication (email/password, Google OAuth)
- ✅ Persistent sessions
- ✅ Responsive UI with Tailwind CSS
- ✅ Real-time updates
- ✅ **Security**: Password hashing, input validation, security headers
- ✅ **Performance**: Database indexes, rate limiting, caching
- ✅ **Documentation**: Swagger API docs, deployment guide
- ✅ **Monitoring**: Request logging, health check endpoint

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router 6** - Navigation
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File uploads
- **CORS** - Cross-origin requests

## 📝 Development Workflow

### Adding a New Feature

1. Create API endpoint in `backend/routes/`
2. Create component in `frontend/src/components/`
3. Use entity classes from `frontend/src/entities/` for API calls
4. Add page if needed in `frontend/src/pages/`
5. Add route in `frontend/src/App.jsx`

### File Organization Tips

- **Pages**: Full page components that are routed
- **Components**: Reusable UI components
- **Entities**: Business logic and API client classes
- **Utils**: Helper functions
- **Config**: Configuration constants

## 🐛 Troubleshooting

**Backend not starting?**
- Check MongoDB connection
- Verify port 5000 is available
- Check `.env` variables

**Frontend not connecting?**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend/.env
- Clear browser cache

**Google OAuth errors?**
- See [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)
- Use test mode for development

## 📞 Support

For issues and questions:
1. Check documentation in `docs/` folder
2. Review console for error messages
3. Check backend logs for API errors

## 📚 Deployment Documentation

- **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** - Complete step-by-step deployment guide
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Quick 5-minute deployment reference
- **[BACKEND_ENV_VARIABLES.md](BACKEND_ENV_VARIABLES.md)** - Backend environment variables reference
- **[MONGODB_CONNECTION_STRING.md](MONGODB_CONNECTION_STRING.md)** - MongoDB connection string guide
- **[SPLIT_REPOSITORIES.md](SPLIT_REPOSITORIES.md)** - Guide for separating backend/frontend repos

## 📄 License

This project is proprietary and confidential.

---

**Last Updated**: January 2, 2026
