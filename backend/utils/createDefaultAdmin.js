const User = require("../model/User");
const bcrypt = require("bcryptjs");

const createDefaultAdmin = async () => {
    try {
        // ==========================================
        // DEFAULT ADMIN CREDENTIALS
        // ==========================================

        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        // ==========================================
        // CHECK ENVIRONMENT VARIABLES
        // ==========================================

        if (!adminEmail || !adminPassword) {
            console.log("⚠️ DEFAULT ADMIN NOT CREATED");
            console.log(
                "Please add DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD to .env"
            );
            return;
        }

        const cleanEmail = adminEmail
            .toLowerCase()
            .trim();

        // ==========================================
        // CHECK IF ADMIN ALREADY EXISTS
        // ==========================================

        const existingAdmin = await User.findOne({
            email: cleanEmail
        });

        if (existingAdmin) {

            // If email exists but belongs to employee,
            // don't overwrite that account.
            if (existingAdmin.role !== "admin") {
                console.log(
                    `⚠️ ${cleanEmail} already exists but is not an admin.`
                );
                return;
            }

            console.log(
                `✅ Default admin already exists: ${cleanEmail}`
            );

            return;
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        // ==========================================
        // CREATE DEFAULT ADMIN
        // ==========================================

        const admin = await User.create({
            fullName: "System Administrator",
            email: cleanEmail,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            isEmailVerified: true
        });

        console.log("=================================");
        console.log("✅ DEFAULT ADMIN CREATED");
        console.log(`📧 Email: ${admin.email}`);
        console.log("🔐 Password: Loaded from .env");
        console.log("👑 Role: admin");
        console.log("=================================");

    } catch (error) {

        console.error(
            "❌ Default Admin Creation Error:",
            error.message
        );

    }
};

module.exports = createDefaultAdmin;