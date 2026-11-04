const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const createAdmin = async () => {
    try {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI } =
            process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGODB_URI) {
            throw new Error(
                "Please configure ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD and MONGODB_URI in .env"
            );
        }

        if (ADMIN_PASSWORD.length < 8) {
            throw new Error("Admin password must be at least 8 characters.");
        }

        await mongoose.connect(MONGODB_URI);

        const email = ADMIN_EMAIL.trim().toLowerCase();

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("An admin account with this email already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        await Admin.create({
            name: ADMIN_NAME.trim(),
            email,
            password: hashedPassword
        });

        console.log("Admin account created successfully.");
        console.log(`Admin email: ${email}`);
    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createAdmin();
