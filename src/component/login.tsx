import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // ========================================
    // VALIDATION
    // ========================================

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // API REQUEST
      // ========================================

      const response = await fetch(
        `${API_URL}/api/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Login response:",
        data
      );

      // ========================================
      // LOGIN FAILED
      // ========================================

      if (!response.ok) {
        alert(
          data.message ||
            "Invalid email or password."
        );

        return;
      }

      // ========================================
      // CHECK TOKEN
      // ========================================

      if (!data.token) {
        console.error(
          "Token missing from server:",
          data
        );

        alert(
          "Login failed: token not received from server."
        );

        return;
      }

      // ========================================
      // CHECK USER
      // ========================================

      if (!data.user) {
        console.error(
          "User data missing from server:",
          data
        );

        alert(
          "Login failed: user data not received from server."
        );

        return;
      }

      // ========================================
      // SAVE TOKEN
      // ========================================

      localStorage.setItem(
        "token",
        data.token
      );

      // ========================================
      // SAVE USER
      // ========================================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ========================================
      // VERIFY DATA
      // ========================================

      console.log(
        "Token saved:",
        localStorage.getItem("token")
      );

      console.log(
        "User saved:",
        localStorage.getItem("user")
      );

      // ========================================
      // IMPORTANT
      // NAVBAR KO BATANA
      // ========================================

      window.dispatchEvent(
        new Event("authChanged")
      );

      console.log(
        "✅ authChanged event dispatched"
      );

      // ========================================
      // LOGIN SUCCESS
      // ========================================

      alert(
        "Login successful! 🎉"
      );

      // ========================================
      // GO HOME
      // ========================================

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "❌ Login Error:",
        error
      );

      alert(
        "Server se connect nahi ho pa raha hai!\n\n" +
        "Please make sure backend server is running on port 5001."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <style>{`

        .login-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          background: #f8f6f1;
        }

        .login-container {
          width: 100%;
          max-width: 500px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .login-label {
          display: inline-block;
          color: #e63946;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        .login-header h2 {
          margin: 0;
          color: #222;
          font-size: 38px;
          font-weight: 700;
          line-height: 1.2;
        }

        .login-header h2 span {
          color: #e63946;
        }

        .login-line {
          width: 60px;
          height: 3px;
          background: #e63946;
          margin: 18px auto;
        }

        .login-header p {
          margin: 0;
          color: #777;
          font-size: 15px;
          line-height: 1.6;
        }

        .login-card {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          border-top: 4px solid #e63946;
          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.08);
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-size: 14px;
          font-weight: 600;
        }

        .form-group input {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
          font-size: 15px;
          color: #333;
          background: #fff;
        }

        .form-group input:focus {
          border-color: #e63946;
          box-shadow:
            0 0 0 3px rgba(230, 57, 70, 0.12);
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 25px;
        }

        .forgot-password a {
          color: #e63946;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .forgot-password a:hover {
          text-decoration: underline;
        }

        .login-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 6px;
          background: #e63946;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          background: #c92f3b;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .register-link {
          text-align: center;
          margin-top: 25px;
          color: #777;
          font-size: 14px;
        }

        .register-link a {
          color: #e63946;
          font-weight: 700;
          text-decoration: none;
          margin-left: 5px;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {

          .login-section {
            padding: 50px 15px;
          }

          .login-header h2 {
            font-size: 32px;
          }

          .login-card {
            padding: 25px 20px;
          }

        }

      `}</style>

      <section className="login-section">

        <div className="login-container">

          {/* =====================================
              HEADER
          ===================================== */}

          <div className="login-header">

            <span className="login-label">
              WELCOME BACK
            </span>

            <h2>
              Login to{" "}
              <span>Your Account</span>
            </h2>

            <div className="login-line"></div>

            <p>
              Enter your details to access
              your account.
            </p>

          </div>

          {/* =====================================
              CARD
          ===================================== */}

          <div className="login-card">

            <form onSubmit={handleSubmit}>

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
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

              </div>

              {/* FORGOT PASSWORD */}

              <div className="forgot-password">

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>

            {/* REGISTER */}

            <div className="register-link">

              Don't have an account?

              <Link to="/register">
                Create Account
              </Link>

            </div>

          </div>

        </div>

      </section>
    </>
  );
};

export default Login;