import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import connectDB from "./lib/db.js";

// Load environment variables from .env file
dotenv.config();

const __dirname = path.resolve(); // Get the current directory path
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from the client URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json()); // Parse JSON bodies

app.use(clerkMiddleware()); // Middleware to handle Clerk authentication so we can fetch user data => req.auth.userId
// This middleware will automatically attach the user object to the request if authenticated

app.use(
  fileUpload({
    useTempFiles: true, // Store uploaded files in a temporary directory
    tempFileDir: path.join(__dirname, "tmp"), // Directory to store temporary files
    createParentPath: true, // Create parent directories if they don't exist
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  })
); // Middleware to handle file uploads

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    success: false,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

// TODO: socket.io integration for real-time features
