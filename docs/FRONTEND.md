# Frontend Development Guide

## Project Structure

```
frontend/
├── src/
│   ├── pages/                 # Full page components
│   │   ├── Dashboard.jsx
│   │   ├── Members.jsx
│   │   ├── Trainers.jsx
│   │   ├── Equipment.jsx
│   │   └── Login.jsx
│   ├── components/
│   │   ├── Layout.jsx         # Main layout wrapper
│   │   ├── ui/                # Base UI components
│   │   ├── admin/             # Admin-related components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── members/           # Member-related components
│   │   ├── trainers/          # Trainer-related components
│   │   └── equipment/         # Equipment-related components
│   ├── entities/              # Business logic & API clients
│   │   ├── User.js
│   │   ├── Member.js
│   │   ├── Trainer.js
│   │   ├── Equipment.js
│   │   ├── apiClient.js
│   │   └── base44Client.js
│   ├── utils/                 # Helper functions
│   │   └── index.js
│   ├── config/                # Configuration
│   │   └── auth.js
│   ├── App.jsx                # Root component with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── vite.config.js             # Build configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js
├── index.html
├── package.json
└── .env.example
```

## Pages

### Dashboard (`pages/Dashboard.jsx`)
Main admin dashboard with overview and statistics.
- **Components Used**: StatsCard, MembershipChart, RecentActivity
- **Data**: Fetches member, trainer, and equipment stats

### Members (`pages/Members.jsx`)
Member management page.
- **Components Used**: MemberCard, MemberDetails, MemberForm
- **Features**: Search, filter, CRUD operations

### Trainers (`pages/Trainers.jsx`)
Trainer management page.
- **Components Used**: TrainerCard, TrainerDetails, TrainerForm
- **Features**: Search, filter, CRUD operations

### Equipment (`pages/Equipment.jsx`)
Equipment management page.
- **Components Used**: EquipmentCard, EquipmentDetails, EquipmentForm
- **Features**: Search, filter, CRUD, image upload

### Login (`pages/Login.jsx`)
Authentication page.
- **Features**: Email/password login, Google OAuth, test mode
- **Session**: Stores credentials in localStorage

## Components

### UI Components (`components/ui/`)
Base components used throughout the app:
- `button.jsx` - Button component
- `input.jsx` - Text input
- `select.jsx` - Select dropdown
- `textarea.jsx` - Text area
- `card.jsx` - Card container
- `badge.jsx` - Badge/tag
- `tabs.jsx` - Tabbed interface
- `dropdown-menu.jsx` - Dropdown menu
- `sidebar.jsx` - Sidebar navigation
- `FileUpload.jsx` - Single file upload
- `MultiFileUpload.jsx` - Multiple file upload

### Layout (`components/Layout.jsx`)
Main layout wrapper with sidebar and user menu.

### Admin Components (`components/admin/`)
- `AdminProfileModal.jsx` - Profile settings with image upload

### Dashboard Components (`components/dashboard/`)
- `StatsCard.jsx` - Statistics card
- `MembershipChart.jsx` - Membership chart
- `RecentActivity.jsx` - Recent activity feed

### Members Components (`components/members/`)
- `MemberCard.jsx` - Member card display
- `MemberDetails.jsx` - Member details modal
- `MemberForm.jsx` - Create/edit member form
- `MemberStats.jsx` - Member statistics

### Trainers Components (`components/trainers/`)
- `TrainerCard.jsx` - Trainer card display
- `TrainerDetails.jsx` - Trainer details modal
- `TrainerForm.jsx` - Create/edit trainer form
- `TrainerStats.jsx` - Trainer statistics

### Equipment Components (`components/equipment/`)
- `EquipmentCard.jsx` - Equipment card display
- `EquipmentDetails.jsx` - Equipment details modal
- `EquipmentForm.jsx` - Create/edit equipment form
- `EquipmentTable.jsx` - Equipment table view
- `EquipmentStats.jsx` - Equipment statistics
- `MaintenanceDue.jsx` - Maintenance alerts
- `ImageModal.jsx` - Fullscreen image viewer

## Entities

Business logic and API client classes:

### User.js
Authentication management.
```javascript
User.login(email, password)           // Email/password login
User.loginWithGoogle(credential)      // Google OAuth login
User.logout()                         // Logout and clear session
User.isAuthenticated()                // Check if logged in
User.me()                             // Get current user
User.updateMyUserData(data)           // Update profile
```

### Member.js
Member data management.
```javascript
Member.all()                          // Get all members
Member.find(id)                       // Get by ID
Member.create(data)                   // Create new
Member.update(id, data)               // Update
Member.delete(id)                     // Delete
```

### Trainer.js
Trainer data management.
```javascript
Trainer.all()                         // Get all trainers
Trainer.find(id)                      // Get by ID
Trainer.create(data)                  // Create new
Trainer.update(id, data)              // Update
Trainer.delete(id)                    // Delete
```

### Equipment.js
Equipment data management.
```javascript
Equipment.all()                       // Get all equipment
Equipment.find(id)                    // Get by ID
Equipment.create(data)                // Create new (with image)
Equipment.update(id, data)            // Update
Equipment.delete(id)                  // Delete
Equipment.removeImage(id)             // Remove image
```

### apiClient.js
Base API client for HTTP requests.
```javascript
apiClient.get(endpoint)               // GET request
apiClient.post(endpoint, data)        // POST request
apiClient.put(endpoint, data)         // PUT request
apiClient.delete(endpoint)            // DELETE request
```

## Utilities

### utils/index.js
Helper functions for common operations.

## Configuration

### auth.js
Authentication configuration.
```javascript
USE_MOCK_GOOGLE           // Toggle test mode
GOOGLE_CLIENT_ID          // Google OAuth client ID
isGoogleAuthEnabled()     // Check if OAuth is available
GOOGLE_AUTH_MODE          // Current mode ('mock' or 'oauth')
```

## Styling

### Tailwind CSS
**Config**: `tailwind.config.js`
- Utility-first CSS framework
- Customizable theme
- Dark mode support

### Framer Motion
Animation library used for:
- Modal animations
- Transitions
- Hover effects

### Lucide React
Icon library with 1000+ icons.

## Authentication Flow

1. User navigates to `/login`
2. User enters credentials or clicks Google
3. `User.login()` or `User.loginWithGoogle()` called
4. Credentials stored in `localStorage`
5. Redirects to `/`
6. `ProtectedRoute` checks `localStorage` for auth
7. If authenticated, renders page; else redirects to `/login`

## State Management

Using React hooks:
- `useState()` - Component state
- `useRef()` - DOM references (file inputs, etc.)
- `useEffect()` - Side effects
- `useNavigate()` - Routing

## Data Flow

```
Page Component
    ↓
Entities (User, Member, etc.)
    ↓
apiClient
    ↓
Backend API
    ↓
Database
```

## Adding a New Feature

1. **Create Entity Class** (`src/entities/NewEntity.js`)
   - Define API methods
   - Handle data transformation

2. **Create Components**
   - Card component: `src/components/feature/FeatureCard.jsx`
   - Form component: `src/components/feature/FeatureForm.jsx`
   - Details modal: `src/components/feature/FeatureDetails.jsx`

3. **Create Page** (`src/pages/Feature.jsx`)
   - Use components
   - Call entity methods
   - Manage state

4. **Add Route** (in `src/App.jsx`)
   - Import page
   - Add route with protection

5. **Add Navigation** (in `components/Layout.jsx`)
   - Add menu item

## Environment Variables

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Starting Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000` or `http://localhost:3001`

## Building for Production

```bash
cd frontend
npm run build
```

Creates optimized build in `dist/` folder.

## Common Issues

### CORS Errors
- Backend not running on port 5000
- `VITE_API_URL` incorrect
- Backend CORS configuration issue

### Authentication Issues
- `localStorage` cleared
- Session expired
- Google OAuth not configured (use test mode)

### Image Upload Issues
- Backend uploads folder missing
- File size too large
- Unsupported file type

---

**Last Updated**: January 2, 2026
