import { useEffect, useRef, useState } from "react";
import { markSectionCompleted } from "../../utils/profileProgress.js";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api.js";
import { useEmployeeProfile } from "../../context/EmployeeProfileContext";

const Education = () => {
  const navigate = useNavigate();

  const { profile, updateSection } = useEmployeeProfile();

  const [education, setEducation] = useState(
    profile.education || {
      highestQualification: "",
      course: "",
      specialization: "",
      university: "",
      college: "",
      passingYear: "",
      percentage: "",
      cgpa: "",
    }
  );

  const [errors, setErrors] = useState({});

  // ============================================
  // DROPDOWN STATES
  // ============================================
  const [courseOpen, setCourseOpen] = useState(false);
  const [specializationOpen, setSpecializationOpen] =
    useState(false);

  const courseRef = useRef(null);
  const specializationRef = useRef(null);

  // ============================================
  // COURSE OPTIONS
  // ============================================
  const courseOptions = [
    // -------------------------
    // GRADUATION
    // -------------------------
    "B.Tech",
    "B.E",
    "BCA",
    "B.Sc",
    "B.Com",
    "BBA",
    "BA",
    "B.Des",
    "B.Pharm",
    "B.Ed",
    "LLB",
    "MBBS",
    "BDS",
    "BAMS",
    "BHMS",

    // -------------------------
    // POST GRADUATION
    // -------------------------
    "M.Tech",
    "M.E",
    "MCA",
    "M.Sc",
    "M.Com",
    "MBA",
    "MA",
    "M.Des",
    "M.Pharm",
    "M.Ed",
    "LLM",
    "MD",
    "MS",

    // -------------------------
    // MANAGEMENT
    // -------------------------
    "BBM",
    "PGDM",

    // -------------------------
    // DIPLOMA
    // -------------------------
    "Diploma",
    "Diploma in Computer Engineering",
    "Diploma in Mechanical Engineering",
    "Diploma in Civil Engineering",
    "Diploma in Electrical Engineering",
    "Diploma in Electronics Engineering",

    // -------------------------
    // PHARMACY
    // -------------------------
    "D.Pharm",

    // -------------------------
    // RESEARCH
    // -------------------------
    "M.Phil",
    "PhD",

    // -------------------------
    // SCHOOL
    // -------------------------
    "10th",
    "12th",

    // -------------------------
    // OTHER
    // -------------------------
    "Other",
  ];

  // ============================================
  // SPECIALIZATION OPTIONS
  // ============================================
  const specializationOptions = [
    // -------------------------
    // COMPUTER / IT
    // -------------------------
    "Computer Science",
    "Information Technology",
    "Computer Applications",
    "Software Engineering",
    "Information Systems",
    "Computer Engineering",

    // -------------------------
    // AI / DATA
    // -------------------------
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Data Analytics",
    "Big Data",

    // -------------------------
    // SECURITY
    // -------------------------
    "Cyber Security",
    "Information Security",
    "Network Security",

    // -------------------------
    // ENGINEERING
    // -------------------------
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Electronics & Communication",
    "Electronics & Instrumentation",
    "Automobile Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Industrial Engineering",
    "Production Engineering",

    // -------------------------
    // SCIENCE
    // -------------------------
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Biotechnology",
    "Microbiology",
    "Environmental Science",

    // -------------------------
    // COMMERCE
    // -------------------------
    "Accounting",
    "Finance",
    "Banking",
    "Commerce",
    "Taxation",

    // -------------------------
    // MANAGEMENT
    // -------------------------
    "Human Resources",
    "Marketing",
    "Finance Management",
    "Operations Management",
    "Business Analytics",
    "International Business",
    "Supply Chain Management",

    // -------------------------
    // ARTS
    // -------------------------
    "English",
    "History",
    "Political Science",
    "Economics",
    "Psychology",
    "Sociology",

    // -------------------------
    // DESIGN
    // -------------------------
    "Graphic Design",
    "Fashion Design",
    "Interior Design",
    "UI/UX Design",

    // -------------------------
    // MEDICAL
    // -------------------------
    "General Medicine",
    "General Surgery",
    "Pediatrics",
    "Dermatology",
    "Orthopedics",
    "Cardiology",
    "Dentistry",
    "Pharmacy",

    // -------------------------
    // OTHER
    // -------------------------
    "Other",
  ];

  // ============================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        courseRef.current &&
        !courseRef.current.contains(event.target)
      ) {
        setCourseOpen(false);
      }

      if (
        specializationRef.current &&
        !specializationRef.current.contains(event.target)
      ) {
        setSpecializationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEducation((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while correcting
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ============================================
  // SELECT COURSE
  // ============================================
  const handleCourseSelect = (course) => {
    setEducation((prev) => ({
      ...prev,
      course,
    }));

    setErrors((prev) => ({
      ...prev,
      course: "",
    }));

    setCourseOpen(false);
  };

  // ============================================
  // SELECT SPECIALIZATION
  // ============================================
  const handleSpecializationSelect = (
    specialization
  ) => {
    setEducation((prev) => ({
      ...prev,
      specialization,
    }));

    setErrors((prev) => ({
      ...prev,
      specialization: "",
    }));

    setSpecializationOpen(false);
  };

  // ============================================
  // FILTER COURSE OPTIONS
  // ============================================
  const filteredCourseOptions =
    courseOptions.filter((course) =>
      course
        .toLowerCase()
        .includes(
          (education.course || "")
            .trim()
            .toLowerCase()
        )
    );

  // ============================================
  // FILTER SPECIALIZATION OPTIONS
  // ============================================
  const filteredSpecializationOptions =
    specializationOptions.filter(
      (specialization) =>
        specialization
          .toLowerCase()
          .includes(
            (education.specialization || "")
              .trim()
              .toLowerCase()
          )
    );

  // ============================================
  // VALIDATION
  // ============================================
  const validateForm = () => {
    const newErrors = {};

    // ==========================================
    // HIGHEST QUALIFICATION
    // ==========================================
    if (!education.highestQualification) {
      newErrors.highestQualification =
        "Please select your highest qualification";
    }

    // ==========================================
    // COURSE
    // ==========================================
    const course = education.course?.trim();

    if (!course) {
      newErrors.course =
        "Course / Degree is required";
    } else if (course.length < 2) {
      newErrors.course =
        "Course / Degree must be at least 2 characters";
    } else if (course.length > 100) {
      newErrors.course =
        "Course / Degree cannot exceed 100 characters";
    }

    // ==========================================
    // SPECIALIZATION
    // ==========================================
    const specialization =
      education.specialization?.trim();

    if (!specialization) {
      newErrors.specialization =
        "Specialization is required";
    } else if (specialization.length < 2) {
      newErrors.specialization =
        "Specialization must be at least 2 characters";
    } else if (specialization.length > 100) {
      newErrors.specialization =
        "Specialization cannot exceed 100 characters";
    }

    // ==========================================
    // UNIVERSITY
    // ==========================================
    const university =
      education.university?.trim();

    if (!university) {
      newErrors.university =
        "University / Board is required";
    } else if (university.length < 2) {
      newErrors.university =
        "University / Board must be at least 2 characters";
    } else if (university.length > 150) {
      newErrors.university =
        "University / Board cannot exceed 150 characters";
    }

    // ==========================================
    // COLLEGE
    // ==========================================
    const college =
      education.college?.trim();

    if (!college) {
      newErrors.college =
        "College / Institution is required";
    } else if (college.length < 2) {
      newErrors.college =
        "College / Institution must be at least 2 characters";
    } else if (college.length > 150) {
      newErrors.college =
        "College / Institution cannot exceed 150 characters";
    }

    // ==========================================
    // PASSING YEAR
    // ==========================================
    const passingYear =
      education.passingYear;

    if (!passingYear) {
      newErrors.passingYear =
        "Passing year is required";
    } else {
      const year = Number(passingYear);
      const currentYear =
        new Date().getFullYear();

      if (!Number.isInteger(year)) {
        newErrors.passingYear =
          "Passing year must be a valid year";
      } else if (year < 1950) {
        newErrors.passingYear =
          "Passing year cannot be before 1950";
      } else if (year > currentYear) {
        newErrors.passingYear =
          "Passing year cannot be in the future";
      }
    }

    // ==========================================
    // PERCENTAGE
    // ==========================================
    const percentage =
      education.percentage;

    if (
      percentage !== "" &&
      percentage !== null &&
      percentage !== undefined
    ) {
      const percentageValue =
        Number(percentage);

      if (isNaN(percentageValue)) {
        newErrors.percentage =
          "Percentage must be a valid number";
      } else if (
        percentageValue < 0 ||
        percentageValue > 100
      ) {
        newErrors.percentage =
          "Percentage must be between 0 and 100";
      }
    }

    // ==========================================
    // CGPA
    // ==========================================
    const cgpa = education.cgpa;

    if (
      cgpa !== "" &&
      cgpa !== null &&
      cgpa !== undefined
    ) {
      const cgpaValue = Number(cgpa);

      if (isNaN(cgpaValue)) {
        newErrors.cgpa =
          "CGPA must be a valid number";
      } else if (
        cgpaValue < 0 ||
        cgpaValue > 10
      ) {
        newErrors.cgpa =
          "CGPA must be between 0 and 10";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ============================================
  // SUBMIT FORM
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const employeeId =
        sessionStorage.getItem("employeeId");

      if (!employeeId) {
        alert(
          "Employee ID not found. Please complete Personal Information first."
        );
        return;
      }

      // ========================================
      // SAVE EDUCATION TO MONGODB
      // ========================================
      const response = await API.put(
        `/employees/${employeeId}/education`,
        education
      );

      console.log(
        "Education saved:",
        response.data
      );

      // ========================================
      // UPDATE REACT CONTEXT
      // ========================================
      updateSection(
        "education",
        education
      );

      // ========================================
      // MARK SECTION COMPLETED
      // ========================================
      markSectionCompleted(
        "education"
      );

      // ========================================
      // GO TO ADDRESS
      // ========================================
      navigate(
        "/employee/address"
      );
    } catch (error) {
      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      console.error(
        "FULL ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save education details"
      );
    }
  };

  // ============================================
  // INPUT CLASSES
  // ============================================
  const inputClass =
    "w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const errorInputClass =
    "w-full min-w-0 rounded-lg border border-red-500 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  // ============================================
  // RETURN
  // ============================================
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 px-3 py-5 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* ========================================
            HEADER
        ======================================== */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Education
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your educational qualifications
            and academic details.
          </p>
        </div>

        {/* ========================================
            FORM
        ======================================== */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-xl bg-white p-4 shadow-md sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">

            {/* ======================================
                HIGHEST QUALIFICATION
            ====================================== */}
            <div>
              <label
                htmlFor="highestQualification"
                className={labelClass}
              >
                Highest Qualification
              </label>

              <select
                id="highestQualification"
                name="highestQualification"
                value={
                  education.highestQualification ||
                  ""
                }
                onChange={handleChange}
                required
                className={
                  errors.highestQualification
                    ? errorInputClass
                    : inputClass
                }
              >
                <option value="">
                  Select Qualification
                </option>

                <option value="10th">
                  10th
                </option>

                <option value="12th">
                  12th
                </option>

                <option value="Diploma">
                  Diploma
                </option>

                <option value="Graduation">
                  Graduation
                </option>

                <option value="Post Graduation">
                  Post Graduation
                </option>

                <option value="PhD">
                  PhD
                </option>
              </select>

              {errors.highestQualification && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.highestQualification
                  }
                </p>
              )}
            </div>


            {/* ======================================
                COURSE / DEGREE
            ====================================== */}
            <div
              ref={courseRef}
              className="relative"
            >
              <label
                htmlFor="course"
                className={labelClass}
              >
                Course / Degree
              </label>

              <div className="relative">
                <input
                  id="course"
                  type="text"
                  name="course"
                  placeholder="Select or type course"
                  value={
                    education.course || ""
                  }
                  onFocus={() => {
                    setCourseOpen(true);
                    setSpecializationOpen(
                      false
                    );
                  }}
                  onChange={(e) => {
                    handleChange(e);
                    setCourseOpen(true);
                  }}
                  maxLength={100}
                  autoComplete="off"
                  className={
                    errors.course
                      ? errorInputClass
                      : inputClass
                  }
                />

                {/* Dropdown Arrow */}
                <button
                  type="button"
                  onClick={() => {
                    setCourseOpen(
                      (prev) => !prev
                    );

                    setSpecializationOpen(
                      false
                    );
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-gray-100"
                  aria-label="Toggle course options"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      courseOpen
                        ? "rotate-180"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* ====================================
                  COURSE DROPDOWN
              ==================================== */}
              {courseOpen && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    z-[100]
                    mt-1
                    max-h-60
                    overflow-y-auto
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    py-1
                    shadow-xl
                  "
                >
                  {filteredCourseOptions.length >
                  0 ? (
                    filteredCourseOptions.map(
                      (course) => (
                        <button
                          key={course}
                          type="button"
                          onClick={() =>
                            handleCourseSelect(
                              course
                            )
                          }
                          className={`
                            block
                            w-full
                            px-3
                            py-1.5
                            text-left
                            text-xs
                            transition
                            hover:bg-blue-50
                            ${
                              education.course ===
                              course
                                ? "bg-blue-50 font-semibold text-blue-600"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {course}
                        </button>
                      )
                    )
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      No matching course found.
                      <br />
                      You can type your own
                      course.
                    </div>
                  )}
                </div>
              )}

              {errors.course && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.course}
                </p>
              )}
            </div>


            {/* ======================================
                SPECIALIZATION
            ====================================== */}
            <div
              ref={specializationRef}
              className="relative"
            >
              <label
                htmlFor="specialization"
                className={labelClass}
              >
                Specialization
              </label>

              <div className="relative">
                <input
                  id="specialization"
                  type="text"
                  name="specialization"
                  placeholder="Select or type specialization"
                  value={
                    education.specialization ||
                    ""
                  }
                  onFocus={() => {
                    setSpecializationOpen(
                      true
                    );
                    setCourseOpen(false);
                  }}
                  onChange={(e) => {
                    handleChange(e);
                    setSpecializationOpen(
                      true
                    );
                  }}
                  maxLength={100}
                  autoComplete="off"
                  className={
                    errors.specialization
                      ? errorInputClass
                      : inputClass
                  }
                />

                {/* Dropdown Arrow */}
                <button
                  type="button"
                  onClick={() => {
                    setSpecializationOpen(
                      (prev) => !prev
                    );

                    setCourseOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-gray-100"
                  aria-label="Toggle specialization options"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      specializationOpen
                        ? "rotate-180"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* ====================================
                  SPECIALIZATION DROPDOWN
              ==================================== */}
              {specializationOpen && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    z-[100]
                    mt-1
                    max-h-60
                    overflow-y-auto
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    py-1
                    shadow-xl
                  "
                >
                  {filteredSpecializationOptions.length >
                  0 ? (
                    filteredSpecializationOptions.map(
                      (specialization) => (
                        <button
                          key={specialization}
                          type="button"
                          onClick={() =>
                            handleSpecializationSelect(
                              specialization
                            )
                          }
                          className={`
                            block
                            w-full
                            px-3
                            py-1.5
                            text-left
                            text-xs
                            transition
                            hover:bg-blue-50
                            ${
                              education.specialization ===
                              specialization
                                ? "bg-blue-50 font-semibold text-blue-600"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {specialization}
                        </button>
                      )
                    )
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-500">
                      No matching specialization
                      found.
                      <br />
                      You can type your own
                      specialization.
                    </div>
                  )}
                </div>
              )}

              {errors.specialization && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.specialization}
                </p>
              )}
            </div>


            {/* ======================================
                UNIVERSITY / BOARD
            ====================================== */}
            <div>
              <label
                htmlFor="university"
                className={labelClass}
              >
                University / Board
              </label>

              <input
                id="university"
                type="text"
                name="university"
                placeholder="Enter university or board"
                value={
                  education.university || ""
                }
                onChange={handleChange}
                maxLength={150}
                className={
                  errors.university
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.university && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.university}
                </p>
              )}
            </div>


            {/* ======================================
                COLLEGE
            ====================================== */}
            <div>
              <label
                htmlFor="college"
                className={labelClass}
              >
                College / Institution
              </label>

              <input
                id="college"
                type="text"
                name="college"
                placeholder="Enter college or institution"
                value={
                  education.college || ""
                }
                onChange={handleChange}
                maxLength={150}
                className={
                  errors.college
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.college && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.college}
                </p>
              )}
            </div>


            {/* ======================================
                PASSING YEAR
            ====================================== */}
            <div>
              <label
                htmlFor="passingYear"
                className={labelClass}
              >
                Passing Year
              </label>

              <input
                id="passingYear"
                type="number"
                name="passingYear"
                placeholder="e.g. 2025"
                min="1950"
                max={new Date().getFullYear()}
                value={
                  education.passingYear || ""
                }
                onChange={handleChange}
                className={
                  errors.passingYear
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.passingYear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.passingYear}
                </p>
              )}
            </div>


            {/* ======================================
                PERCENTAGE
            ====================================== */}
            <div>
              <label
                htmlFor="percentage"
                className={labelClass}
              >
                Percentage
              </label>

              <input
                id="percentage"
                type="number"
                name="percentage"
                placeholder="e.g. 85"
                min="0"
                max="100"
                step="0.01"
                value={
                  education.percentage || ""
                }
                onChange={handleChange}
                className={
                  errors.percentage
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.percentage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.percentage}
                </p>
              )}
            </div>


            {/* ======================================
                CGPA
            ====================================== */}
            <div>
              <label
                htmlFor="cgpa"
                className={labelClass}
              >
                CGPA
              </label>

              <input
                id="cgpa"
                type="number"
                name="cgpa"
                placeholder="e.g. 8.5"
                min="0"
                max="10"
                step="0.01"
                value={education.cgpa || ""}
                onChange={handleChange}
                className={
                  errors.cgpa
                    ? errorInputClass
                    : inputClass
                }
              />

              {errors.cgpa && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.cgpa}
                </p>
              )}
            </div>

          </div>


          {/* ========================================
              BUTTONS
          ======================================== */}
          <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Save & Next
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Education;