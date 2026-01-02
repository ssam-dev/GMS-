# GMS API Documentation

## Base URL
```
http://127.0.0.1:5000
```

## Response Format
All endpoints return JSON responses with appropriate HTTP status codes.

---

## Members API

### Get All Members
```
GET /api/members
```

**Query Parameters:**
- `q` (optional): Search query for member name
- `membershipType` (optional): Filter by membership type

**Response:**
```json
[
  {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "membershipType": "Gold",
    "membershipStart": "2024-01-01",
    "membershipEnd": "2025-01-01",
    "status": "active"
  }
]
```

### Get Member by ID
```
GET /api/members/:id
```

**Response:** Single member object

### Create Member
```
POST /api/members
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "membershipType": "Gold",
  "membershipStart": "2024-01-01",
  "membershipEnd": "2025-01-01"
}
```

### Update Member
```
PUT /api/members/:id
Content-Type: application/json
```

### Delete Member
```
DELETE /api/members/:id
```

---

## Trainers API

### Get All Trainers
```
GET /api/trainers
```

**Query Parameters:**
- `q` (optional): Search query for trainer name

**Response:**
```json
[
  {
    "id": "456",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "specialization": "CrossFit",
    "certifications": "ACE, NASM",
    "status": "active"
  }
]
```

### Get Trainer by ID
```
GET /api/trainers/:id
```

### Create Trainer
```
POST /api/trainers
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "specialization": "CrossFit",
  "certifications": "ACE, NASM"
}
```

### Update Trainer
```
PUT /api/trainers/:id
```

### Delete Trainer
```
DELETE /api/trainers/:id
```

---

## Equipment API

### Get All Equipment
```
GET /api/equipment
```

**Query Parameters:**
- `q` (optional): Search query
- `category` (optional): Filter by category

**Response:**
```json
[
  {
    "id": "789",
    "name": "Treadmill",
    "category": "Cardio",
    "quantity": 5,
    "condition": "good",
    "purchaseDate": "2023-01-15",
    "image_path": "/uploads/equipment/treadmill.jpg",
    "maintenanceDue": "2025-02-01"
  }
]
```

### Get Equipment by ID
```
GET /api/equipment/:id
```

### Create Equipment
```
POST /api/equipment
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Equipment name
- `category` (required): Equipment category
- `quantity` (required): Quantity
- `condition` (optional): Condition status
- `purchaseDate` (optional): Purchase date
- `maintenanceDue` (optional): Maintenance due date
- `image` (optional): Image file

### Update Equipment
```
PUT /api/equipment/:id
Content-Type: multipart/form-data
```

### Remove Equipment Image
```
DELETE /api/equipment/:id/remove-image
```

**Response:**
```json
{
  "message": "Image removed successfully",
  "equipment": { ... }
}
```

### Delete Equipment
```
DELETE /api/equipment/:id
```

---

## File Upload API

### Upload Files
```
POST /api/uploads
Content-Type: multipart/form-data
```

**Form Data:**
- `files` (required): File(s) to upload

**Response:**
```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "fieldname": "files",
      "originalname": "image.jpg",
      "filename": "image-12345.jpg",
      "path": "/uploads/equipment/image-12345.jpg"
    }
  ]
}
```

---

## Authentication

### Login (Email/Password)
```
POST /api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@gym.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-123",
    "email": "admin@gym.com",
    "name": "Admin User"
  }
}
```

### Google OAuth Login
See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for Google OAuth integration details.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

### 503 Service Unavailable
```json
{
  "error": "Database unavailable"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable

---

## Examples using cURL

### Get all members
```bash
curl http://127.0.0.1:5000/api/members
```

### Search members
```bash
curl "http://127.0.0.1:5000/api/members?q=John&membershipType=Gold"
```

### Create new member
```bash
curl -X POST http://127.0.0.1:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "membershipType": "Gold"
  }'
```

### Upload equipment image
```bash
curl -X POST http://127.0.0.1:5000/api/uploads \
  -F "files=@image.jpg"
```

---

**Last Updated**: January 2, 2026
