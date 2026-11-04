
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        source: {
            type: String,
            enum: ["Website", "Referral", "Social Media", "Advertisement", "Other"],
            default: "Other"
        },
        status: {
            type: String,
            enum: ["New", "Contacted", "Converted"],
            default: "New"
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
