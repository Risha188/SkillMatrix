const jwt = require("jsonwebtoken");

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const protect = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "Authentication Error:",
            error.message
        );

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Your session has expired. Please login again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid authentication token."
        });
    }
};


// ==========================================
// ADMIN MIDDLEWARE
// ==========================================

const adminOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required."
        });
    }

    next();
};


// ==========================================
// EMPLOYEE MIDDLEWARE
// ==========================================

const employeeOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "employee") {
        return res.status(403).json({
            success: false,
            message: "Employee access required."
        });
    }

    next();
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    protect,
    adminOnly,
    employeeOnly
};