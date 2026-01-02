# GMS - Project Structure Overview

## 📁 Root Directory

```
GMS/
├── README.md                 ← Project overview and setup instructions
├── .gitignore               ← Git ignore rules
├── .env.example             ← Environment variables template
├── .env                     ← Environment variables (not in git)
│
├── frontend/                ← React frontend application
│   ├── src/
│   │   ├── pages/           ← Page components (Dashboard, Members, etc.)
│   │   ├── components/      ← Reusable React components
│   │   ├── entities/        ← Business logic classes
│   │   ├── config/          ← Configuration files
│   │   ├── utils/           ← Utility functions
│   │   ├── App.jsx          ← Root component
│   │   └── main.jsx         ← Entry point
│   ├── index.html           ← HTML template
│   ├── vite.config.js       ← Build tool config
│   ├── tailwind.config.js   ← CSS framework config
│   ├── postcss.config.js    ← PostCSS config
│   ├── package.json         ← Dependencies & scripts
│   └── node_modules/        ← Installed packages (not in git)
│
├── backend/                 ← Express.js backend API
│   ├── models/              ← Database schemas
│   │   ├── Member.js
│   │   ├── Trainer.js
│   │   └── Equipment.js
│   ├── routes/              ← API endpoints
│   │   ├── members.js
│   │   ├── trainers.js
│   │   ├── equipment.js
│   │   └── uploads.js
│   ├── config/              ← Configuration (to be created)
│   ├── middleware/          ← Custom middleware (to be created)
│   ├── controllers/         ← Business logic (to be created)
│   ├── uploads/             ← Uploaded files storage
│   │   └── equipment/       ← Equipment images
│   ├── index.js             ← Server entry point
│   ├── package.json         ← Dependencies & scripts
│   ├── .env                 ← Environment variables
│   └── node_modules/        ← Installed packages (not in git)
│
└── docs/                    ← Project documentation
    ├── README.md            ← Documentation index
    ├── API.md               ← API endpoint documentation
    ├── BACKEND.md           ← Backend development guide
    ├── FRONTEND.md          ← Frontend development guide
    ├── GOOGLE_OAUTH_SETUP.md    ← OAuth setup guide
    └── GOOGLE_SETUP_GUIDE.md    ← Detailed OAuth instructions
```

## 🗂️ Key Directory Descriptions

### `frontend/src/pages/`
Full-page components that are routed:
- `Dashboard.jsx` - Main admin dashboard
- `Members.jsx` - Member management
- `Trainers.jsx` - Trainer management
- `Equipment.jsx` - Equipment management
- `Login.jsx` - Authentication page

### `frontend/src/components/`
Reusable React components organized by feature:
- `ui/` - Base UI components (button, input, card, etc.)
- `admin/` - Admin-specific components
- `dashboard/` - Dashboard widgets
- `members/` - Member-related components
- `trainers/` - Trainer-related components
- `equipment/` - Equipment-related components

### `frontend/src/entities/`
Business logic and API client classes:
- `User.js` - Authentication logic
- `Member.js` - Member API methods
- `Trainer.js` - Trainer API methods
- `Equipment.js` - Equipment API methods
- `apiClient.js` - Base HTTP client

### `backend/models/`
MongoDB/Mongoose schemas:
- `Member.js` - Member data structure
- `Trainer.js` - Trainer data structure
- `Equipment.js` - Equipment data structure

### `backend/routes/`
API endpoints organized by resource:
- `members.js` - GET, POST, PUT, DELETE /api/members
- `trainers.js` - GET, POST, PUT, DELETE /api/trainers
- `equipment.js` - GET, POST, PUT, DELETE /api/equipment
- `uploads.js` - POST /api/uploads

### `docs/`
Comprehensive documentation:
- `README.md` - Index of all documentation
- `API.md` - Complete API reference
- `BACKEND.md` - Backend setup & architecture
- `FRONTEND.md` - Frontend setup & architecture
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth initial setup
- `GOOGLE_SETUP_GUIDE.md` - Detailed OAuth instructions

## 🚀 Quick Navigation

**For Frontend Development:**
```
frontend/
├── src/pages/          ← Add new pages here
├── src/components/     ← Create new components here
└── src/entities/       ← Add business logic here
```

**For Backend Development:**
```
backend/
├── routes/             ← Add API endpoints here
├── models/             ← Modify data schemas here
└── uploads/            ← Uploaded files stored here
```

**For Documentation:**
```
docs/
├── API.md             ← Find API endpoints
├── BACKEND.md         ← Backend troubleshooting
└── FRONTEND.md        ← Frontend troubleshooting
```

## 📦 File Organization Rules

### Naming Conventions
- **Components**: PascalCase (e.g., `MemberCard.jsx`)
- **Utilities**: camelCase (e.g., `parseDate.js`)
- **Routes**: lowercase (e.g., `members.js`)
- **Models**: PascalCase (e.g., `Member.js`)

### File Placement
- **React Components**: `src/components/<feature>/<ComponentName>.jsx`
- **Pages**: `src/pages/<PageName>.jsx`
- **Entities**: `src/entities/<EntityName>.js`
- **Utilities**: `src/utils/index.js` or separate files
- **API Routes**: `backend/routes/<resource>.js`
- **Models**: `backend/models/<Model>.js`

## 🔄 Data Flow

```
User Action (React Component)
    ↓
Entity Class (Business Logic)
    ↓
API Client (HTTP Request)
    ↓
Backend Route (Express Handler)
    ↓
MongoDB Model (Database Operation)
    ↓
Database (Store/Retrieve Data)
```

## 📚 How to Find Things

**I need to add a new member field:**
1. Update schema: `backend/models/Member.js`
2. Update entity: `frontend/src/entities/Member.js`
3. Update form: `frontend/src/components/members/MemberForm.jsx`
4. Update API docs: `docs/API.md`

**I need to create a new API endpoint:**
1. Create route: `backend/routes/<resource>.js`
2. Create entity method: `frontend/src/entities/<Entity>.js`
3. Update API docs: `docs/API.md`

**I need to add a new page:**
1. Create page: `frontend/src/pages/<Page>.jsx`
2. Create components: `frontend/src/components/<feature>/<Component>.jsx`
3. Add route: `frontend/src/App.jsx`
4. Add navigation: `frontend/src/components/Layout.jsx`

## ✅ Industry Best Practices Implemented

✅ **Clear Separation of Concerns**
- Frontend completely separate from backend
- Business logic separated from UI components

✅ **Organized File Structure**
- Features grouped in folders
- Related files close together
- Easy to locate code

✅ **Comprehensive Documentation**
- Multiple guides for different use cases
- API documentation included
- Setup instructions provided

✅ **Scalable Architecture**
- Easy to add new features
- Middleware structure ready
- Controller pattern ready to implement

✅ **Professional Standards**
- .gitignore configured
- .env.example provided
- README with setup instructions
- Clear naming conventions

---

**Last Updated**: January 2, 2026
