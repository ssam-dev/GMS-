import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import membersRouter from "./routes/members.js";
import trainersRouter from "./routes/trainers.js";
import equipmentRouter from "./routes/equipment.js";
import uploadsRouter from "./routes/uploads.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware - configure Helmet to allow images to be loaded
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
  : ["http://localhost:3000"];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Higher limit in development
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/api/health";
  }
});
app.use("/api/", limiter);

// Logging
app.use(morgan("combined"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Debug middleware - log request metadata for POST/PUT requests (sensitive fields masked)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
      const sensitiveKeys = ['password', 'token', 'access_token', 'authorization', 'email', 'ssn', 'credit_card'];
      // Deep clone to avoid mutating original req.body
      const maskedBody = JSON.parse(JSON.stringify(req.body));
      
      // Recursively mask sensitive fields, including arrays
      const maskObject = (obj) => {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            if (item && typeof item === 'object') {
              maskObject(item);
            }
          });
        } else if (obj && typeof obj === 'object') {
          for (const key in obj) {
            if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
              obj[key] = '***REDACTED***';
            } else if (obj[key] && typeof obj[key] === 'object') {
              maskObject(obj[key]);
            }
          }
        }
      };
      maskObject(maskedBody);
      
      console.log(`📥 ${req.method} ${req.path}`);
      console.log('Content-Type:', req.get('content-type'));
      console.log('Content-Length:', req.get('content-length'));
      console.log('Request body (masked):', JSON.stringify(maskedBody, null, 2));
    }
    next();
  });
}

// Create uploads directory structure if it doesn't exist
const uploadsPath = path.join(__dirname, "../uploads");
const equipmentPath = path.join(uploadsPath, "equipment");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(equipmentPath)) {
  fs.mkdirSync(equipmentPath, { recursive: true });
}

// Serve static files for uploads with proper MIME types
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
  setHeaders: (res, path) => {
    // Set proper content-type for images
    if (path.endsWith('.png')) res.set('Content-Type', 'image/png');
    else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) res.set('Content-Type', 'image/jpeg');
    else if (path.endsWith('.webp')) res.set('Content-Type', 'image/webp');
    else if (path.endsWith('.gif')) res.set('Content-Type', 'image/gif');
    else if (path.endsWith('.pdf')) res.set('Content-Type', 'application/pdf');
  }
}));

// Root endpoint - simple, no dependencies
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "GMS API is running",
    status: "healthy",
    documentation: "/api/docs"
  });
});

// Swagger API Documentation
try {
  app.get("/api/docs/swagger.json", (req, res) => {
    res.json(swaggerSpec);
  });
  
  app.use("/api/docs", swaggerUi.serve);
  app.get("/api/docs/", swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: "/api/docs/swagger.json",
    }
  }));
} catch (err) {
  console.warn("Swagger setup warning:", err.message);
}

// API Routes
app.use("/api/members", membersRouter);
app.use("/api/trainers", trainersRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/upload", uploadsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "GMS API is running",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: "Validation failed",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: "Invalid ID format"
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate entry",
      field: Object.keys(err.keyPattern || {})[0]
    });
  }
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Start server regardless of MongoDB connection
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});

// Prevent server from closing
server.keepAliveTimeout = 65000;
server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

// Connect to MongoDB but don't block server startup
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      if (process.env.NODE_ENV === "production") {
        console.error("⚠️  Server will continue but database operations will fail");
      }
    });
  
  // Handle MongoDB connection events
  mongoose.connection.on('disconnected', () => {
    console.warn("⚠️  MongoDB disconnected");
  });
  
  mongoose.connection.on('error', (err) => {
    console.error("❌ MongoDB error:", err.message);
  });
  
  mongoose.connection.on('reconnected', () => {
    console.log("✅ MongoDB reconnected");
  });
} else {
  console.warn("⚠️  MONGODB_URI not configured - database features will not work");
}
