const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const requestController = require("../controllers/request.controller");

// Multer setup with custom storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set destination folder for file uploads
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Use original filename with a timestamp to avoid duplicates
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); // Get file extension
    const name = path.basename(file.originalname, ext); // Get file name without extension
    cb(null, `${name}-${timestamp}${ext}`); // Save file as originalName-timestamp.extension
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Optional: Validate file types (e.g., images and PDFs only)
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
});

// Define routes
router.post("/", upload.single("attachment"), requestController.createRequest); // Create request
router.get("/", requestController.getAllRequests); // Get all requests
router.get("/user/:userId", requestController.getRequestsByUser); // Get requests by user
router.get("/:id", requestController.getRequestById); // Get request by ID
router.put(
  "/:id",
  upload.single("attachment"),
  requestController.updateRequest
); // Update request
router.delete("/:id", requestController.deleteRequest); // Delete request

module.exports = router;
