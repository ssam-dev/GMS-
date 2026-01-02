# Backend Development Guide

## Project Structure

```
backend/
├── models/              # Mongoose schemas
│   ├── Member.js
│   ├── Trainer.js
│   └── Equipment.js
├── routes/              # API route handlers
│   ├── members.js
│   ├── trainers.js
│   ├── equipment.js
│   └── uploads.js
├── controllers/         # Business logic (to be implemented)
├── middleware/          # Custom middleware
├── config/              # Configuration files
├── uploads/             # Uploaded files
├── index.js             # Server entry point
├── package.json
├── .env                 # Environment variables
└── README.md
```

## Models

### Member Model
**Location:** `models/Member.js`

```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String (unique),
  phone: String,
  date_of_birth: String,
  membership_type: String (enum: "basic", "premium", "vip", "student"),
  membership_start_date: String,
  membership_end_date: String,
  status: String (default: "active", enum: ["active", "expired", "suspended", "cancelled"]),
  emergency_contact_name: String,
  emergency_contact_phone: String,
  medical_conditions: String,
  profile_photo: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Trainer Model
**Location:** `models/Trainer.js`

```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String (unique),
  phone: String,
  specialization: String,
  specializations: [String],
  certifications: String,
  status: String (default: "active"),
  availability: String (default: "Full Day"),
  hire_date: Date,
  hourly_rate: Number,
  bio: String,
  profile_photo: String,
  certificate_files: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Equipment Model
**Location:** `models/Equipment.js`

```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  quantity: Number,
  condition: String,
  purchaseDate: Date,
  image_path: String,
  maintenanceDue: Date,
  lastMaintenance: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Routes

### Members Routes
**Location:** `routes/members.js`

- `GET /api/members` - Get all members (with search & filter)
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Trainers Routes
**Location:** `routes/trainers.js`

- `GET /api/trainers` - Get all trainers (with search)
- `GET /api/trainers/:id` - Get trainer by ID
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer

### Equipment Routes
**Location:** `routes/equipment.js`

- `GET /api/equipment` - Get all equipment (with search & filter)
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Create new equipment (with image upload)
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `DELETE /api/equipment/:id/remove-image` - Remove equipment image

### Uploads Routes
**Location:** `routes/uploads.js`

- `POST /api/uploads` - Upload files

## Server Setup

**Location:** `index.js`

```javascript
// Main server file
// - Initializes Express app
// - Connects to MongoDB
// - Sets up middleware (CORS, body-parser, static files)
// - Registers all routes
// - Starts server on port 5000
```

## Configuration

### Environment Variables
Create `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/gms
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Database Connection

MongoDB should be running before starting the backend:

```bash
# Windows
mongod.exe

# macOS
mongod

# Linux
mongod
```

## Starting the Server

```bash
cd backend
npm install
npm start
```

Server runs on: `http://127.0.0.1:5000`

## Testing Endpoints

Use cURL, Postman, or VS Code REST Client to test endpoints. See [API.md](API.md) for examples.

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### CORS Errors
- Verify `CORS_ORIGIN` matches your frontend URL
- Check if frontend and backend ports are correct

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `netstat -ano | findstr :5000` (Windows)

## Future Improvements

- [ ] Refactor routes into controllers
- [ ] Add authentication middleware
- [ ] Add input validation middleware
- [ ] Add error handling middleware
- [ ] Add logging
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger)
- [ ] Add tests (Jest, Supertest)
- [ ] Add JWT authentication
- [ ] Add role-based access control

---

**Last Updated**: January 2, 2026
