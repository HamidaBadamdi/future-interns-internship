
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");


const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const router = express.Router();

router.use(authMiddleware);

// GET: Retrieve all leads
router.get("/", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Leads retrieved successfully",
            count: leads.length,
            data: leads
        });
    } catch (error) {
        console.error("Get leads error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve leads"
        });
    }
});

// POST: Create a new lead
router.post("/", async (req, res) => {
    try {
        const lead = await Lead.create(req.body);

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            data: lead
        });
    } catch (error) {
        console.error("Create lead error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Lead validation failed",
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create lead"
        });
    }
});

// GET: Retrieve one lead by ID
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lead retrieved successfully",
            data: lead
        });
    } catch (error) {
        console.error("Get lead error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve lead"
        });
    }
});

// PUT: Update a lead
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            data: lead
        });
    } catch (error) {
        console.error("Update lead error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Lead validation failed",
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update lead"
        });
    }
});

// DELETE: Delete a lead
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead ID"
            });
        }

        const lead = await Lead.findByIdAndDelete(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
            data: lead
        });
    } catch (error) {
        console.error("Delete lead error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to delete lead"
        });
    }
});

module.exports = router;
