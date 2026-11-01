import { API_URL } from "../config/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/login.css";



const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [booted, setBooted] = useState(false);
  const [systemState, setSystemState] = useState("INITIALIZING");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setSystemState("SYSTEM ONLINE");
    }, 700);

    const timer2 = setTimeout(() => {
      setSystemState("ACCESS PANEL READY");
    }, 1400);

    const timer3 = setTimeout(() => {
      setBooted(true);
    }, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setSystemState("AUTHENTICATING...");

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        setSystemState("ACCESS DENIED");
        alert(data.message || "Invalid email or password.");
        return;
      }

      if (!data.token) {
        console.error("Token missing from server:", data);
        setSystemState("TOKEN ERROR");
        alert("Login failed: token not received from server.");
        return;
      }

      if (!data.user) {
        console.error("User data missing from server:", data);
        setSystemState("USER DATA ERROR");
        alert("Login failed: user data not received from server.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Token saved:", localStorage.getItem("token"));
      console.log("User saved:", localStorage.getItem("user"));

      window.dispatchEvent(new Event("authChanged"));

      setSystemState("ACCESS GRANTED");

      setTimeout(() => {
        alert("Login successful! 🎉");
        navigate("/", { replace: true });
      }, 500);
    } catch (error) {
      console.error("❌ Login Error:", error);

      setSystemState("CONNECTION ERROR");

      alert(
        "Server se connect nahi ho pa raha hai!\n\n" +
          "Please make sure backend server is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`machine-login ${booted ? "is-ready" : ""}`}>
      {/* BACKGROUND GRID */}
      <div className="machine-grid"></div>

      {/* AMBIENT RED LIGHT */}
      <div className="machine-red-glow"></div>

      {/* FLOATING TECH PARTICLES */}
      <span className="tech-particle p1"></span>
      <span className="tech-particle p2"></span>
      <span className="tech-particle p3"></span>
      <span className="tech-particle p4"></span>
      <span className="tech-particle p5"></span>

      <div className="machine-container">

        {/* =========================================
            LEFT SIDE
        ========================================= */}
        <div className="machine-intro">

          <div className="machine-status">
            <span className="status-light"></span>
            <span>{systemState}</span>
          </div>

          <div className="intro-code">
            AUTH / 04
          </div>

          <h1>
            Welcome
            <br />
            <span>Back.</span>
          </h1>

          <div className="intro-line">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <p>
            Secure access to your industrial
            account, orders and services.
          </p>

          {/* MINI STATS */}
          <div className="machine-stats">

            <div className="machine-stat">
              <strong>01</strong>
              <span>SECURE</span>
            </div>

            <div className="machine-stat">
              <strong>24/7</strong>
              <span>ACCESS</span>
            </div>

            <div className="machine-stat">
              <strong>100%</strong>
              <span>ONLINE</span>
            </div>

          </div>

          {/* =====================================
              INDUSTRIAL MACHINE
          ===================================== */}
          <div className="machine-visual">

            <div className="machine-orbit orbit-one"></div>
            <div className="machine-orbit orbit-two"></div>
            <div className="machine-orbit orbit-three"></div>

            <div className="machine-ring ring-one"></div>
            <div className="machine-ring ring-two"></div>

            <div className="machine-core">

              <div className="core-inner">
                <i className="fas fa-gears"></i>
              </div>

              <span className="core-dot"></span>
              <span className="core-dot dot-two"></span>
              <span className="core-dot dot-three"></span>

            </div>

            <div className="machine-label label-top">
              SYSTEM
            </div>

            <div className="machine-label label-bottom">
              READY
            </div>

            <div className="machine-connector connector-one">
              <span></span>
            </div>

            <div className="machine-connector connector-two">
              <span></span>
            </div>

          </div>

        </div>

        {/* =========================================
            LOGIN PANEL
        ========================================= */}
        <div className="machine-panel-wrapper">

          <div className="panel-decoration panel-top">
            <span></span>
            <small>ACCESS PANEL</small>
            <b>04</b>
          </div>

          <div className="machine-panel">

            {/* PANEL HEADER */}
            <div className="panel-header">

              <div>
                <span className="panel-mini-label">
                  USER AUTHENTICATION
                </span>

                <h2>
                  Sign <span>In</span>
                </h2>
              </div>

              <div className="panel-icon">
                <i className="fas fa-fingerprint"></i>
              </div>

            </div>

            <div className="panel-status-line">
              <span></span>
              <small>
                {loading
                  ? "VERIFYING CREDENTIALS"
                  : "SECURE CONNECTION ESTABLISHED"}
              </small>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="machine-field">

                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <div className="machine-input-wrap">

                  <span className="machine-input-icon">
                    <i className="fas fa-envelope"></i>
                  </span>

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

                  <span className="input-ready">
                    {formData.email ? "READY" : "ID"}
                  </span>

                </div>

                <div className="input-line">
                  <span></span>
                </div>

              </div>

              {/* PASSWORD */}
              <div className="machine-field">

                <label htmlFor="password">
                  PASSWORD
                </label>

                <div className="machine-input-wrap">

                  <span className="machine-input-icon">
                    <i className="fas fa-lock"></i>
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="machine-eye"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    <i
                      className={`fas ${
                        showPassword
                          ? "fa-eye-slash"
                          : "fa-eye"
                      }`}
                    ></i>
                  </button>

                </div>

                <div className="input-line">
                  <span></span>
                </div>

              </div>

              {/* FORGOT */}
              <div className="machine-options">

                <span>
                  <i className="fas fa-shield-halved"></i>
                  SECURE SESSION
                </span>

                <Link to="/forgot-password">
                  FORGOT PASSWORD?
                </Link>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className={`machine-login-btn ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >

                <span className="btn-main-text">

                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      AUTHENTICATING...
                    </>
                  ) : (
                    <>
                      AUTHORIZE ACCESS
                      <i className="fas fa-arrow-right"></i>
                    </>
                  )}

                </span>

                <span className="btn-scan"></span>

              </button>

            </form>

            {/* REGISTER */}
            <div className="machine-register">

              <span>NEW TO THE SYSTEM?</span>

              <Link to="/register">
                CREATE ACCOUNT
                <i className="fas fa-arrow-up-right-from-square"></i>
              </Link>

            </div>

            {/* SECURITY FOOTER */}
            <div className="machine-security">

              <span>
                <i className="fas fa-lock"></i>
                ENCRYPTED
              </span>

              <span className="security-divider"></span>

              <span>
                <i className="fas fa-circle-check"></i>
                VERIFIED
              </span>

              <span className="security-divider"></span>

              <span>
                <i className="fas fa-bolt"></i>
                ONLINE
              </span>

            </div>

          </div>

          <div className="panel-decoration panel-bottom">
            <span>INDUSTRIAL DOCTOR</span>
            <span>AUTH NODE / 04</span>
          </div>

        </div>

      </div>

      {/* BOTTOM TELEMETRY */}
      <div className="machine-telemetry">

        <span>
          <i className="fas fa-circle"></i>
          SYSTEM OPERATIONAL
        </span>

        <span>
          ENCRYPTION: AES-256
        </span>

        <span>
          NODE: ID-04
        </span>

        <span>
          STATUS: ONLINE
        </span>

      </div>

    </section>
  );
};

export default Login;