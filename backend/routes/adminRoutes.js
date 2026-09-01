const express = require("express");

const router = express.Router();

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const {
    getAdminDashboard
} = require("../controllers/dashboardController");


router.get(
    "/dashboard",
    protect,
    adminOnly,
    getAdminDashboard
);


module.exports = router;