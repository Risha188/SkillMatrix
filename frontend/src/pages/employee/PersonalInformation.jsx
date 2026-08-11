import React,{useState} from "react";

const PersonalInformation = () => {
    const [formData,setFormData] = useState({
        employeeId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        dateOfBirth: "",
        gender: "",
    });

    const handleChange = (e) => {
        const {name,value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Personal Information:",formData);
    };

    return (
        <div className="form-page">

            <div className="form-header">
                <h2>Personal Information</h2>
                <p>
                    Enter your basic personal and contact information.
                </p>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            name="employeeId"
                            placeholder="Enter employee ID"
                            value={formData.employeeId}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Alternate Phone</label>
                        <input
                            type="tel"
                            name="alternatePhone"
                            placeholder="Enter alternate phone"
                            value={formData.alternatePhone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                </div>

                <div className="form-actions">
                    <button type="submit">
                        Save Information
                    </button>
                </div>

            </form>
        </div>
    );
};

export default PersonalInformation;

