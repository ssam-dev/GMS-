import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import membersRouter from "./routes/members.js";
import trainersRouter from "./routes/trainers.js";
import uploadsRouter from "./routes/uploads.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files as static
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gms";

// Track DB connection status so routes can respond gracefully if DB is down
app.locals.dbConnected = false;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.locals.dbConnected = true;
		console.log("MongoDB connected");
	})
	.catch(err => {
		app.locals.dbConnected = false;
		console.error("MongoDB connection error:", err.message);
	});

// Listen to connection state changes and update app.locals
mongoose.connection.on("connected", () => {
    app.locals.dbConnected = true;
    console.log("MongoDB connected (event)");
});

mongoose.connection.on("disconnected", () => {
    app.locals.dbConnected = false;
    console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
    app.locals.dbConnected = false;
    console.error("MongoDB error:", err.message);
});

app.get("/", (req, res) => res.send("GMS backend running"));

app.use("/api/members", membersRouter);
app.use("/api/trainers", trainersRouter);
app.use("/api/upload", uploadsRouter);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

export default app;
