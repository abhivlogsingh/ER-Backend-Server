const FormData = require("../models/form.model"); // Import the model

// Create a new form record
const createForm = async (req, res) => {
  try {
    const { description, link } = req.body;

    console.log("Request Body:", req.body); // Debugging: Log incoming request body
    console.log("Uploaded File:", req.file); // Debugging: Log uploaded file

    // Validate required fields
    if (!description || !link) {
      return res.status(400).json({ error: "Description and Link are required." });
    }

    // Check if the image was uploaded
    const imagePath = req.file ? `/modelsuploads/${req.file.filename}` : null;
    if (!imagePath) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Insert data into the database
    const formData = await FormData.create({
      description,
      link,
      imagePath,
    });

    console.log("Form Data Saved:", formData); // Debugging: Log the saved form data

    res.status(201).json({ message: "Form submitted successfully!", formData });
  } catch (err) {
    console.error("Error in createForm:", err); // Debugging: Log the error
    res.status(500).json({ error: "Failed to submit form. Please try again later." });
  }
};

// Get all form records
const getAllForms = async (req, res) => {
  try {
    const forms = await FormData.findAll(); // Fetch all records
    console.log("All Forms Fetched:", forms); // Debugging: Log fetched forms
    res.status(200).json(forms);
  } catch (err) {
    console.error("Error in getAllForms:", err); // Debugging: Log the error
    res.status(500).json({ error: "Failed to fetch forms." });
  }
};

// Get a specific form by ID
const getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested Form ID:", id); // Debugging: Log the requested ID

    const form = await FormData.findByPk(id); // Find by primary key
    if (!form) {
      console.log("Form Not Found with ID:", id); // Debugging: Log if form not found
      return res.status(404).json({ error: "Form not found." });
    }

    console.log("Fetched Form Data:", form); // Debugging: Log the fetched form
    res.status(200).json(form);
  } catch (err) {
    console.error("Error in getFormById:", err); // Debugging: Log the error
    res.status(500).json({ error: "Failed to fetch form." });
  }
};

// Update a form by ID
const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, link } = req.body;
    const imagePath = req.file ? `/modelsuploads/${req.file.filename}` : null;

    console.log("Requested Form ID for Update:", id); // Debugging: Log the requested ID
    console.log("Update Data:", req.body, req.file); // Debugging: Log the incoming data

    const form = await FormData.findByPk(id); // Find the form by ID
    if (!form) {
      console.log("Form Not Found for Update with ID:", id); // Debugging: Log if form not found
      return res.status(404).json({ error: "Form not found." });
    }

    // Update fields
    const updatedForm = await form.update({
      description: description || form.description,
      link: link || form.link,
      imagePath: imagePath || form.imagePath,
    });

    console.log("Updated Form Data:", updatedForm); // Debugging: Log the updated form
    res.status(200).json({ message: "Form updated successfully!", form: updatedForm });
  } catch (err) {
    console.error("Error in updateForm:", err); // Debugging: Log the error
    res.status(500).json({ error: "Failed to update form." });
  }
};

// Delete a form by ID
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested Form ID for Deletion:", id); // Debugging: Log the requested ID

    const form = await FormData.findByPk(id);
    if (!form) {
      console.log("Form Not Found for Deletion with ID:", id); // Debugging: Log if form not found
      return res.status(404).json({ error: "Form not found." });
    }

    await form.destroy(); // Delete the record
    console.log("Form Deleted with ID:", id); // Debugging: Log the deletion
    res.status(200).json({ message: "Form deleted successfully!" });
  } catch (err) {
    console.error("Error in deleteForm:", err); // Debugging: Log the error
    res.status(500).json({ error: "Failed to delete form." });
  }
};

module.exports = {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
};
