import {useState} from "react";

const Education = () => {
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
  };

  return (
    <div className="form-page">

      {/* Header */}
      <div className="form-header">
        <h2>Education</h2>

        <p>
          Enter your educational qualifications and academic details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          {/* Highest Qualification */}
          <div className="form-group">
            <label>Highest Qualification</label>

            <select
              name="highestQualification"
              value={education.highestQualification}
              onChange={handleChange}
              required
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
          </div>

          {/* Course */}
          <div className="form-group">
            <label>Course / Degree</label>

            <input
              type="text"
              name="course"
              placeholder="e.g. B.Tech, BCA, MCA"
              value={education.course}
              onChange={handleChange}
            />
          </div>

          {/* Specialization */}
          <div className="form-group">
            <label>Specialization</label>

            <input
              type="text"
              name="specialization"
              placeholder="e.g. Computer Science"
              value={education.specialization}
              onChange={handleChange}
            />
          </div>

          {/* University */}
          <div className="form-group">
            <label>University / Board</label>

            <input
              type="text"
              name="university"
              placeholder="Enter university or board"
              value={education.university}
              onChange={handleChange}
            />
          </div>

          {/* College */}
          <div className="form-group">
            <label>College / Institution</label>

            <input
              type="text"
              name="college"
              placeholder="Enter college or institution"
              value={education.college}
              onChange={handleChange}
            />
          </div>

          {/* Passing Year */}
          <div className="form-group">
            <label>Passing Year</label>

            <input
              type="number"
              name="passingYear"
              placeholder="e.g. 2025"
              min="1950"
              max="2100"
              value={education.passingYear}
              onChange={handleChange}
            />
          </div>

          {/* Percentage */}
          <div className="form-group">
            <label>Percentage</label>

            <input
              type="number"
              name="percentage"
              placeholder="e.g. 85"
              min="0"
              max="100"
              step="0.01"
              value={education.percentage}
              onChange={handleChange}
            />
          </div>

          {/* CGPA */}
          <div className="form-group">
            <label>CGPA</label>

            <input
              type="number"
              name="cgpa"
              placeholder="e.g. 8.5"
              min="0"
              max="10"
              step="0.01"
              value={education.cgpa}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="form-actions">

          <button type="submit">
            Save Education
          </button>

        </div>

      </form>

    </div>
  );
};

export default Education;
