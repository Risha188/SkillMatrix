const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const createDefaultAdmin = require("./utils/createDefaultAdmin");

const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const {
    protect,
    adminOnly,
    employeeOnly
} = require("./middleware/authMiddleware");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// HOME / TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Skill Matrix Backend is running"
    });

});


// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================
// ADMIN ROUTES
// ==========================================

app.use(
    "/api/admin",
    adminRoutes
);


// ==========================================
// EMPLOYEE ROUTES
// ==========================================

app.use(
    "/api/employees",
    employeeRoutes
);


// ==========================================
// JWT ADMIN TEST
// ==========================================

app.get(
    "/api/auth/admin-test",
    protect,
    adminOnly,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Admin access granted",
            user: req.user
        });

    }
);


// ==========================================
// JWT EMPLOYEE TEST
// ==========================================

app.get(
    "/api/auth/employee-test",
    protect,
    employeeOnly,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Employee access granted",
            user: req.user
        });

    }
);


// ==========================================
// JWT PROTECTED TEST
// ==========================================

app.get(
    "/api/auth/protected-test",
    protect,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "JWT authentication is working",
            user: req.user
        });

    }
);


// ==========================================
// AUTH TEST
// ==========================================

app.get(
    "/api/auth/test",
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Auth route is working"
        });

    }
);


// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;


// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {

    try {

        // ======================================
        // CONNECT DATABASE
        // ======================================

        await connectDB();

        console.log(
            "✅ MongoDB connected successfully"
        );


        // ======================================
        // CREATE DEFAULT ADMIN
        // ======================================

        await createDefaultAdmin();


        // ======================================
        // START EXPRESS SERVER
        // ======================================

        app.listen(
            PORT,
            () => {

                console.log(
                    "================================="
                );

                console.log(
                    `🚀 Server running on port ${PORT}`
                );

                console.log(
                    "================================="
                );

            }
        );

    } catch (error) {

        console.error(
            "❌ Server startup failed:",
            error
        );

        process.exit(1);
    }
};


// ==========================================
// START APPLICATION
// ==========================================

startServer();