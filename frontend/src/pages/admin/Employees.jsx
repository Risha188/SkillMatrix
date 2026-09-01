import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useSearchParams,
} from "react-router-dom";


// =========================================================
// API
// =========================================================

const API_BASE_URL =
    "http://localhost:5000/api";


// =========================================================
// EMPLOYEES
// =========================================================

const Employees = () => {

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    // =====================================================
    // STATE
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [
        employeeList,
        setEmployeeList,
    ] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        updatingEmployeeId,
        setUpdatingEmployeeId,
    ] = useState(null);


    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {
        // =====================================================
        // ADMIN TOKEN
        // =====================================================

        const adminToken =
            sessionStorage.getItem("adminToken");

        if (adminToken) {
            console.log(
                "✅ ADMIN TOKEN FOUND:",
                "sessionStorage.adminToken"
            );

            return adminToken;
        }

        // =====================================================
        // FALLBACK TOKENS
        // =====================================================

        const sessionToken =
            sessionStorage.getItem("token");

        if (sessionToken) {
            console.log(
                "✅ TOKEN FOUND:",
                "sessionStorage.token"
            );

            return sessionToken;
        }

        const localAdminToken =
            localStorage.getItem("adminToken");

        if (localAdminToken) {
            console.log(
                "✅ ADMIN TOKEN FOUND:",
                "localStorage.adminToken"
            );

            return localAdminToken;
        }

        const localToken =
            localStorage.getItem("token");

        if (localToken) {
            console.log(
                "✅ TOKEN FOUND:",
                "localStorage.token"
            );

            return localToken;
        }

        const authToken =
            localStorage.getItem("authToken");

        if (authToken) {
            console.log(
                "✅ AUTH TOKEN FOUND"
            );

            return authToken;
        }

        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {
            console.log(
                "✅ ACCESS TOKEN FOUND"
            );

            return accessToken;
        }

        const skillMatrixToken =
            localStorage.getItem(
                "skillmatrix_token"
            );

        if (skillMatrixToken) {
            console.log(
                "✅ SKILLMATRIX TOKEN FOUND"
            );

            return skillMatrixToken;
        }

        console.error(
            "❌ ADMIN TOKEN NOT FOUND ANYWHERE"
        );

        return null;
    };


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    const loadEmployees = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                getToken();

            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/employees`,
                    {
                        method: "GET",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to load employees"
                );
            }


            if (
                data.success === false
            ) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to load employees"
                );
            }


            // Backend may return:
            //
            // {
            //     success: true,
            //     employees: []
            // }

            const employees =
                Array.isArray(
                    data.employees
                )
                    ? data.employees
                    : Array.isArray(
                        data.data
                    )
                        ? data.data
                        : Array.isArray(data)
                            ? data
                            : [];


            setEmployeeList(
                employees
            );

        } catch (err) {

            console.error(
                "Employee loading error:",
                err
            );

            setError(
                err.message ||
                "Failed to load employees"
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadEmployees();

    }, []);


    // =====================================================
    // STATUS FILTER
    // =====================================================

    const statusFilter =
        searchParams.get("status");


    // =====================================================
    // NORMALIZE EMPLOYEE STATUS
    // =====================================================

    const getEmployeeStatus = (
        employee
    ) => {

        if (
            employee.isActive === true
        ) {

            return "Active";
        }


        if (
            employee.isActive === false
        ) {

            return "Inactive";
        }


        if (
            employee.status === "active" ||
            employee.status === "Active"
        ) {

            return "Active";
        }


        if (
            employee.status === "inactive" ||
            employee.status === "Inactive"
        ) {

            return "Inactive";
        }


        if (
            employee.presentStatus ===
            "active" ||
            employee.presentStatus ===
            "Active"
        ) {

            return "Active";
        }


        if (
            employee.presentStatus ===
            "inactive" ||
            employee.presentStatus ===
            "Inactive"
        ) {

            return "Inactive";
        }


        return "Inactive";
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

        const fullName =
            `${firstName} ${lastName}`
                .trim();


        return (
            fullName ||
            employee.name ||
            "Employee"
        );
    };


    // =====================================================
    // EMPLOYEE EMAIL
    // =====================================================

    const getEmployeeEmail = (
        employee
    ) => {

        if (
            employee.email &&
            typeof employee.email ===
            "string"
        ) {

            return employee.email;
        }


        if (
            employee.personalDetails
                ?.email
        ) {

            return employee.personalDetails
                .email;
        }


        if (
            employee.userId &&
            typeof employee.userId ===
            "object" &&
            employee.userId.email
        ) {

            return employee.userId.email;
        }


        return "";
    };


    // =====================================================
    // EMPLOYEE ID
    // =====================================================

    const getEmployeeId = (
        employee
    ) => {

        return String(
            employee.employeeId ||
            employee.id ||
            ""
        );
    };


    // =====================================================
    // SKILL NAME
    // =====================================================

    const getSkillName = (
        skill
    ) => {

        // ---------------------------------------------
        // String
        // ---------------------------------------------

        if (
            typeof skill === "string"
        ) {

            return skill;
        }


        // ---------------------------------------------
        // Object
        // ---------------------------------------------

        if (
            skill &&
            typeof skill === "object"
        ) {

            return String(
                skill.skill ||
                skill.skillName ||
                skill.primarySkill ||
                skill.name ||
                skill.title ||
                skill.label ||
                skill.value ||
                skill.technology ||
                ""
            );
        }


        return "";
    };


    // =====================================================
    // PRIMARY SKILLS
    // =====================================================

    const getPrimarySkills = (
        employee
    ) => {

        let skills = [];


        // ---------------------------------------------
        // Direct primarySkills
        // ---------------------------------------------

        if (
            Array.isArray(
                employee.primarySkills
            )
        ) {

            skills =
                employee.primarySkills;

        }

        // ---------------------------------------------
        // skills.primary
        // ---------------------------------------------

        else if (
            Array.isArray(
                employee.skills?.primary
            )
        ) {

            skills =
                employee.skills.primary;

        }

        // ---------------------------------------------
        // skills array
        // ---------------------------------------------

        else if (
            Array.isArray(
                employee.skills
            )
        ) {

            skills =
                employee.skills.filter(
                    (skill) => {

                        const category =
                            String(
                                skill?.category ||
                                ""
                            ).toLowerCase();


                        return (
                            category ===
                            "technical"
                        );
                    }
                );
        }


        return skills
            .map(
                getSkillName
            )
            .filter(Boolean);
    };


    // =====================================================
    // SECONDARY SKILLS
    // =====================================================

    const getSecondarySkills = (
        employee
    ) => {

        let skills = [];


        // ---------------------------------------------
        // Direct secondarySkills
        // ---------------------------------------------

        if (
            Array.isArray(
                employee.secondarySkills
            )
        ) {

            skills =
                employee.secondarySkills;

        }

        // ---------------------------------------------
        // skills.secondary
        // ---------------------------------------------

        else if (
            Array.isArray(
                employee.skills?.secondary
            )
        ) {

            skills =
                employee.skills.secondary;

        }

        // ---------------------------------------------
        // skills array
        // ---------------------------------------------

        else if (
            Array.isArray(
                employee.skills
            )
        ) {

            skills =
                employee.skills.filter(
                    (skill) => {

                        const category =
                            String(
                                skill?.category ||
                                ""
                            ).toLowerCase();


                        return (
                            category !==
                            "technical"
                        );
                    }
                );
        }


        return skills
            .map(
                getSkillName
            )
            .filter(Boolean);
    };


    // =====================================================
    // EMPLOYEE COUNTS
    // =====================================================

    const totalEmployees =
        employeeList.length;


    const activeEmployees =
        employeeList.filter(
            (employee) =>
                getEmployeeStatus(
                    employee
                ) === "Active"
        ).length;


    const inactiveEmployees =
        employeeList.filter(
            (employee) =>
                getEmployeeStatus(
                    employee
                ) === "Inactive"
        ).length;


    // =====================================================
    // SEARCH + STATUS FILTER
    // =====================================================

    const filteredEmployees =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return employeeList.filter(
                (employee) => {

                    const employeeId =
                        getEmployeeId(
                            employee
                        );


                    const name =
                        getEmployeeName(
                            employee
                        );


                    const email =
                        getEmployeeEmail(
                            employee
                        );

                    // ---------------------------------------------
                    // PRIMARY SKILLS SEARCH
                    // ---------------------------------------------
                    // Allows the admin to search employees by any
                    // primary skill, for example:
                    // React, Java, Python, MongoDB, Salesforce, etc.
                    // ---------------------------------------------
                    const primarySkills =
                        getPrimarySkills(
                            employee
                        );

                    // Normalize primary skills before searching.
                    // This handles values such as:
                    // "MERN", "MERN Stack", "MERN Stack Developer",
                    // and skill objects such as { skillName: "MERN" }.
                    const normalizedPrimarySkills =
                        primarySkills.map((skill) =>
                            String(skill || "")
                                .trim()
                                .toLowerCase()
                        );

                    const matchesPrimarySkill =
                        normalizedPrimarySkills.some(
                            (skill) =>
                                skill.includes(searchValue) ||
                                searchValue.includes(skill)
                        );

                    const matchesSearch =
                        !searchValue ||
                        name
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        employeeId
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        email
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        matchesPrimarySkill;


                    const employeeStatus =
                        getEmployeeStatus(
                            employee
                        );


                    const matchesStatus =
                        !statusFilter ||
                        employeeStatus
                            .toLowerCase() ===
                        statusFilter
                            .toLowerCase();


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            employeeList,
            search,
            statusFilter,
        ]);


    // =====================================================
    // CHANGE EMPLOYEE STATUS
    // =====================================================

    const handleStatusChange = async (
        employeeId,
        newStatus
    ) => {

        try {

            setUpdatingEmployeeId(
                employeeId
            );

            setError("");


            const token =
                getToken();


            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }


            // Backend expects:
            //
            // {
            //     isActive: true
            // }
            //
            // or
            //
            // {
            //     isActive: false
            // }

            const isActive =
                newStatus === "Active";


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/employees/${employeeId}/status`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body:
                            JSON.stringify({
                                isActive,
                            }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to update employee status"
                );
            }


            if (
                data.success === false
            ) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to update employee status"
                );
            }


            // =================================================
            // UPDATE UI IMMEDIATELY
            // =================================================

            setEmployeeList(
                (
                    currentEmployees
                ) =>
                    currentEmployees.map(
                        (
                            employee
                        ) => {

                            if (
                                String(
                                    getEmployeeId(
                                        employee
                                    )
                                ) !==
                                String(
                                    employeeId
                                )
                            ) {

                                return employee;
                            }


                            return {
                                ...employee,

                                isActive:
                                    isActive,

                                status:
                                    newStatus.toLowerCase(),

                                presentStatus:
                                    newStatus,
                            };
                        }
                    )
            );

        } catch (err) {

            console.error(
                "Status update error:",
                err
            );

            setError(
                err.message ||
                "Failed to update employee status"
            );

        } finally {

            setUpdatingEmployeeId(
                null
            );
        }
    };


    // =====================================================
    // SHOW ALL
    // =====================================================

    const showAllEmployees = () => {

        setSearchParams({});
    };


    // =====================================================
    // SHOW ACTIVE
    // =====================================================

    const showActiveEmployees = () => {

        setSearchParams({
            status: "active",
        });
    };


    // =====================================================
    // SHOW INACTIVE
    // =====================================================

    const showInactiveEmployees = () => {

        setSearchParams({
            status: "inactive",
        });
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="min-h-screen">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex items-start justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Employees
                    </h1>

                    <p className="mt-1 text-gray-500">
                        View and manage employee
                        information and status.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        loadEmployees
                    }
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    {loading
                        ? "Loading..."
                        : "Refresh"}

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

                    <p className="text-sm font-semibold text-red-800">
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={
                            loadEmployees
                        }
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">


                {/* TOTAL */}

                <button
                    type="button"
                    onClick={
                        showAllEmployees
                    }
                    className={`rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${!statusFilter
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                >

                    <p className="text-sm font-medium text-gray-500">
                        Total Employees
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">

                        {loading
                            ? "..."
                            : totalEmployees}

                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        All employees
                    </p>

                </button>


                {/* ACTIVE */}

                <button
                    type="button"
                    onClick={
                        showActiveEmployees
                    }
                    className={`rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${statusFilter ===
                            "active"
                            ? "ring-2 ring-green-500"
                            : ""
                        }`}
                >

                    <p className="text-sm font-medium text-gray-500">
                        Active Employees
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">

                        {loading
                            ? "..."
                            : activeEmployees}

                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        Currently active
                    </p>

                </button>


                {/* INACTIVE */}

                <button
                    type="button"
                    onClick={
                        showInactiveEmployees
                    }
                    className={`rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${statusFilter ===
                            "inactive"
                            ? "ring-2 ring-red-500"
                            : ""
                        }`}
                >

                    <p className="text-sm font-medium text-gray-500">
                        Inactive Employees
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-red-600">

                        {loading
                            ? "..."
                            : inactiveEmployees}

                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                        Currently inactive
                    </p>

                </button>

            </div>


            {/* =================================================
                STATUS FILTER
            ================================================= */}

            {statusFilter && (

                <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">

                    <div>

                        <p className="text-sm font-semibold text-blue-800">

                            Showing{" "}

                            {statusFilter ===
                                "active"
                                ? "active"
                                : "inactive"}

                            {" "}
                            employees

                        </p>


                        <p className="mt-1 text-xs text-blue-600">

                            {
                                filteredEmployees.length
                            }{" "}

                            employee

                            {filteredEmployees.length !==
                                1
                                ? "s"
                                : ""}

                            {" "}
                            found

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            showAllEmployees
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                        Show All
                    </button>

                </div>

            )}


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

                <div className="max-w-md">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search employee by name, ID, email or primary skill..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                </div>


                {search && (

                    <p className="mt-2 text-xs text-gray-500">

                        {
                            filteredEmployees.length
                        }{" "}

                        employee

                        {filteredEmployees.length !==
                            1
                            ? "s"
                            : ""}

                        {" "}
                        found

                    </p>

                )}

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">

                    <p className="text-sm font-medium text-gray-700">
                        Loading employees...
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Fetching employee data from the server.
                    </p>

                </div>

            ) : (

                /* =================================================
                   EMPLOYEE TABLE
                ================================================= */

                <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

                    <table className="w-full min-w-[1100px]">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Employee ID
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Name
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Primary Skills
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Secondary Skills
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredEmployees.length >
                                0 ? (

                                filteredEmployees.map(
                                    (
                                        employee
                                    ) => {

                                        const employeeId =
                                            getEmployeeId(
                                                employee
                                            );


                                        const name =
                                            getEmployeeName(
                                                employee
                                            );


                                        const email =
                                            getEmployeeEmail(
                                                employee
                                            );


                                        const status =
                                            getEmployeeStatus(
                                                employee
                                            );


                                        const primarySkills =
                                            getPrimarySkills(
                                                employee
                                            );


                                        const secondarySkills =
                                            getSecondarySkills(
                                                employee
                                            );


                                        const isUpdating =
                                            updatingEmployeeId ===
                                            employeeId;


                                        return (

                                            <tr
                                                key={
                                                    employeeId
                                                }
                                                className="border-t transition hover:bg-gray-50"
                                            >


                                                {/* =================================================
                                                    EMPLOYEE ID
                                                ================================================= */}

                                                <td className="px-6 py-4">

                                                    <Link
                                                        to={`/admin/employees/${employeeId}`}
                                                        className="font-semibold text-blue-600 hover:underline"
                                                    >

                                                        {
                                                            employeeId
                                                        }

                                                    </Link>

                                                </td>


                                                {/* =================================================
                                                    NAME
                                                ================================================= */}

                                                <td className="px-6 py-4">

                                                    <p className="font-medium text-gray-800">

                                                        {
                                                            name
                                                        }

                                                    </p>

                                                </td>


                                                {/* =================================================
                                                    EMAIL
                                                ================================================= */}

                                                <td className="px-6 py-4 text-sm text-gray-600">

                                                    {
                                                        email ||
                                                        "—"
                                                    }

                                                </td>


                                                {/* =================================================
                                                    PRIMARY SKILLS
                                                ================================================= */}

                                                <td className="px-6 py-4">

                                                    <div className="flex max-w-xs flex-wrap gap-2">

                                                        {primarySkills.length >
                                                            0 ? (

                                                            primarySkills.map(
                                                                (
                                                                    skill,
                                                                    index
                                                                ) => {

                                                                    const skillName =
                                                                        getSkillName(
                                                                            skill
                                                                        );


                                                                    return (

                                                                        <span
                                                                            key={`${skillName}-${index}`}
                                                                            className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                                                                        >

                                                                            {
                                                                                skillName
                                                                            }

                                                                        </span>

                                                                    );

                                                                }
                                                            )

                                                        ) : (

                                                            <span className="text-xs text-gray-400">
                                                                —
                                                            </span>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    SECONDARY SKILLS
                                                ================================================= */}

                                                <td className="px-6 py-4">

                                                    <div className="flex max-w-xs flex-wrap gap-2">

                                                        {secondarySkills.length >
                                                            0 ? (

                                                            secondarySkills.map(
                                                                (
                                                                    skill,
                                                                    index
                                                                ) => {

                                                                    const skillName =
                                                                        getSkillName(
                                                                            skill
                                                                        );


                                                                    return (

                                                                        <span
                                                                            key={`${skillName}-${index}`}
                                                                            className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700"
                                                                        >

                                                                            {
                                                                                skillName
                                                                            }

                                                                        </span>

                                                                    );

                                                                }
                                                            )

                                                        ) : (

                                                            <span className="text-xs text-gray-400">
                                                                —
                                                            </span>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* =================================================
                                                    STATUS
                                                ================================================= */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status ===
                                                                "Active"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                            }`}
                                                    >

                                                        {
                                                            status
                                                        }

                                                    </span>

                                                </td>


                                                {/* =================================================
                                                    ACTION
                                                ================================================= */}

                                                <td className="px-6 py-4">

                                                    {status ===
                                                        "Active" ? (

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    employeeId,
                                                                    "Inactive"
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {isUpdating
                                                                ? "Updating..."
                                                                : "Deactivate"}

                                                        </button>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    employeeId,
                                                                    "Active"
                                                                )
                                                            }
                                                            className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {isUpdating
                                                                ? "Updating..."
                                                                : "Activate"}

                                                        </button>

                                                    )}

                                                </td>

                                            </tr>

                                        );
                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="px-6 py-12 text-center"
                                    >

                                        <p className="text-sm font-medium text-gray-700">
                                            No employees found
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Try searching by employee name, ID, email, or primary skill such as MERN, React, Java, or Python.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
};


export default Employees;   