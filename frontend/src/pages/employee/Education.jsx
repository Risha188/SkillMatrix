import {useState} from "react";
import { markSectionCompleted } from "../../utils/profileProgress.js";
import {useNavigate} from "react-router-dom";
const Education = () => {
  const navigate = useNavigate();
  const [education,setEducation] = useState({
    highestQualification: "",
    course: "",
    specialization: "",
    university: "",
    college: "",
    passingYear: "",
    percentage: "",
    cgpa: "",
  });

  const handleChange = (e) => {
    
    const {name,value} = e.target;

    setEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Education Information:",education);
    markSectionCompleted("education");
    navigate("/employee/address");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Education
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your educational qualifications and academic details.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-md"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Highest Qualification */}
            <div>
              <label
                htmlFor="highestQualification"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Highest Qualification
              </label>

              <select
                id="highestQualification"
                name="highestQualification"
                value={education.highestQualification}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Qualification</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Course */}
            <div>
              <label
                htmlFor="course"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Course / Degree
              </label>

              <input
                id="course"
                type="text"
                name="course"
                placeholder="e.g. B.Tech, BCA, MCA"
                value={education.course}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Specialization */}
            <div>
              <label
                htmlFor="specialization"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Specialization
              </label>

              <input
                id="specialization"
                type="text"
                name="specialization"
                placeholder="e.g. Computer Science"
                value={education.specialization}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* University */}
            <div>
              <label
                htmlFor="university"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                University / Board
              </label>

              <input
                id="university"
                type="text"
                name="university"
                placeholder="Enter university or board"
                value={education.university}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* College */}
            <div>
              <label
                htmlFor="college"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                College / Institution
              </label>

              <input
                id="college"
                type="text"
                name="college"
                placeholder="Enter college or institution"
                value={education.college}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Passing Year */}
            <div>
              <label
                htmlFor="passingYear"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Passing Year
              </label>

              <input
                id="passingYear"
                type="number"
                name="passingYear"
                placeholder="e.g. 2025"
                min="1950"
                max="2100"
                value={education.passingYear}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Percentage */}
            <div>
              <label
                htmlFor="percentage"
                className="mb-2 block text-sm font-medium text-gray-700"
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
                value={education.percentage}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* CGPA */}
            <div>
              <label
                htmlFor="cgpa"
                className="mb-2 block text-sm font-medium text-gray-700"
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
                value={education.cgpa}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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