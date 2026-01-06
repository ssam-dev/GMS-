# GMS Backend API

Express.js backend API for the Gym Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gms
CORS_ORIGIN=http://localhost:3000
API_URL=http://localhost:5000
```

### Run Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Run Production Server

```bash
npm start
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api/docs`
- **Health Check**: `http://localhost:5000/api/health`

## 📁 Project Structure

```
backend/
├── models/          # Mongoose schemas
├── routes/          # API endpoints
├── middleware/      # Express middleware
├── config/          # Configuration files
├── utils/           # Utility functions
├── uploads/         # File uploads storage
├── __tests__/        # Test files
└── index.js         # Server entry point
```

## 🔌 API Endpoints

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Trainers
- `GET /api/trainers` - List all trainers
- `GET /api/trainers/:id` - Get trainer by ID
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Equipment
- `GET /api/equipment` - List all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### File Uploads
- `POST /api/upload/profile-photo` - Upload profile photo
- `POST /api/upload/certificates` - Upload certificates

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests/15min in production)
- Input validation middleware
- File upload validation

## 🚀 Deployment

### Render
1. Connect your GitHub repository
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Set environment variables in Render dashboard

### Railway
1. Connect your GitHub repository
2. Auto-detects Node.js
3. Set environment variables

### Heroku
1. Use the included `Procfile`
2. Set environment variables via Heroku CLI or dashboard

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | Yes |
| `API_URL` | Public API URL (for Swagger) | Optional |

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **multer** - File upload handling
- **helmet** - Security headers
- **cors** - CORS middleware
- **express-rate-limit** - Rate limiting
- **morgan** - HTTP request logger
- **swagger-ui-express** - API documentation
- **bcrypt** - Password hashing

## 🔧 Development

### Seed Database

```bash
npm run seed
```

### Watch Mode

```bash
npm run dev
```

Uses nodemon for automatic server restart on file changes.

## 📞 Support

For issues or questions, check the main project documentation or create an issue.

---

**Last Updated**: January 6, 2026
