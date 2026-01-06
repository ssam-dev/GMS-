# GMS Frontend

React.js frontend application for the Gym Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_SERVER_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional)
```

### Run Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   │   ├── ui/         # Base UI components
│   │   ├── admin/      # Admin components
│   │   ├── members/    # Member components
│   │   ├── trainers/   # Trainer components
│   │   └── equipment/  # Equipment components
│   ├── entities/       # Business logic & API clients
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── public/              # Static assets
├── index.html           # HTML template
└── vite.config.js       # Vite configuration
```

## 🎨 Features

- **Modern UI** - Built with React, Tailwind CSS, and Radix UI
- **Responsive Design** - Works on all devices
- **Dark Mode Ready** - UI supports theming
- **File Uploads** - Profile photos and certificates
- **Real-time Updates** - Instant UI feedback
- **Form Validation** - Client-side validation
- **Error Handling** - User-friendly error messages

## 🔌 API Integration

The frontend communicates with the backend API through:
- `src/entities/apiClient.js` - Main API client
- `src/config/api.js` - API configuration

### API Configuration

Update environment variables to point to your backend:

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_API_SERVER_URL=https://your-backend-url.com
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set root directory to `frontend`
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Set environment variables in Vercel dashboard

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_API_SERVER_URL` | Backend server URL (for file URLs) | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |

## 📦 Key Dependencies

- **react** - UI library
- **react-router-dom** - Routing
- **vite** - Build tool
- **tailwindcss** - CSS framework
- **@radix-ui/** - UI component primitives
- **framer-motion** - Animations
- **sonner** - Toast notifications
- **date-fns** - Date utilities

## 🎯 Pages

- **Dashboard** - Overview and statistics
- **Members** - Member management
- **Trainers** - Trainer management
- **Equipment** - Equipment management
- **Login** - Authentication

## 🔧 Development

### Code Splitting

The build is optimized with code splitting:
- React vendor bundle
- UI libraries bundle
- Auth vendor bundle
- Utilities bundle

### Hot Module Replacement

Vite provides instant HMR during development.

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Custom Components** - Located in `src/components/ui/`

## 📞 Support

For issues or questions, check the main project documentation or create an issue.

---

**Last Updated**: January 6, 2026
