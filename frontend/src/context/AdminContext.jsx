// src/context/AdminContext.jsx

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    ADMIN_STORAGE_KEY,
    CURRENT_ADMIN_STORAGE_KEY,
    ADMIN_PERMISSIONS,
    initializeAdmins,
} from "../data/adminData";


// =========================================================
// CONTEXT
// =========================================================

const AdminContext = createContext(null);


// =========================================================
// ADMIN SESSION KEYS
// =========================================================

const ADMIN_SESSION_TOKEN_KEY = "adminToken";
const ADMIN_USER_KEY = "adminUser";
const ADMIN_USER_ID_KEY = "adminUserId";
const ADMIN_USER_EMAIL_KEY = "adminUserEmail";
const ADMIN_USER_ROLE_KEY = "adminUserRole";
const ADMIN_AUTHENTICATED_KEY = "adminAuthenticated";


// =========================================================
// PROVIDER
// =========================================================

export const AdminProvider = ({ children }) => {

    const [admins, setAdmins] = useState([]);

    const [currentAdmin, setCurrentAdmin] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // INITIALIZE ADMINS
    // =====================================================

    useEffect(() => {

        try {

            const initializedAdmins =
                initializeAdmins();

            setAdmins(initializedAdmins);


            // ---------------------------------------------
            // RESTORE ADMIN SESSION
            // ---------------------------------------------

            const storedCurrentAdmin =
                sessionStorage.getItem(
                    CURRENT_ADMIN_STORAGE_KEY
                );


            if (storedCurrentAdmin) {

                try {

                    const parsedAdmin =
                        JSON.parse(
                            storedCurrentAdmin
                        );


                    const latestAdmin =
                        initializedAdmins.find(
                            (admin) =>
                                admin.id ===
                                parsedAdmin.id
                        );


                    if (
                        latestAdmin &&
                        (
                            latestAdmin.isDefault ||
                            (
                                latestAdmin.isApproved === true &&
                                latestAdmin.isActive === true
                            )
                        )
                    ) {

                        setCurrentAdmin(
                            latestAdmin
                        );

                        // Restore admin session information
                        sessionStorage.setItem(
                            ADMIN_USER_KEY,
                            JSON.stringify(
                                latestAdmin
                            )
                        );

                        sessionStorage.setItem(
                            ADMIN_USER_ID_KEY,
                            String(
                                latestAdmin.id
                            )
                        );

                        sessionStorage.setItem(
                            ADMIN_USER_EMAIL_KEY,
                            latestAdmin.email
                        );

                        sessionStorage.setItem(
                            ADMIN_USER_ROLE_KEY,
                            "admin"
                        );

                        sessionStorage.setItem(
                            ADMIN_AUTHENTICATED_KEY,
                            "true"
                        );

                    } else {

                        clearAdminSession();
                    }

                } catch (error) {

                    console.error(
                        "Failed to restore admin session:",
                        error
                    );

                    clearAdminSession();
                }
            }


            // ---------------------------------------------
            // REMOVE OLD LOCALSTORAGE ADMIN SESSION
            // ---------------------------------------------

            localStorage.removeItem(
                CURRENT_ADMIN_STORAGE_KEY
            );

            localStorage.removeItem(
                ADMIN_SESSION_TOKEN_KEY
            );

        } catch (error) {

            console.error(
                "Failed to initialize admin context:",
                error
            );

        } finally {

            setLoading(false);
        }

    }, []);


    // =====================================================
    // CLEAR ADMIN SESSION
    // =====================================================

    const clearAdminSession = () => {

        sessionStorage.removeItem(
            CURRENT_ADMIN_STORAGE_KEY
        );

        sessionStorage.removeItem(
            ADMIN_SESSION_TOKEN_KEY
        );

        sessionStorage.removeItem(
            ADMIN_USER_KEY
        );

        sessionStorage.removeItem(
            ADMIN_USER_ID_KEY
        );

        sessionStorage.removeItem(
            ADMIN_USER_EMAIL_KEY
        );

        sessionStorage.removeItem(
            ADMIN_USER_ROLE_KEY
        );

        sessionStorage.removeItem(
            ADMIN_AUTHENTICATED_KEY
        );
    };


    // =====================================================
    // SAVE ADMINS
    // =====================================================

    const saveAdmins = (updatedAdmins) => {

        setAdmins(updatedAdmins);

        localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify(
                updatedAdmins
            )
        );
    };


    // =====================================================
    // SAVE ADMIN SESSION
    // =====================================================

    const saveAdminSession = (admin) => {

        if (!admin) {
            return;
        }


        sessionStorage.setItem(
            CURRENT_ADMIN_STORAGE_KEY,
            JSON.stringify(admin)
        );

        sessionStorage.setItem(
            ADMIN_USER_KEY,
            JSON.stringify(admin)
        );

        sessionStorage.setItem(
            ADMIN_USER_ID_KEY,
            String(admin.id)
        );

        sessionStorage.setItem(
            ADMIN_USER_EMAIL_KEY,
            admin.email
        );

        sessionStorage.setItem(
            ADMIN_USER_ROLE_KEY,
            "admin"
        );

        sessionStorage.setItem(
            ADMIN_AUTHENTICATED_KEY,
            "true"
        );
    };


    // =====================================================
    // REGISTER SECONDARY ADMIN
    // =====================================================

    const registerAdmin = ({
        name,
        email,
        password,
    }) => {

        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();


        const normalizedName =
            String(name || "")
                .trim();


        if (!normalizedName) {

            return {
                success: false,
                message:
                    "Administrator name is required.",
            };
        }


        if (!normalizedEmail) {

            return {
                success: false,
                message:
                    "Administrator email is required.",
            };
        }


        if (!password) {

            return {
                success: false,
                message:
                    "Administrator password is required.",
            };
        }


        // ---------------------------------------------
        // CHECK EXISTING EMAIL
        // ---------------------------------------------

        const existingAdmin =
            admins.find(
                (admin) =>
                    String(admin.email || "")
                        .trim()
                        .toLowerCase() ===
                    normalizedEmail
            );


        if (existingAdmin) {

            return {
                success: false,
                message:
                    "An administrator with this email already exists.",
            };
        }


        // ---------------------------------------------
        // ONLY ONE SECONDARY ADMIN
        // ---------------------------------------------

        const secondaryAdminExists =
            admins.some(
                (admin) =>
                    !admin.isDefault
            );


        if (secondaryAdminExists) {

            return {
                success: false,
                message:
                    "The system already has a secondary administrator account.",
            };
        }


        // ---------------------------------------------
        // CREATE SECONDARY ADMIN
        // ---------------------------------------------

        const newAdmin = {

            id: "ADMIN002",

            name:
                normalizedName,

            email:
                normalizedEmail,

            password,

            role: "admin",

            isDefault: false,

            isApproved: false,

            isActive: false,

            status: "Pending",

            approvedBy: null,

            approvedAt: null,

            permissions: [],

            createdAt:
                new Date().toISOString(),
        };


        const updatedAdmins = [
            ...admins,
            newAdmin,
        ];


        saveAdmins(
            updatedAdmins
        );


        return {

            success: true,

            message:
                "Registration successful. Your administrator account is waiting for approval from the System Administrator.",

            admin:
                newAdmin,
        };
    };


    // =====================================================
    // LOGIN ADMIN
    // =====================================================

    const loginAdmin = ({
        email,
        password,
    }) => {

        const normalizedEmail =
            String(email || "")
                .trim()
                .toLowerCase();


        if (!normalizedEmail || !password) {

            return {
                success: false,
                message:
                    "Email and password are required.",
            };
        }


        // ---------------------------------------------
        // FIND ADMIN
        // ---------------------------------------------

        const admin =
            admins.find(
                (item) =>
                    String(item.email || "")
                        .trim()
                        .toLowerCase() ===
                    normalizedEmail
            );


        if (!admin) {

            return {
                success: false,
                message:
                    "No administrator account was found with this email.",
            };
        }


        // ---------------------------------------------
        // PASSWORD
        // ---------------------------------------------

        if (
            admin.password !==
            password
        ) {

            return {
                success: false,
                message:
                    "Incorrect password.",
            };
        }


        // =================================================
        // SYSTEM ADMIN
        // =================================================

        if (admin.isDefault) {

            const updatedDefaultAdmin = {

                ...admin,

                isApproved: true,

                isActive: true,

                status: "Active",

                permissions:
                    Object.values(
                        ADMIN_PERMISSIONS
                    ),
            };


            // Keep state updated
            setCurrentAdmin(
                updatedDefaultAdmin
            );


            // Save only in sessionStorage
            saveAdminSession(
                updatedDefaultAdmin
            );


            return {

                success: true,

                admin:
                    updatedDefaultAdmin,
            };
        }


        // =================================================
        // SECONDARY ADMIN - PENDING
        // =================================================

        if (!admin.isApproved) {

            return {

                success: false,

                pending: true,

                message:
                    admin.status ===
                    "Rejected"

                        ? "Your administrator request has been rejected by the System Administrator."

                        : admin.status ===
                          "Revoked"

                        ? "Your administrator access has been revoked by the System Administrator."

                        : "Your administrator account is waiting for approval from the System Administrator.",
            };
        }


        // =================================================
        // SECONDARY ADMIN - INACTIVE
        // =================================================

        if (!admin.isActive) {

            return {

                success: false,

                message:
                    "Your administrator account is currently inactive.",
            };
        }


        // =================================================
        // SECONDARY ADMIN - APPROVED
        // =================================================

        setCurrentAdmin(
            admin
        );


        saveAdminSession(
            admin
        );


        return {

            success: true,

            admin,
        };
    };


    // =====================================================
    // LOGOUT ADMIN
    // =====================================================

    const logoutAdmin = () => {

        setCurrentAdmin(null);

        clearAdminSession();


        // Remove old incorrect storage
        localStorage.removeItem(
            CURRENT_ADMIN_STORAGE_KEY
        );

        localStorage.removeItem(
            ADMIN_SESSION_TOKEN_KEY
        );
    };


    // =====================================================
    // APPROVE ADMIN
    // =====================================================

    const approveAdmin = (adminId) => {

        if (!currentAdmin?.isDefault) {

            return {

                success: false,

                message:
                    "Only the System Administrator can approve another administrator.",
            };
        }


        const adminToApprove =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );


        if (!adminToApprove) {

            return {

                success: false,

                message:
                    "Administrator not found.",
            };
        }


        if (adminToApprove.isDefault) {

            return {

                success: false,

                message:
                    "The System Administrator does not require approval.",
            };
        }


        // ---------------------------------------------
        // ONLY ONE ACTIVE SECONDARY ADMIN
        // ---------------------------------------------

        const anotherActiveAdmin =
            admins.some(
                (admin) =>
                    !admin.isDefault &&
                    admin.id !== adminId &&
                    admin.isApproved === true &&
                    admin.isActive === true
            );


        if (anotherActiveAdmin) {

            return {

                success: false,

                message:
                    "There is already an active secondary administrator.",
            };
        }


        // ---------------------------------------------
        // UPDATE ADMIN
        // ---------------------------------------------

        const updatedAdmins =
            admins.map(
                (admin) => {

                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }


                    return {

                        ...admin,

                        isApproved: true,

                        isActive: true,

                        status: "Active",

                        approvedBy:
                            currentAdmin.id,

                        approvedAt:
                            new Date().toISOString(),

                        permissions: [
                            ADMIN_PERMISSIONS.DASHBOARD,
                        ],
                    };
                }
            );


        saveAdmins(
            updatedAdmins
        );


        return {

            success: true,

            message:
                "Administrator approved successfully.",
        };
    };


    // =====================================================
    // REJECT ADMIN
    // =====================================================

    const rejectAdmin = (adminId) => {

        if (!currentAdmin?.isDefault) {

            return {

                success: false,

                message:
                    "Only the System Administrator can reject an administrator.",
            };
        }


        const adminToReject =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );


        if (!adminToReject) {

            return {

                success: false,

                message:
                    "Administrator not found.",
            };
        }


        if (adminToReject.isDefault) {

            return {

                success: false,

                message:
                    "The System Administrator cannot be rejected.",
            };
        }


        const updatedAdmins =
            admins.map(
                (admin) => {

                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }


                    return {

                        ...admin,

                        isApproved: false,

                        isActive: false,

                        status: "Rejected",

                        approvedBy: null,

                        approvedAt: null,

                        permissions: [],
                    };
                }
            );


        saveAdmins(
            updatedAdmins
        );


        return {

            success: true,

            message:
                "Administrator request rejected.",
        };
    };


    // =====================================================
    // REVOKE ADMIN
    // =====================================================

    const revokeAdmin = (adminId) => {

        if (!currentAdmin?.isDefault) {

            return {

                success: false,

                message:
                    "Only the System Administrator can revoke administrator access.",
            };
        }


        const adminToRevoke =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );


        if (!adminToRevoke) {

            return {

                success: false,

                message:
                    "Administrator not found.",
            };
        }


        if (adminToRevoke.isDefault) {

            return {

                success: false,

                message:
                    "The System Administrator cannot be revoked.",
            };
        }


        const updatedAdmins =
            admins.map(
                (admin) => {

                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }


                    return {

                        ...admin,

                        isApproved: false,

                        isActive: false,

                        status: "Revoked",

                        permissions: [],
                    };
                }
            );


        saveAdmins(
            updatedAdmins
        );


        // If currently logged-in admin was revoked
        if (
            currentAdmin.id ===
            adminId
        ) {

            logoutAdmin();
        }


        return {

            success: true,

            message:
                "Administrator access revoked.",
        };
    };


    // =====================================================
    // UPDATE ADMIN PERMISSIONS
    // =====================================================

    const updateAdminPermissions = (
        adminId,
        permissions
    ) => {

        if (!currentAdmin?.isDefault) {

            return {

                success: false,

                message:
                    "Only the System Administrator can change administrator permissions.",
            };
        }


        const adminToUpdate =
            admins.find(
                (admin) =>
                    admin.id ===
                    adminId
            );


        if (!adminToUpdate) {

            return {

                success: false,

                message:
                    "Administrator not found.",
            };
        }


        if (adminToUpdate.isDefault) {

            return {

                success: false,

                message:
                    "The System Administrator already has full access.",
            };
        }


        const updatedPermissions =
            Array.isArray(permissions)
                ? [
                    ...new Set(
                        permissions
                    ),
                ]
                : [];


        const updatedAdmins =
            admins.map(
                (admin) => {

                    if (
                        admin.id !==
                        adminId
                    ) {
                        return admin;
                    }


                    return {

                        ...admin,

                        permissions:
                            updatedPermissions,
                    };
                }
            );


        saveAdmins(
            updatedAdmins
        );


        // Update currently logged-in admin
        if (
            currentAdmin.id ===
            adminId
        ) {

            const updatedCurrentAdmin =
                updatedAdmins.find(
                    (admin) =>
                        admin.id ===
                        adminId
                );


            if (updatedCurrentAdmin) {

                setCurrentAdmin(
                    updatedCurrentAdmin
                );

                saveAdminSession(
                    updatedCurrentAdmin
                );
            }
        }


        return {

            success: true,

            message:
                "Administrator permissions updated successfully.",
        };
    };


    // =====================================================
    // CHECK ADMIN PANEL ACCESS
    // =====================================================

    const canAccessAdminPanel = (
        admin
    ) => {

        if (!admin) {
            return false;
        }


        if (admin.isDefault) {
            return true;
        }


        return (
            admin.isApproved === true &&
            admin.isActive === true
        );
    };


    // =====================================================
    // CHECK PERMISSION
    // =====================================================

    const hasPermission = (
        permission
    ) => {

        if (!currentAdmin) {
            return false;
        }


        // System Admin has everything
        if (
            currentAdmin.isDefault
        ) {
            return true;
        }


        return (
            Array.isArray(
                currentAdmin.permissions
            ) &&
            currentAdmin.permissions.includes(
                permission
            )
        );
    };


    // =====================================================
    // KEEP CURRENT ADMIN SYNCHRONIZED
    // =====================================================

    useEffect(() => {

        if (!currentAdmin) {
            return;
        }


        const updatedCurrentAdmin =
            admins.find(
                (admin) =>
                    admin.id ===
                    currentAdmin.id
            );


        // Admin deleted
        if (!updatedCurrentAdmin) {

            logoutAdmin();

            return;
        }


        // Secondary admin rejected/revoked
        if (
            !updatedCurrentAdmin.isDefault &&
            (
                updatedCurrentAdmin.isApproved !== true ||
                updatedCurrentAdmin.isActive !== true
            )
        ) {

            logoutAdmin();

            return;
        }


        // Check whether admin data changed
        if (
            JSON.stringify(
                updatedCurrentAdmin
            ) !==
            JSON.stringify(
                currentAdmin
            )
        ) {

            setCurrentAdmin(
                updatedCurrentAdmin
            );

            saveAdminSession(
                updatedCurrentAdmin
            );
        }

    }, [admins]);


    // =====================================================
    // PENDING ADMINS
    // =====================================================

    const pendingAdmins =
        admins.filter(
            (admin) =>
                !admin.isDefault &&
                admin.status ===
                    "Pending"
        );


    // =====================================================
    // ACTIVE SECONDARY ADMINS
    // =====================================================

    const activeSecondaryAdmins =
        admins.filter(
            (admin) =>
                !admin.isDefault &&
                admin.isApproved === true &&
                admin.isActive === true
        );


    // =====================================================
    // PROVIDER
    // =====================================================

    return (
        <AdminContext.Provider
            value={{

                admins,

                currentAdmin,

                loading,

                pendingAdmins,

                activeSecondaryAdmins,

                registerAdmin,

                loginAdmin,

                logoutAdmin,

                approveAdmin,

                rejectAdmin,

                revokeAdmin,

                updateAdminPermissions,

                canAccessAdminPanel,

                hasPermission,

                permissions:
                    ADMIN_PERMISSIONS,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};


// =========================================================
// useAdmin
// =========================================================

export const useAdmin = () => {

    const context =
        useContext(
            AdminContext
        );


    if (!context) {

        throw new Error(
            "useAdmin must be used inside AdminProvider"
        );
    }


    return context;
};


// =========================================================
// useAdminAuth
// Compatibility Alias
// =========================================================

export const useAdminAuth = () => {

    return useAdmin();
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default AdminContext;