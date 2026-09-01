import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";


// =========================================================
// API
// =========================================================

const API_BASE_URL =
    "http://localhost:5000/api";


// =========================================================
// PROJECT DETAILS
// =========================================================

const ProjectDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [project, setProject] =
        useState(null);

    const [employees, setEmployees] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // TOKEN
    // =====================================================

    // =====================================================
    // ADMIN TOKEN
    // =====================================================
    // Admin login stores the JWT in sessionStorage as
    // "adminToken". Keep admin and employee sessions separate.
    const getToken = () => {
        return (
            sessionStorage.getItem("adminToken") ||
            localStorage.getItem("adminToken") ||
            localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("jwt") ||
            localStorage.getItem("skillmatrix_token")
        );
    };


    // =====================================================
    // API REQUEST
    // =====================================================

    const apiRequest = async (
        url,
        options = {}
    ) => {

        const token =
            getToken();

        if (!token) {

            throw new Error(
                "Authentication token not found. Please login again."
            );
        }

        const response =
            await fetch(
                `${API_BASE_URL}${url}`,
                {
                    ...options,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,

                        ...(options.headers || {}),
                    },
                }
            );


        let data = {};

        try {

            data =
                await response.json();

        } catch {

            data = {};
        }


        if (!response.ok) {

            // Admin session expired / token is invalid.
            if (response.status === 401) {
                sessionStorage.removeItem("adminToken");
                localStorage.removeItem("adminToken");

                throw new Error(
                    "Admin authentication failed. Please login again."
                );
            }

            if (response.status === 403) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Admin access required."
                );
            }

            throw new Error(
                data.message ||
                data.error ||
                `Request failed with status ${response.status}`
            );
        }


        if (
            data.success === false
        ) {

            throw new Error(
                data.message ||
                data.error ||
                "Request failed"
            );
        }


        return data;
    };


    // =====================================================
    // LOAD PROJECT
    // =====================================================

    const loadProject = async () => {

        try {

            setLoading(true);
            setError("");


            const data =
                await apiRequest(
                    `/admin/projects/${id}`
                );


            console.log(
                "PROJECT DETAILS RESPONSE:",
                data
            );


            const projectData =
                data.project ||
                data.data ||
                data;


            if (
                !projectData ||
                projectData.success === false
            ) {

                throw new Error(
                    "Project not found"
                );
            }


            const normalizedProject = {

                ...projectData,

                projectId:
                    projectData.projectId ||
                    projectData.id ||
                    projectData._id,

                projectName:
                    projectData.projectName ||
                    projectData.name ||
                    "Unnamed Project",

                projectCode:
                    projectData.projectCode ||
                    projectData.projectId ||
                    projectData.id ||
                    id,

                description:
                    projectData.description ||
                    "",

                client:
                    projectData.client ||
                    "Not specified",

                projectType:
                    projectData.projectType ||
                    "Not specified",

                priority:
                    projectData.priority ||
                    "Not specified",

                status:
                    normalizeStatus(
                        projectData.status
                    ),

                startDate:
                    formatDate(
                        projectData.startDate
                    ),

                endDate:
                    formatDate(
                        projectData.endDate
                    ),

                objectives:
                    Array.isArray(
                        projectData.objectives
                    )
                        ? projectData.objectives
                        : [],

                technologies:
                    Array.isArray(
                        projectData.technologies
                    )
                        ? projectData.technologies
                        : Array.isArray(
                              projectData.technologyStack
                          )
                        ? projectData.technologyStack
                        : [],

                employeeIds:
                    Array.isArray(
                        projectData.employeeIds
                    )
                        ? projectData.employeeIds
                        : [],
            };


            setProject(
                normalizedProject
            );


        } catch (err) {

            console.error(
                "Failed to load project:",
                err
            );

            setError(
                err.message ||
                "Failed to load project details"
            );

            setProject(null);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    const loadEmployees = async () => {

        try {

            const data =
                await apiRequest(
                    "/admin/employees"
                );


            const employeeData =
                Array.isArray(
                    data.employees
                )
                    ? data.employees
                    : Array.isArray(
                          data.data
                      )
                    ? data.data
                    : [];


            setEmployees(
                employeeData
            );

        } catch (err) {

            console.error(
                "Failed to load employees:",
                err
            );

            setEmployees([]);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Project ID is missing"
            );

            setLoading(false);

            return;
        }


        loadProject();

        loadEmployees();

    }, [id]);


    // =====================================================
    // NORMALIZE STATUS
    // =====================================================

    const normalizeStatus = (
        status
    ) => {

        if (!status) {
            return "Pending";
        }


        const value =
            String(
                status
            ).toLowerCase();


        if (
            value === "active"
        ) {
            return "Active";
        }


        if (
            value === "completed"
        ) {
            return "Completed";
        }


        if (
            value === "inactive"
        ) {
            return "Inactive";
        }


        if (
            value === "pending"
        ) {
            return "Pending";
        }


        return (
            String(status)
                .charAt(0)
                .toUpperCase() +
            String(status)
                .slice(1)
        );
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (
        value
    ) => {

        if (!value) {
            return "";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value).substring(
                0,
                10
            );
        }


        return date
            .toISOString()
            .substring(
                0,
                10
            );
    };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (
        status
    ) => {

        switch (
            status
        ) {

            case "Active":

                return "bg-green-100 text-green-700";


            case "Pending":

                return "bg-yellow-100 text-yellow-700";


            case "Completed":

                return "bg-blue-100 text-blue-700";


            case "Inactive":

                return "bg-red-100 text-red-700";


            default:

                return "bg-gray-100 text-gray-700";
        }
    };


    // =====================================================
    // EMPLOYEE NAME
    // =====================================================

    const getEmployeeName = (
        employee
    ) => {

        const firstName =
            employee.personalDetails
                ?.firstName ||
            employee.firstName ||
            "";

        const lastName =
            employee.personalDetails
                ?.lastName ||
            employee.lastName ||
            "";


        return (
            `${firstName} ${lastName}`
                .trim() ||
            employee.name ||
            "Unknown Employee"
        );
    };


    // =====================================================
    // PROJECT TEAM
    // =====================================================

    const getProjectEmployees = () => {

        if (!project) {
            return [];
        }


        const employeeIds =
            project.employeeIds ||
            [];


        return employees.filter((employee) => {
            const employeeCode = String(
                employee.employeeId ||
                employee.empId ||
                ""
            );

            const mongoId = String(
                employee._id ||
                employee.id ||
                ""
            );

            return employeeIds.some((assignedId) => {
                if (assignedId === null || assignedId === undefined) {
                    return false;
                }

                if (typeof assignedId === "object") {
                    const objectId = String(
                        assignedId._id ||
                        assignedId.employeeId ||
                        assignedId.id ||
                        ""
                    );

                    return (
                        objectId === employeeCode ||
                        objectId === mongoId
                    );
                }

                const value = String(assignedId);

                return (
                    value === employeeCode ||
                    value === mongoId
                );
            });
        });
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="mx-auto max-w-6xl">

                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">

                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                        <h2 className="text-lg font-semibold text-gray-800">
                            Loading Project...
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Fetching project details from the server.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR / NOT FOUND
    // =====================================================

    if (
        error ||
        !project
    ) {

        return (

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="mx-auto max-w-5xl">

                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-8 w-8 text-red-500"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m0 3h.008v.008H12V15.75ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />

                            </svg>

                        </div>


                        <h2 className="mt-5 text-xl font-semibold text-gray-800">
                            Project Not Found
                        </h2>


                        <p className="mt-2 text-sm text-gray-500">
                            {error ||
                                "The project you are looking for does not exist or may have been removed."}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Go Back
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // TEAM
    // =====================================================

    const projectEmployees =
        getProjectEmployees();


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="mx-auto max-w-6xl">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                        />

                    </svg>

                    Back to Projects

                </button>


                {/* =================================================
                    PROJECT HEADER
                ================================================= */}

                <div className="rounded-xl bg-white shadow-sm">

                    <div className="p-6 sm:p-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                                <div className="flex flex-wrap items-center gap-3">

                                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                                        {
                                            project.projectName
                                        }
                                    </h1>


                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                            project.status
                                        )}`}
                                    >
                                        {
                                            project.status
                                        }
                                    </span>

                                </div>


                                <p className="mt-2 text-sm font-medium text-gray-400">

                                    Project Code:{" "}

                                    <span className="text-gray-600">

                                        {
                                            project.projectCode
                                        }

                                    </span>

                                </p>

                            </div>


                            {/* REASSIGN */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/admin/reassign-project/${project.projectId || id}`,
                                        {
                                            state: {
                                                project,
                                            },
                                        }
                                    )
                                }
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Reassign Team
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        QUICK INFORMATION
                    ================================================= */}

                    <div className="grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-5">

                        <div className="border-b p-5 sm:border-r lg:border-b-0">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Start Date
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {project.startDate ||
                                    "Not specified"}
                            </p>

                        </div>


                        <div className="border-b p-5 lg:border-r lg:border-b-0">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                End Date
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {project.endDate ||
                                    "Not specified"}
                            </p>

                        </div>


                        <div className="border-b p-5 sm:border-r lg:border-b-0">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Client
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {
                                    project.client ||
                                    "Not specified"
                                }
                            </p>

                        </div>


                        <div className="border-b p-5 lg:border-r lg:border-b-0">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Project Type
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {
                                    project.projectType ||
                                    "Not specified"
                                }
                            </p>

                        </div>


                        <div className="p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Priority
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {
                                    project.priority ||
                                    "Not specified"
                                }
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">


                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div className="space-y-6 lg:col-span-2">


                        {/* DESCRIPTION */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <div className="mb-4">

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Project Description
                                </h2>

                                <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />

                            </div>


                            <p className="text-sm leading-7 text-gray-600">

                                {
                                    project.description ||
                                    "No project description has been provided."
                                }

                            </p>

                        </section>


                        {/* OBJECTIVES */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Project Objectives
                            </h2>

                            <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />


                            {project.objectives?.length >
                            0 ? (

                                <div className="mt-5 space-y-3">

                                    {project.objectives.map(
                                        (
                                            objective,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    index
                                                }
                                                className="flex items-start gap-3"
                                            >

                                                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="h-3 w-3 text-blue-600"
                                                    >

                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m5 12 4 4L19 6"
                                                        />

                                                    </svg>

                                                </div>


                                                <p className="text-sm leading-6 text-gray-600">
                                                    {
                                                        objective
                                                    }
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="mt-4 text-sm text-gray-500">
                                    No objectives have been specified.
                                </p>

                            )}

                        </section>


                        {/* TEAM */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Project Team
                                    </h2>

                                    <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />

                                </div>


                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                                    {
                                        project.employeeIds?.length ||
                                        0
                                    }{" "}

                                    Members

                                </span>

                            </div>


                            {projectEmployees.length >
                            0 ? (

                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                    {projectEmployees.map(
                                        (
                                            employee
                                        ) => {

                                            const name =
                                                getEmployeeName(
                                                    employee
                                                );


                                            const initials =
                                                name
                                                    .split(
                                                        " "
                                                    )
                                                    .filter(
                                                        Boolean
                                                    )
                                                    .slice(
                                                        0,
                                                        2
                                                    )
                                                    .map(
                                                        (
                                                            part
                                                        ) =>
                                                            part[0]
                                                    )
                                                    .join(
                                                        ""
                                                    )
                                                    .toUpperCase();


                                            return (

                                                <div
                                                    key={
                                                        employee.employeeId ||
                                                        employee._id
                                                    }
                                                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
                                                >

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">

                                                        {
                                                            initials
                                                        }

                                                    </div>


                                                    <div className="min-w-0">

                                                        <p className="truncate text-sm font-semibold text-gray-800">
                                                            {
                                                                name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                employee.employeeId
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            );
                                        }
                                    )}

                                </div>

                            ) : (

                                <p className="mt-5 text-sm text-gray-500">
                                    No employees are assigned to this project.
                                </p>

                            )}

                        </section>

                    </div>


                    {/* =================================================
                        RIGHT SIDEBAR
                    ================================================= */}

                    <div className="space-y-6">


                        {/* TECHNOLOGY STACK */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Technology Stack
                            </h2>

                            <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />


                            {project.technologies?.length >
                            0 ? (

                                <div className="mt-5 flex flex-wrap gap-2">

                                    {project.technologies.map(
                                        (
                                            technology,
                                            index
                                        ) => (

                                            <span
                                                key={
                                                    index
                                                }
                                                className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700"
                                            >
                                                {
                                                    technology
                                                }
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="mt-4 text-sm text-gray-500">
                                    No technologies specified.
                                </p>

                            )}

                        </section>


                        {/* PROJECT ID */}

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Project Information
                            </h2>

                            <div className="mt-2 h-1 w-10 rounded-full bg-blue-600" />


                            <div className="mt-5 space-y-4">

                                <div>

                                    <p className="text-xs uppercase tracking-wide text-gray-400">
                                        Project ID
                                    </p>

                                    <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                        {
                                            project.projectId
                                        }
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wide text-gray-400">
                                        Team Size
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                        {
                                            project.employeeIds?.length ||
                                            0
                                        }{" "}
                                        employees
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wide text-gray-400">
                                        Current Status
                                    </p>

                                    <span
                                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                            project.status
                                        )}`}
                                    >
                                        {
                                            project.status
                                        }
                                    </span>

                                </div>

                            </div>

                        </section>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProjectDetails;