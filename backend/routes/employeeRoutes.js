const express = require("express");

console.log("Employee routes loaded");

// ==========================================
// Employee Controller
// ==========================================

const {
    createEmployee,
    getEmployee,
    updateEducation,
    updateAddress,
    updateSkills,
    updateWorkExperience,
    updateBDMDetails
} = require("../controllers/employeecontroller");

// ==========================================
// Authentication Middleware
// ==========================================

const {
    protect,
    employeeOnly
} = require("../middleware/authMiddleware");


// ==========================================
// CREATE ROUTER
// ==========================================

const router = express.Router();


// ==========================================
// CREATE EMPLOYEE
// POST /api/employees
// ==========================================

router.post(
    "/",
    protect,
    employeeOnly,
    createEmployee
);


// ==========================================
// UPDATE EDUCATION
// PUT /api/employees/:employeeId/education
// ==========================================

router.put(
    "/:employeeId/education",
    protect,
    employeeOnly,
    updateEducation
);


// ==========================================
// UPDATE ADDRESS
// PUT /api/employees/:employeeId/address
// ==========================================

router.put(
    "/:employeeId/address",
    protect,
    employeeOnly,
    updateAddress
);


// ==========================================
// UPDATE SKILLS
// PUT /api/employees/:employeeId/skills
// ==========================================

router.put(
    "/:employeeId/skills",
    protect,
    employeeOnly,
    updateSkills
);


// ==========================================
// UPDATE WORK EXPERIENCE
// PUT /api/employees/:employeeId/work-experience
// ==========================================

router.put(
    "/:employeeId/work-experience",
    protect,
    employeeOnly,
    updateWorkExperience
);


// ==========================================
// UPDATE BDM DETAILS
// PUT /api/employees/:employeeId/bdm
// ==========================================

router.put(
    "/:employeeId/bdm",
    protect,
    employeeOnly,
    updateBDMDetails
);


// ==========================================
// GET EMPLOYEE
// GET /api/employees/:employeeId
// ==========================================

router.get(
    "/:employeeId",
    protect,
    employeeOnly,
    getEmployee
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;