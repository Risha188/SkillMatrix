const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ==============================
        // BASIC USER INFORMATION
        // ==============================

        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // ==============================
        // PASSWORD
        // ==============================

        // Password will be added after
        // email verification.
        password: {
            type: String,
            required: false
        },

        // ==============================
        // ROLE
        // ==============================

        role: {
            type: String,
            enum: ["employee", "admin"],
            default: "employee"
        },

        // ==============================
        // ACCOUNT STATUS
        // ==============================

        isActive: {
            type: Boolean,
            default: true
        },

        // ==============================
        // EMAIL VERIFICATION
        // ==============================

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        verificationCode: {
            type: String,
            default: null
        },

        verificationCodeExpires: {
            type: Date,
            default: null
        },

        // ==============================
        // PASSWORD RESET
        // ==============================

        resetPasswordCode: {
            type: String,
            default: null
        },

        resetPasswordExpires: {
            type: Date,
            default: null
        },

        resetPasswordVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);