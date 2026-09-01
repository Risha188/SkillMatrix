const STORAGE_KEY = "assignedProjects";

// =========================================================
// GET PROJECTS
// =========================================================

export const getProjects = () => {
    try {
        const storedProjects =
            localStorage.getItem(STORAGE_KEY);

        if (!storedProjects) {
            return [];
        }

        const parsedProjects =
            JSON.parse(storedProjects);

        // Make sure stored data is an array
        if (!Array.isArray(parsedProjects)) {
            console.error(
                "Invalid project data in localStorage."
            );

            return [];
        }

        return parsedProjects;

    } catch (error) {

        console.error(
            "Failed to load projects:",
            error
        );

        return [];
    }
};


// =========================================================
// SAVE PROJECTS
// =========================================================

export const saveProjects = (projects) => {
    try {

        if (!Array.isArray(projects)) {
            console.error(
                "Projects must be an array."
            );

            return false;
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(projects)
        );

        return true;

    } catch (error) {

        console.error(
            "Failed to save projects:",
            error
        );

        return false;
    }
};


// =========================================================
// GET SINGLE PROJECT
// =========================================================

export const getProjectById = (projectId) => {
    try {

        const projects =
            getProjects();

        const project =
            projects.find(
                (project) =>
                    String(project.id) ===
                    String(projectId)
            );

        return project || null;

    } catch (error) {

        console.error(
            "Failed to get project:",
            error
        );

        return null;
    }
};


// =========================================================
// UPDATE PROJECT EMPLOYEES
// =========================================================

export const updateProjectEmployees = (
    projectId,
    employeeIds
) => {

    try {

        const projects =
            getProjects();

        if (!projects.length) {

            console.error(
                "No projects found in localStorage."
            );

            return null;
        }

        // -------------------------------------------------
        // Validate employeeIds
        // -------------------------------------------------

        if (
            !Array.isArray(employeeIds) ||
            employeeIds.length < 2
        ) {

            console.error(
                "At least 2 employees are required for every project."
            );

            return null;
        }

        // Remove duplicate employee IDs
        const uniqueEmployeeIds =
            [...new Set(
                employeeIds.map(
                    (id) => String(id)
                )
            )];

        if (uniqueEmployeeIds.length < 2) {

            console.error(
                "At least 2 different employees are required."
            );

            return null;
        }

        // -------------------------------------------------
        // Check project exists
        // -------------------------------------------------

        const projectExists =
            projects.some(
                (project) =>
                    String(project.id) ===
                    String(projectId)
            );

        if (!projectExists) {

            console.error(
                `Project with ID ${projectId} was not found.`
            );

            return null;
        }

        // -------------------------------------------------
        // Update matching project
        // -------------------------------------------------

        const updatedProjects =
            projects.map((project) => {

                if (
                    String(project.id) ===
                    String(projectId)
                ) {

                    return {
                        ...project,

                        employeeIds:
                            uniqueEmployeeIds,
                    };
                }

                return project;
            });

        // -------------------------------------------------
        // Save updated projects
        // -------------------------------------------------

        const saved =
            saveProjects(
                updatedProjects
            );

        if (!saved) {
            return null;
        }

        return updatedProjects;

    } catch (error) {

        console.error(
            "Failed to update project employees:",
            error
        );

        return null;
    }
};


// =========================================================
// UPDATE COMPLETE PROJECT
// =========================================================

export const updateProject = (
    projectId,
    updatedData
) => {

    try {

        const projects =
            getProjects();

        if (
            !updatedData ||
            typeof updatedData !== "object"
        ) {

            console.error(
                "Invalid project update data."
            );

            return null;
        }

        // -------------------------------------------------
        // Check project exists
        // -------------------------------------------------

        const projectExists =
            projects.some(
                (project) =>
                    String(project.id) ===
                    String(projectId)
            );

        if (!projectExists) {

            console.error(
                `Project with ID ${projectId} was not found.`
            );

            return null;
        }

        // -------------------------------------------------
        // Update project
        // -------------------------------------------------

        const updatedProjects =
            projects.map((project) => {

                if (
                    String(project.id) ===
                    String(projectId)
                ) {

                    return {
                        ...project,
                        ...updatedData,

                        // Never accidentally change ID
                        id: project.id,
                    };
                }

                return project;
            });

        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        const saved =
            saveProjects(
                updatedProjects
            );

        if (!saved) {
            return null;
        }

        return updatedProjects;

    } catch (error) {

        console.error(
            "Failed to update project:",
            error
        );

        return null;
    }
};


// =========================================================
// ADD PROJECT
// =========================================================

export const addProject = (
    project
) => {

    try {

        if (
            !project ||
            typeof project !== "object"
        ) {

            console.error(
                "Invalid project data."
            );

            return null;
        }

        const projects =
            getProjects();

        // -------------------------------------------------
        // Generate ID if not provided
        // -------------------------------------------------

        const projectId =
            project.id ||
            `PROJECT${Date.now()}`;

        const newProject = {
            ...project,
            id: projectId,

            employeeIds:
                Array.isArray(
                    project.employeeIds
                )
                    ? [
                        ...new Set(
                            project.employeeIds.map(
                                (id) => String(id)
                            )
                        ),
                    ]
                    : [],
        };

        // -------------------------------------------------
        // Prevent duplicate project ID
        // -------------------------------------------------

        const alreadyExists =
            projects.some(
                (existingProject) =>
                    String(existingProject.id) ===
                    String(projectId)
            );

        if (alreadyExists) {

            console.error(
                `Project with ID ${projectId} already exists.`
            );

            return null;
        }

        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        const updatedProjects = [
            ...projects,
            newProject,
        ];

        const saved =
            saveProjects(
                updatedProjects
            );

        if (!saved) {
            return null;
        }

        return newProject;

    } catch (error) {

        console.error(
            "Failed to add project:",
            error
        );

        return null;
    }
};


// =========================================================
// DELETE PROJECT
// =========================================================

export const deleteProject = (
    projectId
) => {

    try {

        const projects =
            getProjects();

        // -------------------------------------------------
        // Check project exists
        // -------------------------------------------------

        const projectExists =
            projects.some(
                (project) =>
                    String(project.id) ===
                    String(projectId)
            );

        if (!projectExists) {

            console.error(
                `Project with ID ${projectId} was not found.`
            );

            return null;
        }

        // -------------------------------------------------
        // Remove project
        // -------------------------------------------------

        const updatedProjects =
            projects.filter(
                (project) =>
                    String(project.id) !==
                    String(projectId)
            );

        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        const saved =
            saveProjects(
                updatedProjects
            );

        if (!saved) {
            return null;
        }

        return updatedProjects;

    } catch (error) {

        console.error(
            "Failed to delete project:",
            error
        );

        return null;
    }
};


// =========================================================
// CLEAR ALL PROJECTS
// =========================================================

export const clearProjects = () => {

    try {

        localStorage.removeItem(
            STORAGE_KEY
        );

        return true;

    } catch (error) {

        console.error(
            "Failed to clear projects:",
            error
        );

        return false;
    }
};


// =========================================================
// PROJECT EXISTS
// =========================================================

export const projectExists = (
    projectId
) => {

    const projects =
        getProjects();

    return projects.some(
        (project) =>
            String(project.id) ===
            String(projectId)
    );
};


// =========================================================
// GET PROJECTS FOR EMPLOYEE
// =========================================================

export const getProjectsForEmployee = (
    employeeId
) => {

    try {

        const projects =
            getProjects();

        if (!employeeId) {
            return [];
        }

        return projects.filter(
            (project) =>
                Array.isArray(
                    project.employeeIds
                ) &&
                project.employeeIds.some(
                    (id) =>
                        String(id) ===
                        String(employeeId)
                )
        );

    } catch (error) {

        console.error(
            "Failed to load employee projects:",
            error
        );

        return [];
    }
};