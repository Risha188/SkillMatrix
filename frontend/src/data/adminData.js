// src/data/adminData.js

// =========================================================
// ADMIN STORAGE KEYS
// =========================================================

// Persistent admin records.
// This can remain in localStorage because the admin list
// should survive browser refresh/restart.
export const ADMIN_STORAGE_KEY =
    "skillmatrix_admins";

// Current logged-in admin.
// IMPORTANT: This is session-specific, so use sessionStorage.
export const CURRENT_ADMIN_STORAGE_KEY =
    "skillmatrix_current_admin";


// =========================================================
// ADMIN PERMISSIONS
// =========================================================

export const ADMIN_PERMISSIONS = {
    DASHBOARD: "dashboard",
    EMPLOYEES: "employees",
    PROJECTS: "projects",
};


// =========================================================
// PERMISSION LABELS
// =========================================================

export const ADMIN_PERMISSION_LABELS = {
    [ADMIN_PERMISSIONS.DASHBOARD]:
        "Dashboard",

    [ADMIN_PERMISSIONS.EMPLOYEES]:
        "Employees",

    [ADMIN_PERMISSIONS.PROJECTS]:
        "Projects",
};


// =========================================================
// DEFAULT / SYSTEM ADMIN
// =========================================================

export const DEFAULT_ADMIN = {
    id: "ADMIN001",

    name: "System Administrator",

    email: "admin@skillmatrix.com",

    password: "admin123",

    role: "admin",

    isDefault: true,

    isApproved: true,

    isActive: true,

    status: "Active",

    approvedBy: null,

    approvedAt: null,

    permissions: Object.values(
        ADMIN_PERMISSIONS
    ),

    createdAt: new Date().toISOString(),
};


// =========================================================
// INITIALIZE ADMINS
// =========================================================

export const initializeAdmins = () => {
    try {
        const storedAdmins =
            localStorage.getItem(
                ADMIN_STORAGE_KEY
            );

        // -------------------------------------------------
        // EXISTING ADMINS
        // -------------------------------------------------

        if (storedAdmins) {
            const parsedAdmins =
                JSON.parse(storedAdmins);

            if (
                Array.isArray(parsedAdmins) &&
                parsedAdmins.length > 0
            ) {
                return parsedAdmins;
            }
        }


        // -------------------------------------------------
        // CREATE DEFAULT ADMIN
        // -------------------------------------------------

        const initialAdmins = [
            DEFAULT_ADMIN,
        ];

        localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify(initialAdmins)
        );

        return initialAdmins;

    } catch (error) {

        console.error(
            "Failed to initialize admins:",
            error
        );

        return [
            DEFAULT_ADMIN,
        ];
    }
};


// =========================================================
// GET CURRENT ADMIN
// =========================================================

export const getCurrentAdmin = () => {
    try {
        const storedAdmin =
            sessionStorage.getItem(
                CURRENT_ADMIN_STORAGE_KEY
            );

        if (!storedAdmin) {
            return null;
        }

        return JSON.parse(storedAdmin);

    } catch (error) {

        console.error(
            "Failed to get current admin:",
            error
        );

        return null;
    }
};


// =========================================================
// SET CURRENT ADMIN
// =========================================================

export const setCurrentAdmin = (admin) => {
    try {
        if (!admin) {
            return false;
        }

        sessionStorage.setItem(
            CURRENT_ADMIN_STORAGE_KEY,
            JSON.stringify(admin)
        );

        return true;

    } catch (error) {

        console.error(
            "Failed to save current admin:",
            error
        );

        return false;
    }
};


// =========================================================
// CLEAR CURRENT ADMIN
// =========================================================

export const clearCurrentAdmin = () => {
    try {
        sessionStorage.removeItem(
            CURRENT_ADMIN_STORAGE_KEY
        );

        return true;

    } catch (error) {

        console.error(
            "Failed to clear current admin:",
            error
        );

        return false;
    }
};


// =========================================================
// GET ALL ADMINS
// =========================================================

export const getAdmins = () => {
    try {
        const storedAdmins =
            localStorage.getItem(
                ADMIN_STORAGE_KEY
            );

        if (!storedAdmins) {
            return initializeAdmins();
        }

        const admins =
            JSON.parse(storedAdmins);

        if (!Array.isArray(admins)) {
            return initializeAdmins();
        }

        return admins;

    } catch (error) {

        console.error(
            "Failed to get admins:",
            error
        );

        return [];
    }
};


// =========================================================
// SAVE ADMINS
// =========================================================

export const saveAdmins = (admins) => {
    try {
        if (!Array.isArray(admins)) {
            console.error(
                "saveAdmins expects an array."
            );

            return false;
        }

        localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify(admins)
        );

        return true;

    } catch (error) {

        console.error(
            "Failed to save admins:",
            error
        );

        return false;
    }
};