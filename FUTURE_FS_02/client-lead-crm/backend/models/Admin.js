
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Admin name is required"],
            trim: true,
            maxlength: 100
        },

        email: {
            type: String,
            required: [true, "Admin email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Admin password is required"],
            minlength: 8,
            select: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Admin", adminSchema);
