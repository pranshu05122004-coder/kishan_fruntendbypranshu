import React, { useState } from "react";
import "../assets/css/Registration.css";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5001";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");

  const [otpStep, setOtpStep] = useState(false);

  const [otpMethod, setOtpMethod] = useState("");

  const [showOtpMethod, setShowOtpMethod] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE ACCOUNT BUTTON
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------------------------
    // PASSWORD CHECK
    // -------------------------------------------------

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert(
        "Passwords do not match!"
      );
      return;
    }

    // -------------------------------------------------
    // PASSWORD LENGTH
    // -------------------------------------------------

    if (
      formData.password.length < 6
    ) {
      alert(
        "Password must be at least 6 characters!"
      );
      return;
    }

    // -------------------------------------------------
    // EMAIL CHECK
    // -------------------------------------------------

    const email =
      formData.email
        .trim()
        .toLowerCase();

    if (!email) {
      alert(
        "Please enter your email address."
      );
      return;
    }

    // -------------------------------------------------
    // PHONE CHECK
    // -------------------------------------------------

    const phone =
      formData.phone
        .replace(/\D/g, "");

    if (!phone) {
      alert(
        "Please enter your phone number."
      );
      return;
    }

    if (
      phone.length !== 10
    ) {
      alert(
        "Please enter a valid 10 digit phone number."
      );
      return;
    }

    // -------------------------------------------------
    // SHOW OTP METHOD
    // -------------------------------------------------

    setShowOtpMethod(true);
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleSendOtp = async (
    method
  ) => {
    try {
      setOtpLoading(true);

      setOtpMethod(method);

      const email =
        formData.email
          .trim()
          .toLowerCase();

      const phone =
        formData.phone
          .replace(/\D/g, "");

      let endpoint = "";

      // -------------------------------------------------
      // EMAIL
      // -------------------------------------------------

      if (
        method === "email"
      ) {
        endpoint =
          `${API_URL}/api/register/send-otp`;
      }

      // -------------------------------------------------
      // WHATSAPP
      // -------------------------------------------------

      if (
        method === "whatsapp"
      ) {
        endpoint =
          `${API_URL}/api/register/send-whatsapp-otp`;
      }

      if (!endpoint) {
        alert(
          "Invalid OTP method."
        );
        return;
      }

      console.log(
        "📤 Sending OTP using:",
        method
      );

      const response =
        await fetch(
          endpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              phone,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "OTP response:",
        data
      );

      if (
        response.ok &&
        data.success !== false
      ) {
        alert(
          method === "email"
            ? "OTP sent to your email! 📧"
            : "OTP sent to your WhatsApp! 💬"
        );

        setShowOtpMethod(false);

        setOtpStep(true);

        setOtp("");
      } else {
        alert(
          data.message ||
            "OTP send failed!"
        );

        // Method reset only if sending failed
        setOtpMethod("");
      }
    } catch (error) {
      console.error(
        "❌ Send OTP Error:",
        error
      );

      alert(
        "Server se connect nahi ho pa raha hai!\n\n" +
          "Please make sure backend is running on port 5001."
      );

      setOtpMethod("");
    } finally {
      setOtpLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async (
    e
  ) => {
    e.preventDefault();

    // -------------------------------------------------
    // OTP VALIDATION
    // -------------------------------------------------

    if (
      !otp ||
      otp.length !== 6
    ) {
      alert(
        "Please enter 6 digit OTP."
      );
      return;
    }

    if (!otpMethod) {
      alert(
        "Please select OTP method again."
      );

      setOtpStep(false);

      setShowOtpMethod(true);

      return;
    }

    try {
      setLoading(true);

      const email =
        formData.email
          .trim()
          .toLowerCase();

      const phone =
        formData.phone
          .replace(/\D/g, "");

      console.log(
        "🔐 Verifying OTP..."
      );

      console.log(
        "OTP Method:",
        otpMethod
      );

      let verifyEndpoint = "";

      // -------------------------------------------------
      // EMAIL VERIFY
      // -------------------------------------------------

      if (
        otpMethod === "email"
      ) {
        verifyEndpoint =
          `${API_URL}/api/register/verify-otp`;
      }

      // -------------------------------------------------
      // WHATSAPP VERIFY
      // -------------------------------------------------

      if (
        otpMethod === "whatsapp"
      ) {
        verifyEndpoint =
          `${API_URL}/api/register/verify-whatsapp-otp`;
      }

      if (!verifyEndpoint) {
        alert(
          "Invalid OTP verification method."
        );
        return;
      }

      // -------------------------------------------------
      // VERIFY OTP API
      // -------------------------------------------------

      const otpResponse =
        await fetch(
          verifyEndpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              phone,
              otp,
            }),
          }
        );

      const otpData =
        await otpResponse.json();

      console.log(
        "Verify OTP response:",
        otpData
      );

      // -------------------------------------------------
      // OTP FAILED
      // -------------------------------------------------

      if (
        !otpResponse.ok
      ) {
        alert(
          otpData.message ||
            "Invalid OTP!"
        );

        return;
      }

      // -------------------------------------------------
      // OTP VERIFIED
      // -------------------------------------------------

      console.log(
        "✅ OTP verified."
      );

      console.log(
        "👤 Creating account..."
      );

      // -------------------------------------------------
      // CREATE ACCOUNT
      // -------------------------------------------------

      const registerResponse =
        await fetch(
          `${API_URL}/api/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                formData.name.trim(),

              email,

              phone,

              password:
                formData.password,

              // VERY IMPORTANT
              otpMethod,
            }),
          }
        );

      const registerData =
        await registerResponse.json();

      console.log(
        "Registration response:",
        registerData
      );

      // -------------------------------------------------
      // REGISTRATION SUCCESS
      // -------------------------------------------------

      if (
        registerResponse.ok
      ) {
        alert(
          registerData.message ||
            "Registration successful! 🎉"
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setOtp("");

        setOtpStep(false);

        setShowOtpMethod(false);

        setOtpMethod("");
      } else {
        alert(
          registerData.message ||
            "Registration failed!"
        );
      }
    } catch (error) {
      console.error(
        "❌ Verify OTP Error:",
        error
      );

      alert(
        "Server se connect nahi ho pa raha hai!\n\n" +
          "Please make sure backend is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHANGE OTP METHOD
  // =====================================================

  const handleChangeMethod = () => {
    setOtp("");

    setOtpStep(false);

    setOtpMethod("");

    setShowOtpMethod(true);
  };

  // =====================================================
  // BACK TO REGISTRATION
  // =====================================================

  const handleBack = () => {
    setOtp("");

    setOtpStep(false);

    setOtpMethod("");

    setShowOtpMethod(false);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="registration-section">

      <div className="registration-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="registration-header">

          <span className="registration-label">
            JOIN US
          </span>

          <h2>
            Create Your{" "}
            <span>Account</span>
          </h2>

          <div className="registration-line"></div>

          <p>
            Create your account and enjoy a better
            experience with us.
          </p>

        </div>

        {/* =================================================
            CARD
        ================================================= */}

        <div className="registration-card">

          {/* =================================================
              REGISTRATION FORM
          ================================================= */}

          {!otpStep &&
            !showOtpMethod && (
              <form
                onSubmit={
                  handleSubmit
                }
              >

                {/* NAME */}

                <div className="form-group">

                  <label htmlFor="name">
                    Full Name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="form-group">

                  <label htmlFor="email">
                    Email Address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* PHONE */}

                <div className="form-group">

                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter 10 digit phone number"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    maxLength={10}
                    inputMode="numeric"
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div className="form-group">

                  <label htmlFor="password">
                    Password *
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    minLength={6}
                    required
                  />

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="form-group">

                  <label htmlFor="confirmPassword">
                    Confirm Password *
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    minLength={6}
                    required
                  />

                </div>

                {/* CREATE ACCOUNT */}

                <button
                  type="submit"
                  className="register-btn"
                  disabled={
                    otpLoading
                  }
                >
                  Create Account
                </button>

              </form>
            )}

          {/* =================================================
              OTP METHOD SELECTION
          ================================================= */}

          {showOtpMethod &&
            !otpStep && (

              <div className="otp-method-container">

                <div
                  style={{
                    textAlign:
                      "center",
                    marginBottom:
                      "25px",
                  }}
                >

                  <h3>
                    Verify Your Account 🔐
                  </h3>

                  <p>
                    Choose where you want
                    to receive your OTP.
                  </p>

                </div>

                {/* EMAIL */}

                <button
                  type="button"
                  onClick={() =>
                    handleSendOtp(
                      "email"
                    )
                  }
                  disabled={
                    otpLoading
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "16px",
                    marginBottom:
                      "12px",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "10px",
                    background:
                      "#fff",
                    cursor:
                      otpLoading
                        ? "not-allowed"
                        : "pointer",
                    textAlign:
                      "left",
                    fontSize:
                      "16px",
                    opacity:
                      otpLoading
                        ? 0.6
                        : 1,
                  }}
                >

                  <strong>
                    📧 Email OTP
                  </strong>

                  <br />

                  <small>
                    Send OTP to{" "}
                    {formData.email}
                  </small>

                </button>

                {/* WHATSAPP */}

                <button
                  type="button"
                  onClick={() =>
                    handleSendOtp(
                      "whatsapp"
                    )
                  }
                  disabled={
                    otpLoading
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "16px",
                    marginBottom:
                      "12px",
                    border:
                      "1px solid #25D366",
                    borderRadius:
                      "10px",
                    background:
                      "#f5fff8",
                    cursor:
                      otpLoading
                        ? "not-allowed"
                        : "pointer",
                    textAlign:
                      "left",
                    fontSize:
                      "16px",
                    opacity:
                      otpLoading
                        ? 0.6
                        : 1,
                  }}
                >

                  <strong>
                    💬 WhatsApp OTP
                  </strong>

                  <br />

                  <small>
                    Send OTP to{" "}
                    {formData.phone}
                  </small>

                </button>

                {/* LOADING */}

                {otpLoading && (

                  <p
                    style={{
                      textAlign:
                        "center",
                      marginTop:
                        "15px",
                      color:
                        "#555",
                    }}
                  >
                    Sending OTP...
                  </p>

                )}

                {/* BACK */}

                <button
                  type="button"
                  onClick={() => {
                                        setShowOtpMethod(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "10px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#f5f5f5",
                    color: "#333",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >
                  ← Back
                </button>

              </div>
            )}

          {/* =================================================
              OTP VERIFICATION
          ================================================= */}

          {otpStep && (
            <form
              onSubmit={handleVerifyOtp}
              className="otp-verification-container"
            >

              <div
                style={{
                  textAlign: "center",
                  marginBottom: "25px",
                }}
              >
                <h3>Enter OTP 🔐</h3>

                <p>
                  OTP sent to{" "}
                  {otpMethod === "email"
                    ? formData.email
                    : formData.phone}
                </p>
              </div>

              {/* OTP INPUT */}

              <div className="form-group">

                <label htmlFor="otp">
                  Enter 6 Digit OTP *
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: "20px",
                    textAlign: "center",
                    letterSpacing: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                  }}
                />

              </div>

              {/* VERIFY BUTTON */}

              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP & Create Account"}
              </button>

              {/* CHANGE METHOD */}

              <button
                type="button"
                onClick={handleChangeMethod}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                ← Change OTP Method
              </button>

              {/* BACK */}

              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "10px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#f5f5f5",
                  color: "#333",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                ← Back to Registration
              </button>

            </form>
          )}

          {/* =================================================
              LOGIN LINK
          ================================================= */}

          {!otpStep && !showOtpMethod && (
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#C62828",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Registration;