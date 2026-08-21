const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            unique: true,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // ==============================
        // Personal Information
        // ==============================

        personalDetails: {
            firstName: String,
            lastName: String,
            phone: String,
            alternatePhone: String,
            dateOfBirth: Date,
            gender: String
        },

        // ==============================
        // Education
        // ==============================

        education: [
            {
                highestQualification: String,
                course: String,
                specialization: String,
                university: String,
                college: String,
                passingYear: Number,
                percentage: Number,
                cgpa: Number
            }
        ],

        // ==============================
        // Address
        // ==============================

        address: {
            current: {
                address: String,
                city: String,
                state: String,
                pincode: String,
                country: String
            },

            permanent: {
                address: String,
                city: String,
                state: String,
                pincode: String,
                country: String
            },

            sameAsCurrent: {
                type: Boolean,
                default: false
            }
        },

        // ==============================
        // Skills
        // ==============================

        skills: [
            {
                skill: String,
                category: String,
                proficiency: String,
                experience: String
            }
        ],

        // ==============================
        // Fresher Status
        // ==============================

        isFresher: {
            type: Boolean,
            default: false
        },

        // ==============================
        // Work Experience
        // ==============================

        workExperience: [
            {
                companyName: String,
                jobTitle: String,
                employmentType: String,
                workLocation: String,
                startDate: Date,
                endDate: Date,
                currentlyWorking: Boolean,
                jobDescription: String
            }
        ],

        // ==============================
        // BDM Details
        // ==============================

        bdmDetails: {
            nonTechnicalSkills: [String],
            languagesKnown: [String],
            hobbies: [String],
            areasOfInterest: [String],
            keyStrengths: String,
            additionalInformation: String
        },

        // ==============================
        // Profile Completion
        // ==============================

        profileCompleted: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Employee", employeeSchema);