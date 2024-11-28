/** @format */

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Set upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Multer instance for handling logo and image uploads
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
    }
  },
}).fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]); // Define fields for logo and image uploads

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

      // Extract file paths from Multer
      const logoPath = req.files?.logo ? req.files.logo[0].path : null;
      const imagePath = req.files?.image ? req.files.image[0].path : null;

      // Encrypt the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

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
    res.status(200).json(users);
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

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
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
      const logoPath = req.files?.logo ? req.files.logo[0].path : null;
      const imagePath = req.files?.image ? req.files.image[0].path : null;

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

      const updatedData = {
        companyName,
        contactPerson,
        email,
        mobileNo,
        logoUrl: logoPath || user.logoUrl, // Preserve old if no new file
        dashboardUrl1,
        dashboardUrl2,
        dashboardUrl3,
        organizationMission,
        organizationSupport,
        image: imagePath || user.image, // Preserve old if no new file
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, 10); // Encrypt new password
      }

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

    // Remove associated files
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
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

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
