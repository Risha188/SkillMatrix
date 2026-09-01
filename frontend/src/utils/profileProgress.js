// src/data/profileProgress.js

// =========================================================
// PROFILE SECTIONS
// =========================================================

export const PROFILE_SECTIONS = [
    {
        name: "Personal Information",
        key: "personal",
        path: "/employee/personal",
    },
    {
        name: "Education",
        key: "education",
        path: "/employee/education",
    },
    {
        name: "Address",
        key: "address",
        path: "/employee/address",
    },
    {
        name: "Skills",
        key: "skills",
        path: "/employee/skills",
    },
    {
        name: "Work Experience",
        key: "experience",
        path: "/employee/experience",
    },
    {
        name: "BDM Details",
        key: "bdm",
        path: "/employee/bdm",
    },
];

// =========================================================
// GET CURRENT EMPLOYEE ID
// =========================================================

const getEmployeeId = () => {
    return (
        sessionStorage.getItem("employeeId") ||
        sessionStorage.getItem("employeeUserId") ||
        localStorage.getItem("employeeId") ||
        "unknown"
    );
};

// =========================================================
// EMPLOYEE-SPECIFIC STORAGE KEY
// =========================================================

const getStorageKey = () => {
    const employeeId = getEmployeeId();

    return `completedProfileSections_${employeeId}`;
};

// =========================================================
// GET COMPLETED SECTIONS
// =========================================================

export const getCompletedSections = () => {
    try {
        const employeeKey = getStorageKey();

        // -------------------------------------------------
        // FIRST: Read new employee-specific storage
        // -------------------------------------------------

        const employeeData =
            sessionStorage.getItem(employeeKey) ||
            localStorage.getItem(employeeKey);

        if (employeeData) {
            const parsed = JSON.parse(employeeData);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }

        // -------------------------------------------------
        // MIGRATE OLD GLOBAL STORAGE
        // -------------------------------------------------

        const oldData =
            localStorage.getItem(
                "completedProfileSections"
            );

        if (oldData) {
            const parsedOldData =
                JSON.parse(oldData);

            if (Array.isArray(parsedOldData)) {
                localStorage.setItem(
                    employeeKey,
                    JSON.stringify(parsedOldData)
                );

                return parsedOldData;
            }
        }

        return [];
    } catch (error) {
        console.error(
            "Failed to load completed profile sections:",
            error
        );

        return [];
    }
};

// =========================================================
// MARK SECTION COMPLETED
// =========================================================

export const markSectionCompleted = (
    sectionKey
) => {
    try {
        const completedSections =
            getCompletedSections();

        if (
            !completedSections.includes(
                sectionKey
            )
        ) {
            completedSections.push(sectionKey);
        }

        const employeeKey =
            getStorageKey();

        // Save employee-specific progress
        sessionStorage.setItem(
            employeeKey,
            JSON.stringify(
                completedSections
            )
        );

        localStorage.setItem(
            employeeKey,
            JSON.stringify(
                completedSections
            )
        );

        // Keep old key synchronized for backward compatibility
        localStorage.setItem(
            "completedProfileSections",
            JSON.stringify(
                completedSections
            )
        );

        console.log(
            "PROFILE SECTION COMPLETED:",
            sectionKey
        );

        console.log(
            "COMPLETED SECTIONS:",
            completedSections
        );

        return completedSections;
    } catch (error) {
        console.error(
            "Failed to mark section completed:",
            error
        );

        return [];
    }
};

// =========================================================
// CHECK SECTION COMPLETED
// =========================================================

export const isSectionCompleted = (
    sectionKey
) => {
    const completedSections =
        getCompletedSections();

    return completedSections.includes(
        sectionKey
    );
};

// =========================================================
// GET COMPLETED COUNT
// =========================================================

export const getCompletedCount = () => {
    return getCompletedSections().length;
};

// =========================================================
// GET REMAINING COUNT
// =========================================================

export const getRemainingCount = () => {
    const completedSections =
        getCompletedSections();

    return Math.max(
        PROFILE_SECTIONS.length -
            completedSections.length,
        0
    );
};

// =========================================================
// GET COMPLETION PERCENTAGE
// =========================================================

export const getCompletionPercentage = () => {
    const completed =
        getCompletedCount();

    const total =
        PROFILE_SECTIONS.length;

    if (total === 0) {
        return 0;
    }

    return Math.round(
        (completed / total) * 100
    );
};

// =========================================================
// MARK ALL COMPLETED
// USE ONLY IF EMPLOYEE HAS ACTUALLY COMPLETED ALL
// =========================================================

export const markAllSectionsCompleted = () => {
    const allSections =
        PROFILE_SECTIONS.map(
            (section) => section.key
        );

    const employeeKey =
        getStorageKey();

    sessionStorage.setItem(
        employeeKey,
        JSON.stringify(allSections)
    );

    localStorage.setItem(
        employeeKey,
        JSON.stringify(allSections)
    );

    localStorage.setItem(
        "completedProfileSections",
        JSON.stringify(allSections)
    );

    console.log(
        "ALL PROFILE SECTIONS MARKED COMPLETED"
    );

    return allSections;
};

// =========================================================
// RESET PROFILE PROGRESS
// =========================================================

export const resetProfileProgress = () => {
    const employeeKey =
        getStorageKey();

    sessionStorage.removeItem(
        employeeKey
    );

    localStorage.removeItem(
        employeeKey
    );

    localStorage.removeItem(
        "completedProfileSections"
    );

    console.log(
        "Profile progress reset."
    );
};