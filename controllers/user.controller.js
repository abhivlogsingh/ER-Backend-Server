/** @format */

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  // Define the directory where the files will be uploaded
  destination: (req, file, cb) => {
    const uploadDir = path.join("profilelogouploads"); // Relative path
    cb(null, uploadDir); // Upload files to 'profilelogouploads' directory
  },
  filename: (req, file, cb) => {
    // Create a unique file name by appending a random number and current timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Multer instance for handling logo and image uploads
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed.")); // Reject the file if not valid
    }
  },
}).fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]); // Define the fields for logo and image uploads

// Create a new user
const createUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        companyName,
        contactPerson,
        email,
        mobileNo,
        password,
        dashboardUrl1,
        dashboardUrl2,
        dashboardUrl3,
        role,
        organizationMission,
        organizationSupport,
      } = req.body;

      // Check if password is provided
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      // Extract file paths from Multer
      const logoPath = req.files?.logo ? `profilelogouploads/${req.files.logo[0].filename}` : null;
      const imagePath = req.files?.image ? `profilelogouploads/${req.files.image[0].filename}` : null;

      // Encrypt the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

      // Create the user in the database
      const user = await User.create({
        companyName,
        contactPerson,
        email,
        mobileNo,
        password: hashedPassword, // Store hashed password
        role: role || "2", // Default role to '2' (User)
        logoUrl: logoPath || "",
        dashboardUrl1: dashboardUrl1 || "",
        dashboardUrl2: dashboardUrl2 || "",
        dashboardUrl3: dashboardUrl3 || "",
        organizationMission: organizationMission || "",
        organizationSupport: organizationSupport || "",
        image: imagePath || "",
      });

      res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users); // Return all users
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user); // Return the user by ID
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      // Handle any errors that occur during the file upload
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const {
        companyName,
        contactPerson,
        email,
        mobileNo,
        password,
        dashboardUrl1,
        dashboardUrl2,
        dashboardUrl3,
        organizationMission,
        organizationSupport,
      } = req.body;

      // Extract file paths from Multer
      const logoPath = req.files?.logo ? `profilelogouploads/${req.files.logo[0].filename}` : null;
      const imagePath = req.files?.image ? `profilelogouploads/${req.files.image[0].filename}` : null;

      // Find the existing user
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove old files if new ones are uploaded
      if (logoPath && user.logoUrl) {
        fs.unlink(path.join(__dirname, "../", user.logoUrl), (err) => {
          if (err) console.error("Failed to delete old logo file:", err);
        });
      }
      if (imagePath && user.image) {
        fs.unlink(path.join(__dirname, "../", user.image), (err) => {
          if (err) console.error("Failed to delete old image file:", err);
        });
      }

      // Prepare the updated data
      const updatedData = {
        companyName,
        contactPerson,
        email,
        mobileNo,
        logoUrl: logoPath || user.logoUrl, // Preserve old logo if no new file is uploaded
        dashboardUrl1,
        dashboardUrl2,
        dashboardUrl3,
        organizationMission,
        organizationSupport,
        image: imagePath || user.image, // Preserve old image if no new file is uploaded
      };

      // If password is provided, hash the new password and update it
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10); // Encrypt new password
      }

      // Update the user with the new data
      await user.update(updatedData);

      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove associated files before deleting the user
    if (user.logoUrl) {
      fs.unlink(path.join(__dirname, "../", user.logoUrl), (err) => {
        if (err) console.error("Failed to delete logo file:", err);
      });
    }
    if (user.image) {
      fs.unlink(path.join(__dirname, "../", user.image), (err) => {
        if (err) console.error("Failed to delete image file:", err);
      });
    }

    // Delete the user
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare old password with stored hashed password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  resetPassword,
};
