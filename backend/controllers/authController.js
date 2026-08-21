const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});




const sendAdminVerificationEmail = async (
    email,
    fullName,
    code
) => {

    await transporter.sendMail({

        from: `"SkillMatrix" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "SkillMatrix - Admin Verification Code",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #ddd;
                border-radius: 10px;
            ">

                <h2 style="color:#2563eb;">
                    SkillMatrix Admin Registration
                </h2>

                <p>
                    Hello <strong>${fullName}</strong>,
                </p>

                <p>
                    You are creating a SkillMatrix Admin account.
                </p>

                <p>
                    Your verification code is:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    color:#2563eb;
                    padding:20px;
                    background:#f3f4f6;
                    text-align:center;
                    border-radius:8px;
                ">
                    ${code}
                </div>

                <p>
                    This verification code will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    After verification, you will create your
                    admin password.
                </p>

                <hr>

                <p style="
                    color:#777;
                    font-size:12px;
                ">
                    SkillMatrix Admin Portal
                </p>

            </div>
        `
    });
};

// ======================================================
// GENERATE 6 DIGIT VERIFICATION CODE
// ======================================================


const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


// ======================================================
// SEND VERIFICATION EMAIL
// ======================================================

const sendVerificationEmail = async (email, fullName, code) => {

    await transporter.sendMail({
        from: `"SkillMatrix" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "SkillMatrix - Email Verification Code",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #ddd;
                border-radius: 10px;
            ">

                <h2 style="color: #2563eb;">
                    Welcome to SkillMatrix
                </h2>

                <p>Hello <strong>${fullName}</strong>,</p>

                <p>
                    Thank you for creating your SkillMatrix employee account.
                </p>

                <p>
                    Your email verification code is:
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #2563eb;
                    padding: 20px;
                    background: #f3f4f6;
                    text-align: center;
                    border-radius: 8px;
                ">
                    ${code}
                </div>

                <p>
                    This verification code will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create this account, you can safely ignore
                    this email.
                </p>

                <hr>

                <p style="color: #777; font-size: 12px;">
                    SkillMatrix Employee Portal
                </p>

            </div>
        `
    });
};


// ======================================================
// REGISTER USER
// STEP 1:
// NAME + EMAIL
// ======================================================

const registerUser = async (req, res) => {

    try {

        console.log("=================================");
        console.log("🔥 REGISTER API HIT");
        console.log("BODY:", req.body);
        console.log("=================================");

        const {
            fullName,
            email
        } = req.body;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!fullName || !email) {

            return res.status(400).json({
                success: false,
                message: "Full name and email are required"
            });
        }


        const normalizedEmail = email.toLowerCase().trim();


        // ------------------------------------------
        // CHECK EMAIL FORMAT
        // ------------------------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }


        // ------------------------------------------
        // CHECK EXISTING USER
        // ------------------------------------------

        const existingUser = await User.findOne({
            email: normalizedEmail
        });


        if (existingUser) {

            // If email is already verified
            if (existingUser.isEmailVerified) {

                return res.status(400).json({
                    success: false,
                    message: "An account with this email already exists"
                });
            }


            // --------------------------------------
            // UNVERIFIED USER
            // RESEND VERIFICATION CODE
            // --------------------------------------

            const verificationCode =
                generateVerificationCode();

            const verificationCodeExpires =
                new Date(Date.now() + 10 * 60 * 1000);


            existingUser.fullName = fullName.trim();
            existingUser.verificationCode =
                verificationCode;

            existingUser.verificationCodeExpires =
                verificationCodeExpires;


            await existingUser.save();


            await sendVerificationEmail(
                normalizedEmail,
                fullName,
                verificationCode
            );


            return res.status(200).json({
                success: true,
                message:
                    "Verification code sent to your email",
                email: normalizedEmail
            });
        }


        // ------------------------------------------
        // GENERATE VERIFICATION CODE
        // ------------------------------------------

        const verificationCode =
            generateVerificationCode();

        const verificationCodeExpires =
            new Date(Date.now() + 10 * 60 * 1000);


        // ------------------------------------------
        // CREATE EMPLOYEE
        // ------------------------------------------

        const user = await User.create({

            fullName: fullName.trim(),

            email: normalizedEmail,

            // Password will be created
            // after email verification
            password: null,

            // IMPORTANT:
            // Public registration can ONLY
            // create employees.
            role: "employee",

            isActive: true,

            isEmailVerified: false,

            verificationCode,

            verificationCodeExpires
        });


        console.log(
            "Employee registration created:",
            user._id
        );


        // ------------------------------------------
        // SEND EMAIL
        // ------------------------------------------

        try {

            await sendVerificationEmail(
                normalizedEmail,
                fullName,
                verificationCode
            );

        } catch (emailError) {

            console.error(
                "❌ Verification email error:",
                emailError
            );


            // Remove incomplete account
            // if email could not be sent

            await User.findByIdAndDelete(user._id);


            return res.status(500).json({
                success: false,
                message:
                    "Unable to send verification email. Please try again."
            });
        }


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Verification code sent to your email",

            email: user.email,

            userId: user._id

        });

    } catch (error) {

        console.error(
            "❌ Registration Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// ======================================================
// VERIFY EMAIL
// STEP 2
// ======================================================

const verifyEmail = async (req, res) => {

    try {

        console.log("===== VERIFY EMAIL =====");
        console.log("BODY:", req.body);


        const {
            email,
            verificationCode
        } = req.body;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!email || !verificationCode) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and verification code are required"
            });
        }


        const normalizedEmail =
            email.toLowerCase().trim();


        // ------------------------------------------
        // FIND USER
        // ------------------------------------------

        const user = await User.findOne({
            email: normalizedEmail
        });


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // ------------------------------------------
        // ALREADY VERIFIED
        // ------------------------------------------

        if (user.isEmailVerified) {

            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }


        // ------------------------------------------
        // CHECK CODE
        // ------------------------------------------

        if (
            user.verificationCode !==
            verificationCode.toString().trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid verification code"
            });
        }


        // ------------------------------------------
        // CHECK EXPIRATION
        // ------------------------------------------

        if (
            !user.verificationCodeExpires ||
            user.verificationCodeExpires < new Date()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Verification code has expired"
            });
        }


        // ------------------------------------------
        // VERIFY EMAIL
        // ------------------------------------------

        user.isEmailVerified = true;

        user.verificationCode = null;

        user.verificationCodeExpires = null;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Email verified successfully",

            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "❌ Verify Email Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while verifying email"
        });
    }
};


// ======================================================
// SET PASSWORD
// STEP 3
// AFTER EMAIL VERIFICATION
// ======================================================

const setPassword = async (req, res) => {

    try {

        console.log("===== SET PASSWORD =====");
        console.log("BODY:", req.body);


        const {
            email,
            password,
            confirmPassword
        } = req.body;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !email ||
            !password ||
            !confirmPassword
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Email, password and confirm password are required"
            });
        }


        // ------------------------------------------
        // CHECK PASSWORD MATCH
        // ------------------------------------------

        if (password !== confirmPassword) {

            return res.status(400).json({
                success: false,
                message:
                    "Password and confirm password do not match"
            });
        }


        // ------------------------------------------
        // PASSWORD LENGTH
        // ------------------------------------------

        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters long"
            });
        }


        const normalizedEmail =
            email.toLowerCase().trim();


        // ------------------------------------------
        // FIND USER
        // ------------------------------------------

        const user = await User.findOne({
            email: normalizedEmail
        });


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // ------------------------------------------
        // EMAIL MUST BE VERIFIED
        // ------------------------------------------

        if (!user.isEmailVerified) {

            return res.status(403).json({
                success: false,
                message:
                    "Please verify your email first"
            });
        }


        // ------------------------------------------
        // PREVENT PASSWORD REPLACEMENT
        // ------------------------------------------

        if (user.password) {

            return res.status(400).json({
                success: false,
                message:
                    "Password has already been created. Please login."
            });
        }


        // ------------------------------------------
        // HASH PASSWORD
        // ------------------------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);


        user.password = hashedPassword;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password created successfully. You can now login."

        });

    } catch (error) {

        console.error(
            "❌ Set Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while creating password"
        });
    }
};


// ======================================================
// LOGIN USER
// ======================================================

// ======================================================
// LOGIN USER
// ======================================================

// ======================================================
// LOGIN USER
// ======================================================

// ======================================================
// LOGIN USER
// ======================================================

const loginUser = async (req, res) => {
    try {

        console.log("===== LOGIN REQUEST =====");
        console.log("Request body:", req.body);

        const {
            email,
            password
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // ==========================================
        // CLEAN EMAIL
        // ==========================================

        const cleanEmail = email
            .toLowerCase()
            .trim();

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findOne({
            email: cleanEmail
        });

        // ==========================================
        // ACCOUNT NOT FOUND
        // ==========================================

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found. Please create an account first."
            });
        }

        // ==========================================
        // CHECK ACCOUNT STATUS
        // ==========================================

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        if (!user.password) {
            return res.status(401).json({
                success: false,
                message:
                    "Password has not been created. Please complete registration."
            });
        }

        // ==========================================
        // COMPARE PASSWORD
        // ==========================================

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ==========================================
        // CREATE JWT
        // ==========================================

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // ==========================================
        // SUCCESS
        // ==========================================

        console.log(
            `✅ LOGIN SUCCESS: ${user.email} | ROLE: ${user.role}`
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "❌ Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

// ======================================================
// FORGOT PASSWORD
// SEND RESET CODE
// ======================================================

const forgotPassword = async (req, res) => {
    try {

        console.log("===== FORGOT PASSWORD =====");
        console.log("Request Body:", req.body);

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        // ==========================================
        // FIND EMPLOYEE
        // ==========================================

        const user = await User.findOne({
            email: cleanEmail,
            role: "employee"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No employee account found with this email"
            });
        }

        // ==========================================
        // CHECK ACCOUNT
        // ==========================================

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // ==========================================
        // GENERATE 6 DIGIT CODE
        // ==========================================

        const resetCode =
            Math.floor(
                100000 + Math.random() * 900000
            ).toString();

        // Code valid for 10 minutes

        const resetExpires =
            new Date(
                Date.now() + 10 * 60 * 1000
            );

        // ==========================================
        // SAVE RESET DATA
        // ==========================================

        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = resetExpires;
        user.resetPasswordVerified = false;

        await user.save();

        // ==========================================
        // SEND EMAIL
        // ==========================================

        const mailOptions = {
            from: `"SkillMatrix" <${process.env.EMAIL_USER}>`,
            to: cleanEmail,
            subject: "SkillMatrix Password Reset Code",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    background: #ffffff;
                ">

                    <h2 style="color:#1e293b;">
                        SkillMatrix Password Reset
                    </h2>

                    <p>
                        Hello <strong>${user.fullName}</strong>,
                    </p>

                    <p>
                        We received a request to reset your
                        SkillMatrix employee account password.
                    </p>

                    <p>
                        Your password reset code is:
                    </p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #2563eb;
                        background: #eff6ff;
                        padding: 20px;
                        text-align: center;
                        border-radius: 10px;
                        margin: 20px 0;
                    ">
                        ${resetCode}
                    </div>

                    <p>
                        This code will expire in
                        <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        please ignore this email.
                    </p>

                    <hr />

                    <p style="
                        color:#64748b;
                        font-size:12px;
                    ">
                        © ${new Date().getFullYear()} SkillMatrix
                    </p>

                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(
            "✅ RESET CODE SENT:",
            cleanEmail
        );

        return res.status(200).json({
            success: true,
            message: "Reset code sent successfully",
            email: cleanEmail
        });

    } catch (error) {

        console.error(
            "❌ Forgot Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ======================================================
// VERIFY RESET CODE
// ======================================================

const verifyResetCode = async (req, res) => {
    try {

        console.log("===== VERIFY RESET CODE =====");

        const {
            email,
            resetCode
        } = req.body;

        if (!email || !resetCode) {
            return res.status(400).json({
                success: false,
                message: "Email and reset code are required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const cleanCode = resetCode.toString().trim();

        // ==========================================
        // FIND EMPLOYEE
        // ==========================================

        const user = await User.findOne({
            email: cleanEmail,
            role: "employee"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Employee account not found"
            });
        }

        // ==========================================
        // CHECK CODE
        // ==========================================

        if (user.resetPasswordCode !== cleanCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset code"
            });
        }

        // ==========================================
        // CHECK EXPIRY
        // ==========================================

        if (
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()
        ) {

            return res.status(400).json({
                success: false,
                message: "Reset code has expired"
            });
        }

        // ==========================================
        // MARK RESET AS VERIFIED
        // ==========================================

        user.resetPasswordVerified = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Reset code verified successfully",
            email: cleanEmail
        });

    } catch (error) {

        console.error(
            "❌ Verify Reset Code Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
    try {

        console.log("===== RESET PASSWORD =====");

        const {
            email,
            newPassword,
            confirmPassword
        } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !email ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, new password and confirm password are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        // ==========================================
        // FIND EMPLOYEE
        // ==========================================

        const user = await User.findOne({
            email: cleanEmail,
            role: "employee"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Employee account not found"
            });
        }

        // ==========================================
        // CHECK RESET VERIFICATION
        // ==========================================

        if (user.resetPasswordVerified !== true) {
            return res.status(403).json({
                success: false,
                message:
                    "Please verify the reset code first"
            });
        }

        // ==========================================
        // CHECK EXPIRY
        // ==========================================

        if (
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Password reset session has expired"
            });
        }

        // ==========================================
        // HASH NEW PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        // ==========================================
        // CLEAR RESET DATA
        // ==========================================

        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;
        user.resetPasswordVerified = false;

        await user.save();

        console.log(
            "✅ PASSWORD RESET SUCCESS:",
            user.email
        );

        return res.status(200).json({
            success: true,
            message:
                "Password reset successfully"
        });

    } catch (error) {

        console.error(
            "❌ Reset Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    registerUser,
    verifyEmail,
    setPassword,
    loginUser,
    forgotPassword,
    verifyResetCode,
    resetPassword
};