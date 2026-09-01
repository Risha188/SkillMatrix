import React, {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";


// =========================================================
// API
// =========================================================

const API_BASE_URL =
    "http://localhost:5000/api";


// =========================================================
// EMPLOYEE DETAILS
// =========================================================

const EmployeeDetails = () => {

    const { employeeId } =
        useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [employee, setEmployee] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        updatingStatus,
        setUpdatingStatus,
    ] = useState(false);


    // =====================================================
    // TOKEN
    // =====================================================

    const getToken = () => {
    // ADMIN LOGIN TOKEN
    const adminToken = sessionStorage.getItem("adminToken");

    if (adminToken) {
        console.log(
            "✅ EMPLOYEE DETAILS ADMIN TOKEN FOUND:",
            "sessionStorage.adminToken"
        );
        return adminToken;
    }

    // NORMAL SESSION TOKEN
    const sessionToken = sessionStorage.getItem("token");

    if (sessionToken) {
        console.log(
            "✅ EMPLOYEE DETAILS TOKEN FOUND:",
            "sessionStorage.token"
        );
        return sessionToken;
    }

    // LOCAL STORAGE FALLBACKS
    const localAdminToken =
        localStorage.getItem("adminToken");

    if (localAdminToken) {
        return localAdminToken;
    }

    const localToken =
        localStorage.getItem("token");

    if (localToken) {
        return localToken;
    }

    const authToken =
        localStorage.getItem("authToken");

    if (authToken) {
        return authToken;
    }

    const accessToken =
        localStorage.getItem("accessToken");

    if (accessToken) {
        return accessToken;
    }

    const skillMatrixToken =
        localStorage.getItem("skillmatrix_token");

    if (skillMatrixToken) {
        return skillMatrixToken;
    }

    console.error(
        "❌ EMPLOYEE DETAILS TOKEN NOT FOUND"
    );

    return null;
};


    // =====================================================
    // SAFE VALUE
    // =====================================================

    const displayValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }

        if (
            typeof value === "object"
        ) {
            return "—";
        }

        return String(value);
    };


    // =====================================================
    // FORMAT DATE OF BIRTH
    // =====================================================
    // Display backend ISO dates such as
    // 2005-10-27T00:00:00.000Z as 27/10/2005.
    // UTC is used so the displayed day does not shift because
    // of the browser's local timezone.
    // =====================================================

    const formatDateOfBirth = (value) => {
        if (!value) {
            return "—";
        }

        const rawValue = String(value).trim();

        // Handle YYYY-MM-DD or an ISO string beginning with it.
        const match = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

        if (match) {
            const [, year, month, day] = match;
            return `${day}/${month}/${year}`;
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
        });
    };


    // =====================================================
    // ARRAY VALUE
    // =====================================================

    const displayArray = (value) => {

        if (
            !Array.isArray(value) ||
            value.length === 0
        ) {
            return "—";
        }

        return value
            .map((item) => {

                if (
                    typeof item === "string"
                ) {
                    return item;
                }

                if (
                    item &&
                    typeof item === "object"
                ) {
                    return (
                        item.name ||
                        item.skill ||
                        item.title ||
                        item.value ||
                        ""
                    );
                }

                return "";

            })
            .filter(Boolean)
            .join(", ") || "—";
    };


    // =====================================================
    // GET SKILL NAME
    // =====================================================

    const getSkillName = (
        skill
    ) => {

        if (
            typeof skill === "string"
        ) {
            return skill;
        }

        if (
            skill &&
            typeof skill === "object"
        ) {
            return (
                skill.skill ||
                skill.name ||
                skill.title ||
                ""
            );
        }

        return "";
    };


    // =====================================================
    // GET PRIMARY SKILLS
    // =====================================================

    const getPrimarySkills = (
        employee
    ) => {

        let skills = [];


        if (
            Array.isArray(
                employee?.primarySkills
            )
        ) {

            skills =
                employee.primarySkills;

        } else if (
            employee?.skills &&
            !Array.isArray(employee.skills) &&
            Array.isArray(
                employee.skills.primary
            )
        ) {

            skills =
                employee.skills.primary;

        } else if (
            Array.isArray(
                employee?.skills
            )
        ) {

            skills =
                employee.skills.filter(
                    (skill) =>
                        String(
                            skill?.category ||
                            ""
                        ).toLowerCase() ===
                        "technical"
                );
        }


        return skills
            .map(getSkillName)
            .filter(Boolean);
    };


    // =====================================================
    // GET SECONDARY SKILLS
    // =====================================================

    const getSecondarySkills = (
        employee
    ) => {

        let skills = [];


        if (
            Array.isArray(
                employee?.secondarySkills
            )
        ) {

            skills =
                employee.secondarySkills;

        } else if (
            employee?.skills &&
            !Array.isArray(employee.skills) &&
            Array.isArray(
                employee.skills.secondary
            )
        ) {

            skills =
                employee.skills.secondary;

        } else if (
            Array.isArray(
                employee?.skills
            )
        ) {

            skills =
                employee.skills.filter(
                    (skill) =>
                        String(
                            skill?.category ||
                            ""
                        ).toLowerCase() !==
                        "technical"
                );
        }


        return skills
            .map(getSkillName)
            .filter(Boolean);
    };


    // =====================================================
    // EMPLOYEE NAME
    // =====================================================

    const getEmployeeName = (
        employee
    ) => {

        const firstName =
            employee?.personalDetails
                ?.firstName ||
            employee?.firstName ||
            "";

        const lastName =
            employee?.personalDetails
                ?.lastName ||
            employee?.lastName ||
            "";

        const fullName =
            `${firstName} ${lastName}`
                .trim();


        return (
            fullName ||
            employee?.name ||
            "Employee"
        );
    };


    // =====================================================
    // EMAIL
    // =====================================================

    const getEmployeeEmail = (
        employee
    ) => {

        return (
            employee?.email ||
            employee?.personalDetails
                ?.email ||
            employee?.userId?.email ||
            ""
        );
    };


    // =====================================================
    // PHONE
    // =====================================================

    const getEmployeePhone = (
        employee
    ) => {

        return (
            employee?.phone ||
            employee?.personalDetails
                ?.phone ||
            "Not provided"
        );
    };


    // =====================================================
    // STATUS
    // =====================================================

    const getEmployeeStatus = (
        employee
    ) => {

        if (
            employee?.isActive === true
        ) {
            return "Active";
        }

        if (
            employee?.isActive === false
        ) {
            return "Inactive";
        }

        if (
            employee?.status === "active" ||
            employee?.status === "Active"
        ) {
            return "Active";
        }

        if (
            employee?.status === "inactive" ||
            employee?.status === "Inactive"
        ) {
            return "Inactive";
        }

        return "Inactive";
    };


    // =====================================================
    // LOAD EMPLOYEE
    // =====================================================

    const loadEmployee = async () => {

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


            if (!employeeId) {

                throw new Error(
                    "Employee ID is missing."
                );
            }


            const response =
                await fetch(
                    `${API_BASE_URL}/admin/employees/${employeeId}`,
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


            console.log(
                "EMPLOYEE DETAILS RESPONSE:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to load employee"
                );
            }


            if (
                data.success === false
            ) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to load employee"
                );
            }


            const employeeData =
                data.employee ||
                data.data ||
                data;


            if (
                !employeeData ||
                employeeData.success === false
            ) {

                throw new Error(
                    "Employee not found."
                );
            }


            setEmployee(
                employeeData
            );


        } catch (err) {

            console.error(
                "Employee details error:",
                err
            );


            setError(
                err.message ||
                "Failed to load employee details"
            );


            setEmployee(null);


        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadEmployee();

    }, [employeeId]);


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const handleStatusChange =
        async () => {

            if (!employee) {
                return;
            }


            try {

                setUpdatingStatus(true);

                setError("");


                const token =
                    getToken();


                if (!token) {

                    throw new Error(
                        "Authentication token not found. Please login again."
                    );
                }


                const currentStatus =
                    getEmployeeStatus(
                        employee
                    );


                const isActive =
                    currentStatus !==
                    "Active";


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


                setEmployee(
                    (current) => ({
                        ...current,

                        isActive,

                        status:
                            isActive
                                ? "active"
                                : "inactive",

                        presentStatus:
                            isActive
                                ? "Active"
                                : "Inactive",
                    })
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

                setUpdatingStatus(
                    false
                );
            }
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                    <h2 className="text-lg font-semibold text-gray-800">
                        Loading Employee...
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Fetching employee details from the server.
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (
        !employee ||
        error
    ) {

        return (

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                    <h1 className="text-xl font-bold text-red-600">
                        Employee not found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        {error ||
                            "The employee could not be found."}
                    </p>

                    <Link
                        to="/admin/employees"
                        className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Back to Employees
                    </Link>

                </div>

            </div>
        );
    }


    // =====================================================
    // NORMALIZE DATA
    // =====================================================

    const primarySkills =
        getPrimarySkills(
            employee
        );


    const secondarySkills =
        getSecondarySkills(
            employee
        );


    const status =
        getEmployeeStatus(
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


    const phone =
        getEmployeePhone(
            employee
        );


    // =====================================================
    // PERSONAL DETAILS
    // =====================================================

    const personalDetails =
        employee.personalDetails ||
        {};


    // =====================================================
    // EDUCATION
    // =====================================================
    // Backend stores education as an array.

    const education =
        Array.isArray(
            employee.education
        )
            ? (
                employee.education[0] ||
                {}
            )
            : (
                employee.education ||
                {}
            );


    // =====================================================
    // QUALIFICATION
    // =====================================================
    // Support both qualification object and
    // qualification information inside education.

    const qualification =
        employee.qualification ||
        {

            degree:
                education.highestQualification ||
                "",

            course:
                education.course ||
                "",

            specialization:
                education.specialization ||
                "",

            university:
                education.university ||
                "",

            college:
                education.college ||
                "",

            passingYear:
                education.passingYear ||
                "",

            percentage:
                education.percentage ||
                "",

            cgpa:
                education.cgpa ||
                ""
        };


    // =====================================================
    // ADDRESS
    // =====================================================

    const address =
        employee.address ||
        {};


    const currentAddress =
        address.current ||
        {};


    const permanentAddress =
        address.permanent ||
        {};


    // =====================================================
    // BDM DETAILS
    // =====================================================

    const bdmDetails =
        employee.bdmDetails ||
        {};


    // =====================================================
    // WORK EXPERIENCE
    // =====================================================

    const workExperience =
        Array.isArray(
            employee.workExperience
        )
            ? employee.workExperience
            : [];


    // =====================================================
    // RENDER
    // =====================================================

    // =====================================================
// CALCULATE PROFILE COMPLETION FROM ACTUAL DATA
// =====================================================

const getProfileCompletion = (employee) => {
    if (!employee) {
        return {
            completed: false,
            completedCount: 0,
            total: 6,
            sections: {
                personal: false,
                education: false,
                address: false,
                skills: false,
                experience: false,
                bdm: false,
            },
        };
    }

    // =====================================================
    // 1. PERSONAL INFORMATION
    // =====================================================

    const personal =
        employee.personalDetails || {};

    const personalEmail =
        personal.email ||
        employee.email ||
        "";

    const hasPersonal =
        Boolean(
            String(
                personal.firstName ||
                employee.firstName ||
                ""
            ).trim() &&

            String(
                personal.lastName ||
                employee.lastName ||
                ""
            ).trim() &&

            String(personalEmail).trim() &&

            String(
                personal.phone ||
                employee.phone ||
                ""
            ).trim() &&

            String(
                personal.gender ||
                employee.gender ||
                ""
            ).trim()
        );

    // =====================================================
    // 2. EDUCATION
    // =====================================================

    const educationData =
        Array.isArray(employee.education)
            ? employee.education
            : (
                employee.education &&
                typeof employee.education === "object"
                    ? [employee.education]
                    : []
            );

    const hasEducation =
        educationData.some((item) => {
            if (!item) {
                return false;
            }

            return Boolean(
                String(
                    item.highestQualification ||
                    item.degree ||
                    ""
                ).trim() ||

                String(
                    item.course ||
                    ""
                ).trim() ||

                String(
                    item.specialization ||
                    ""
                ).trim() ||

                String(
                    item.university ||
                    ""
                ).trim() ||

                String(
                    item.college ||
                    ""
                ).trim()
            );
        });

    // =====================================================
    // 3. ADDRESS
    // =====================================================

    const currentAddress =
        employee.address?.current || {};

    const hasAddress =
        Boolean(
            String(
                currentAddress.address ||
                ""
            ).trim() &&

            String(
                currentAddress.city ||
                ""
            ).trim() &&

            String(
                currentAddress.state ||
                ""
            ).trim() &&

            String(
                currentAddress.pincode ||
                ""
            ).trim() &&

            String(
                currentAddress.country ||
                ""
            ).trim()
        );

    // =====================================================
    // 4. SKILLS
    // =====================================================

    const skillsArray =
        Array.isArray(employee.skills)
            ? employee.skills
            : [];

    const primarySkills =
        Array.isArray(employee.primarySkills)
            ? employee.primarySkills
            : (
                Array.isArray(employee.skills?.primary)
                    ? employee.skills.primary
                    : []
            );

    const secondarySkills =
        Array.isArray(employee.secondarySkills)
            ? employee.secondarySkills
            : (
                Array.isArray(employee.skills?.secondary)
                    ? employee.skills.secondary
                    : []
            );

    const technicalSkills =
        Array.isArray(employee.technicalSkills)
            ? employee.technicalSkills
            : [];

    const hasSkills =
        skillsArray.length > 0 ||
        primarySkills.length > 0 ||
        secondarySkills.length > 0 ||
        technicalSkills.length > 0;

    // =====================================================
    // 5. WORK EXPERIENCE
    // =====================================================

    const workExperience =
        Array.isArray(employee.workExperience)
            ? employee.workExperience
            : [];

    const hasWorkExperience =
        employee.isFresher === true ||
        employee.isFresher === "true" ||
        workExperience.length > 0;

    // =====================================================
    // 6. BDM DETAILS
    // =====================================================

    const bdm =
        employee.bdmDetails || {};

    const hasBDM =
        (
            Array.isArray(
                bdm.nonTechnicalSkills
            ) &&
            bdm.nonTechnicalSkills.length > 0
        ) ||
        (
            Array.isArray(
                bdm.languagesKnown
            ) &&
            bdm.languagesKnown.length > 0
        ) ||
        (
            Array.isArray(
                bdm.hobbies
            ) &&
            bdm.hobbies.length > 0
        ) ||
        (
            Array.isArray(
                bdm.areasOfInterest
            ) &&
            bdm.areasOfInterest.length > 0
        ) ||
        Boolean(
            String(
                bdm.keyStrengths ||
                ""
            ).trim()
        ) ||
        Boolean(
            String(
                bdm.additionalInformation ||
                ""
            ).trim()
        );

    const sections = {
        personal: hasPersonal,
        education: hasEducation,
        address: hasAddress,
        skills: hasSkills,
        experience: hasWorkExperience,
        bdm: hasBDM,
    };

    const completedCount =
        Object.values(sections)
            .filter(Boolean)
            .length;

    return {
        completed:
            completedCount === 6,

        completedCount,

        total: 6,

        sections,
    };
};

    const profileCompletion =
        getProfileCompletion(employee);

    console.log(
        "PROFILE COMPLETION:",
        profileCompletion
    );

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="mx-auto max-w-7xl">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-6">

                    <Link
                        to="/admin/employees"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Employees
                    </Link>


                    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h1 className="text-2xl font-bold text-gray-800">
                                Employee Details
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Complete employee profile and information.
                            </p>

                        </div>


                        <div className="flex items-center gap-3">

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                    status === "Active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {status}
                            </span>


                            <button
                                type="button"
                                onClick={
                                    handleStatusChange
                                }
                                disabled={
                                    updatingStatus
                                }
                                className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    status === "Active"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >

                                {updatingStatus
                                    ? "Updating..."
                                    : status === "Active"
                                    ? "Deactivate"
                                    : "Activate"}

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">

                            {name
                                .split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map(
                                    (
                                        part
                                    ) =>
                                        part[0]
                                )
                                .join("")
                                .toUpperCase()}

                        </div>


                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                {name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">

                                Employee ID:{" "}

                                <span className="font-semibold text-gray-700">
                                    {
                                        employee.employeeId
                                    }
                                </span>

                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {email ||
                                    "Email not provided"}
                            </p>

                        </div>

                    </div>

                </div>


                <div className="space-y-6">


                    {/* =================================================
                        PERSONAL INFORMATION
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Personal Information
                        </h2>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Employee ID
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        employee.employeeId
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    First Name
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        personalDetails.firstName
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Last Name
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        personalDetails.lastName
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Email
                                </p>

                                <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        email
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        phone
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Alternate Phone
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        personalDetails.alternatePhone
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Date of Birth
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {formatDateOfBirth(
                                        personalDetails.dateOfBirth
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Gender
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        personalDetails.gender
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Status
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {status}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        QUALIFICATION
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Qualification
                        </h2>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Degree
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.degree
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Course
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.course
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Specialization
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.specialization
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    University
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.university
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    College
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.college
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Passing Year
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.passingYear
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Percentage
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.percentage
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    CGPA
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        qualification.cgpa
                                    )}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        EDUCATION
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Education
                        </h2>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Highest Qualification
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.highestQualification
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Course
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.course
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Specialization
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.specialization
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    University
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.university
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    College
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.college
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Passing Year
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.passingYear
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Percentage
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.percentage
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    CGPA
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        education.cgpa
                                    )}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        CURRENT ADDRESS
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Address
                        </h2>


                        <h3 className="mb-4 text-sm font-semibold text-blue-600">
                            Current Address
                        </h3>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">


                            <div className="lg:col-span-2">

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Address
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        currentAddress.address
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    City
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        currentAddress.city
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    State
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        currentAddress.state
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Pincode
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        currentAddress.pincode
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Country
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        currentAddress.country
                                    )}
                                </p>

                            </div>

                        </div>


                        <div className="my-6 border-t border-gray-200" />


                        <h3 className="mb-4 text-sm font-semibold text-blue-600">
                            Permanent Address
                        </h3>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">


                            <div className="lg:col-span-2">

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Address
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        permanentAddress.address
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    City
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        permanentAddress.city
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    State
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        permanentAddress.state
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Pincode
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        permanentAddress.pincode
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Country
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        permanentAddress.country
                                    )}
                                </p>

                            </div>

                        </div>


                        <div className="mt-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Same as Current Address
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-800">
                                {address.sameAsCurrent
                                    ? "Yes"
                                    : "No"}
                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        PRIMARY SKILLS
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Primary Skills
                        </h2>


                        {primarySkills.length > 0 ? (

                            <div className="flex flex-wrap gap-2">

                                {primarySkills.map(
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
                                                className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700"
                                            >
                                                {
                                                    skillName
                                                }
                                            </span>

                                        );
                                    }
                                )}

                            </div>

                        ) : (

                            <p className="text-sm text-gray-500">
                                No primary skills found.
                            </p>

                        )}

                    </section>


                    {/* =================================================
                        SECONDARY SKILLS
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Secondary Skills
                        </h2>


                        {secondarySkills.length > 0 ? (

                            <div className="flex flex-wrap gap-2">

                                {secondarySkills.map(
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
                                                className="rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700"
                                            >
                                                {
                                                    skillName
                                                }
                                            </span>

                                        );
                                    }
                                )}

                            </div>

                        ) : (

                            <p className="text-sm text-gray-500">
                                No secondary skills found.
                            </p>

                        )}

                    </section>


                    {/* =================================================
                        BDM DETAILS
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            BDM Details
                        </h2>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Non-Technical Skills
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayArray(
                                        bdmDetails.nonTechnicalSkills
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Languages Known
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayArray(
                                        bdmDetails.languagesKnown
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Hobbies
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayArray(
                                        bdmDetails.hobbies
                                    )}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Areas of Interest
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayArray(
                                        bdmDetails.areasOfInterest
                                    )}
                                </p>

                            </div>


                            <div className="md:col-span-2">

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Key Strengths
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {displayValue(
                                        bdmDetails.keyStrengths
                                    )}
                                </p>

                            </div>


                            <div className="md:col-span-2">

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Additional Information
                                </p>

                                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                    {displayValue(
                                        bdmDetails.additionalInformation
                                    )}
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        WORK EXPERIENCE
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Work Experience
                        </h2>


                        {workExperience.length > 0 ? (

                            <div className="space-y-4">

                                {workExperience.map(
                                    (
                                        experience,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                experience._id ||
                                                index
                                            }
                                            className="rounded-lg border border-gray-200 p-5"
                                        >

                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">


                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        Company
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                                        {displayValue(
                                                            experience.company ||
                                                            experience.companyName
                                                        )}
                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        Position
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                                        {displayValue(
                                                            experience.position ||
                                                            experience.role
                                                        )}
                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        Start Date
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                                        {displayValue(
                                                            experience.startDate
                                                        )}
                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        End Date
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                                        {displayValue(
                                                            experience.endDate ||
                                                            "Present"
                                                        )}
                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        Location
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-800">
                                                        {displayValue(
                                                            experience.location
                                                        )}
                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                        Description
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-700">
                                                        {displayValue(
                                                            experience.description
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div>

                                <p className="text-sm text-gray-500">
                                    No work experience found.
                                </p>

                                {employee.isFresher && (

                                    <p className="mt-2 text-sm font-medium text-blue-600">
                                        Employee is a fresher.
                                    </p>

                                )}

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        PROFILE STATUS
                    ================================================= */}

                    <section className="rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Profile Information
                        </h2>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Profile Completed
                                </p>

                                <p className={`mt-1 text-sm font-semibold ${
                                    profileCompletion.completed
                                        ? "text-green-600"
                                        : "text-orange-600"
                                }`}>
                                    {profileCompletion.completed
                                        ? "Completed"
                                        : "Incomplete"}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Email Verified
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {employee.isEmailVerified
                                        ? "Yes"
                                        : "No"}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Fresher
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    {employee.isFresher
                                        ? "Yes"
                                        : "No"}
                                </p>

                            </div>

                        </div>

                    </section>


                </div>

            </div>

        </div>
    );
};


export default EmployeeDetails;