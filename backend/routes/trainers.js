import express from "express";
import Trainer from "../models/Trainer.js";
import { validateTrainer } from "../middleware/validation.js";

const router = express.Router();

// GET /api/trainers
router.get("/", async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trainers/:id
router.get("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/trainers
router.post("/", validateTrainer, async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json(trainer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/trainers/:id
router.put("/:id", validateTrainer, async (req, res) => {
  try {
    console.log('📥 Updating trainer:', req.params.id);
    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📥 Certificate files:', req.body.certificate_files);
    
    // Ensure specialization is set if specializations array exists
    const updateData = { ...req.body };
    
    // Handle specialization - prefer from specializations array if available
    if (Array.isArray(updateData.specializations) && updateData.specializations.length > 0) {
      if (!updateData.specialization || updateData.specialization.trim() === "") {
        updateData.specialization = updateData.specializations[0];
      }
    } else if (!updateData.specialization || updateData.specialization.trim() === "") {
      // If no specialization provided, try to get from existing trainer
      const existingTrainer = await Trainer.findById(req.params.id);
      if (existingTrainer && existingTrainer.specialization) {
        updateData.specialization = existingTrainer.specialization;
      } else if (existingTrainer && Array.isArray(existingTrainer.specializations) && existingTrainer.specializations.length > 0) {
        updateData.specialization = existingTrainer.specializations[0];
      } else {
        updateData.specialization = 'General Training';
      }
    }
    
    // Clean up data - remove undefined/null values that might cause issues
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });
    
    console.log('📥 Processed update data:', JSON.stringify(updateData, null, 2));
    
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    
    console.log('✅ Trainer updated successfully');
    console.log('✅ Updated certificate_files:', trainer.certificate_files);
    
    res.json(trainer);
  } catch (err) {
    console.error('❌ Trainer update error:', err);
    console.error('❌ Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      keyPattern: err.keyPattern,
      keyValue: err.keyValue
    });
    
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: `Email ${err.keyValue?.email || 'already exists'}`,
        errors: [`Email already exists`]
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation failed",
        errors: validationErrors
      });
    }
    
    res.status(400).json({ 
      error: err.message || "Failed to update trainer",
      errors: [err.message || "Failed to update trainer"]
    });
  }
});

// DELETE /api/trainers/:id
router.delete("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.json({ message: "Trainer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;