
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find admin and explicitly include the password hash
        const admin = await Admin.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Verify password against its bcrypt hash
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured.");

            return res.status(500).json({
                success: false,
                message: "Authentication is not configured."
            });
        }

        // Generate a signed JWT
        const token = jwt.sign(
            {
                sub: admin._id.toString(),
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
                issuer: "leadflow-api",
                audience: "leadflow-client"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Admin login failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to log in right now."
        });
    }
});

module.exports = router;
