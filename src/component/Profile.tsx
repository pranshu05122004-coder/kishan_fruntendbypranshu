import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  created_at?: string;
}

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 50,
    y: 50,
  });

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
        setUser(null);
      }
    }
  }, []);

  // =====================================================
  // MOUSE GLOW
  // =====================================================

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;

      setMousePosition({
        x,
        y,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(new Event("authChanged"));

      setUser(null);

      alert("Logout successful! 👋");

      navigate("/login", {
        replace: true,
      });
    }, 700);
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const profile = user || {
    name: "Your Name",
    email: "your@email.com",
    phone: "Not added",
    id: 0,
  };

  const firstLetter = (profile.name || "U")
    .charAt(0)
    .toUpperCase();

  const firstName =
    profile.name?.split(" ")[0] || "User";

  // =====================================================
  // ACTION HANDLER
  // =====================================================

  const handleCardClick = (
    card: string,
    path: string
  ) => {
    setActiveCard(card);

    setTimeout(() => {
      navigate(path);
    }, 180);
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <section
      className={`profile-page ${
        isLoggingOut ? "logging-out" : ""
      }`}
      style={
        {
          "--mouse-x": `${mousePosition.x}%`,
          "--mouse-y": `${mousePosition.y}%`,
        } as React.CSSProperties
      }
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="animated-background">

        <div className="gradient-orb orb-one"></div>

        <div className="gradient-orb orb-two"></div>

        <div className="gradient-orb orb-three"></div>

        <div className="gradient-orb orb-four"></div>

        <div className="grid-overlay"></div>

        <div className="mouse-glow"></div>

      </div>

      {/* =================================================
          FLOATING PARTICLES
      ================================================= */}

      <div className="particles">

        <span className="particle p1"></span>
        <span className="particle p2"></span>
        <span className="particle p3"></span>
        <span className="particle p4"></span>
        <span className="particle p5"></span>
        <span className="particle p6"></span>
        <span className="particle p7"></span>
        <span className="particle p8"></span>
        <span className="particle p9"></span>
        <span className="particle p10"></span>

      </div>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="profile-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="profile-header">

          <div className="header-badge">

            <span className="badge-dot"></span>

            <i className="fas fa-user-circle"></i>

            <span>MY ACCOUNT</span>

          </div>

          <h1 className="profile-title">

            Welcome back,

            <span className="title-name">
              {firstName}
            </span>

          </h1>

          <div className="title-underline">

            <span></span>
            <span></span>
            <span></span>

          </div>

          <p className="profile-subtitle">

            Manage your personal information,
            orders and account preferences.

          </p>

        </header>

        {/* =================================================
            PROFILE MAIN CARD
        ================================================= */}

        <div className="profile-card">

          <div className="card-border-animation"></div>

          <div className="card-shine"></div>

          {/* =================================================
              PROFILE HERO
          ================================================= */}

          <div className="profile-hero">

            <div className="hero-left">

              {/* =================================================
                  AVATAR
              ================================================= */}

              <div className="avatar-area">

                <div className="avatar-ring ring-one"></div>

                <div className="avatar-ring ring-two"></div>

                <div className="avatar-ring ring-three"></div>

                <div className="avatar-glow"></div>

                <div className="profile-avatar">

                  {profile.profile_image ? (

                    <img
                      src={profile.profile_image}
                      alt={
                        profile.name ||
                        "Profile"
                      }
                    />

                  ) : (

                    <span>
                      {firstLetter}
                    </span>

                  )}

                </div>

                {/* =================================================
                    VERIFIED
                ================================================= */}

                <div className="verified-badge">

                  <i className="fas fa-check"></i>

                </div>

              </div>

              {/* =================================================
                  PROFILE NAME
              ================================================= */}

              <div className="profile-name-area">

                <div className="name-line">

                  <h2>
                    {profile.name}
                  </h2>

                  <div className="active-status">

                    <span></span>

                    Active

                  </div>

                </div>

                <div className="email-line">

                  <i className="fas fa-envelope"></i>

                  <span>
                    {profile.email}
                  </span>

                </div>

                <div className="member-line">

                  <i className="fas fa-shield-alt"></i>

                  <span>
                    Verified Account
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                EDIT BUTTON
            ================================================= */}

            <button
              type="button"
              className="hero-edit-button"
              onClick={() =>
                handleCardClick(
                  "edit",
                  "/edit-profile"
                )
              }
            >

              <span className="button-icon">

                <i className="fas fa-pen"></i>

              </span>

              <span>
                Edit Profile
              </span>

              <span className="button-arrow">

                <i className="fas fa-arrow-right"></i>

              </span>

            </button>

          </div>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="section-header">

            <div className="section-title-wrapper">

              <span className="section-kicker">
                PERSONAL INFORMATION
              </span>

              <h3>
                Account Details
              </h3>

            </div>

            <div className="section-icon">

              <i className="fas fa-id-card"></i>

            </div>

          </div>

          <div className="profile-info">

            {/* =================================================
                NAME CARD
            ================================================= */}

            <div
              className="info-card"
              style={{
                animationDelay: "0.15s",
              }}
            >

              <div className="info-card-glow"></div>

              <div className="info-icon">

                <i className="fas fa-user"></i>

              </div>

              <div className="info-content">

                <span>
                  Full Name
                </span>

                <strong>
                  {profile.name ||
                    "Not added"}
                </strong>

              </div>

              <div className="info-arrow">

                <i className="fas fa-chevron-right"></i>

              </div>

            </div>

            {/* =================================================
                EMAIL CARD
            ================================================= */}

            <div
              className="info-card"
              style={{
                animationDelay: "0.25s",
              }}
            >

              <div className="info-card-glow"></div>

              <div className="info-icon">

                <i className="fas fa-envelope"></i>

              </div>

              <div className="info-content">

                <span>
                  Email Address
                </span>

                <strong>
                  {profile.email ||
                    "Not added"}
                </strong>

              </div>

              <div className="info-arrow">

                <i className="fas fa-chevron-right"></i>

              </div>

            </div>

            {/* =================================================
                PHONE CARD
            ================================================= */}

            <div
              className="info-card"
              style={{
                animationDelay: "0.35s",
              }}
            >

              <div className="info-card-glow"></div>

              <div className="info-icon">

                <i className="fas fa-phone"></i>

              </div>

              <div className="info-content">

                <span>
                  Phone Number
                </span>

                <strong>
                  {profile.phone ||
                    "Not added"}
                </strong>

              </div>

              <div className="info-arrow">

                <i className="fas fa-chevron-right"></i>

              </div>

            </div>

            {/* =================================================
                ACCOUNT ID CARD
            ================================================= */}

            <div
              className="info-card"
              style={{
                animationDelay: "0.45s",
              }}
            >

              <div className="info-card-glow"></div>

              <div className="info-icon">

                <i className="fas fa-fingerprint"></i>

              </div>

              <div className="info-content">

                <span>
                  Account ID
                </span>

                <strong>

                  {profile.id
                    ? `#${profile.id}`
                    : "Not available"}

                </strong>

              </div>

              <div className="info-arrow">

                <i className="fas fa-chevron-right"></i>

              </div>

            </div>

          </div>

          {/* =================================================
              QUICK ACCESS
          ================================================= */}

          <div className="section-header actions-section">

            <div className="section-title-wrapper">

              <span className="section-kicker">
                QUICK ACCESS
              </span>

              <h3>
                Manage Your Account
              </h3>

            </div>

            <div className="section-icon">

              <i className="fas fa-th-large"></i>

            </div>

          </div>

          <div className="profile-actions">

            {/* =================================================
                ORDERS
            ================================================= */}

            <button
              type="button"
              className={`action-card orders-card ${
                activeCard === "orders"
                  ? "card-active"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "orders",
                  "/orders"
                )
              }
            >

              <div className="action-background"></div>

              <div className="action-icon">

                <i className="fas fa-box-open"></i>

              </div>

              <div className="action-content">

                <span className="action-small">
                  SHOPPING
                </span>

                <strong>
                  My Orders
                </strong>

                <p>
                  View and track your orders
                </p>

              </div>

              <div className="action-arrow">

                <i className="fas fa-arrow-right"></i>

              </div>

              <div className="action-shine"></div>

            </button>

            {/* =================================================
                CART
            ================================================= */}

            <button
              type="button"
              className={`action-card cart-card ${
                activeCard === "cart"
                  ? "card-active"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "cart",
                  "/cart"
                )
              }
            >

              <div className="action-background"></div>

              <div className="action-icon">

                <i className="fas fa-shopping-bag"></i>

              </div>

              <div className="action-content">

                <span className="action-small">
                  SHOPPING
                </span>

                <strong>
                  Shopping Cart
                </strong>

                <p>
                  View items in your cart
                </p>

              </div>

              <div className="action-arrow">

                <i className="fas fa-arrow-right"></i>

              </div>

              <div className="action-shine"></div>

            </button>

            {/* =================================================
                WISHLIST
            ================================================= */}

            <button
              type="button"
              className={`action-card wishlist-card ${
                activeCard === "wishlist"
                  ? "card-active"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "wishlist",
                  "/wishlist"
                )
              }
            >

              <div className="action-background"></div>

              <div className="action-icon">

                <i className="fas fa-heart"></i>

              </div>

              <div className="action-content">

                <span className="action-small">
                  SAVED
                </span>

                <strong>
                  Wishlist
                </strong>

                <p>
                  Your favorite products
                </p>

              </div>

              <div className="action-arrow">

                <i className="fas fa-arrow-right"></i>

              </div>

              <div className="action-shine"></div>

            </button>

            {/* =================================================
                EDIT PROFILE
            ================================================= */}

            <button
              type="button"
              className={`action-card edit-card ${
                activeCard === "edit"
                  ? "card-active"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "edit",
                  "/edit-profile"
                )
              }
            >

              <div className="action-background"></div>

              <div className="action-icon">

                <i className="fas fa-user-edit"></i>

              </div>

              <div className="action-content">

                <span className="action-small">
                  ACCOUNT
                </span>

                <strong>
                  Edit Profile
                </strong>

                <p>
                  Update your information
                </p>

              </div>

              <div className="action-arrow">

                <i className="fas fa-arrow-right"></i>

              </div>

              <div className="action-shine"></div>

            </button>

          </div>

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

          <div className="bottom-actions">

            <button
              type="button"
              className="home-button"
              onClick={() =>
                navigate("/")
              }
            >

              <span className="bottom-button-icon">

                <i className="fas fa-home"></i>

              </span>

              <span>
                Back to Home
              </span>

            </button>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >

              <span className="bottom-button-icon">

                {isLoggingOut ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-sign-out-alt"></i>
                )}

              </span>

              <span>
                {isLoggingOut
                  ? "Logging out..."
                  : "Logout"}
              </span>

            </button>

          </div>

        </div>

        {/* =================================================
            SECURITY
        ================================================= */}

        <div className="security-card">

          <div className="security-pulse"></div>

          <div className="security-icon">

            <i className="fas fa-shield-alt"></i>

          </div>

          <div className="security-content">

            <strong>
              Your account is secure
            </strong>

            <p>
              Your personal information is
              protected and only accessible
              through your account.
            </p>

          </div>

          <div className="security-check">

            <i className="fas fa-check-circle"></i>

          </div>

        </div>

      </div>

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* =====================================================
           GLOBAL
        ===================================================== */

        .profile-page {

          --primary: #e63946;
          --primary-dark: #bd2634;
          --primary-light: #fff0f2;

          --text: #191919;
          --muted: #777;

          --white: #ffffff;

          position: relative;

          min-height: 100vh;

          overflow: hidden;

          padding: 80px 20px 100px;

          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(230,57,70,0.07),
              transparent 30%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(230,57,70,0.06),
              transparent 30%
            ),
            #f8f7f4;

          color: var(--text);

          isolation: isolate;

        }

        /* =====================================================
           ANIMATED BACKGROUND
        ===================================================== */

        .animated-background {

          position: fixed;

          inset: 0;

          overflow: hidden;

          pointer-events: none;

          z-index: -3;

        }

        .gradient-orb {

          position: absolute;

          border-radius: 50%;

          filter: blur(4px);

          opacity: 0.55;

          will-change: transform;

        }

        .orb-one {

          width: 450px;

          height: 450px;

          top: -220px;

          right: -100px;

          background:
            radial-gradient(
              circle,
              rgba(230,57,70,0.18),
              rgba(230,57,70,0)
            );

          animation:
            orbFloatOne
            13s
            ease-in-out
            infinite;

        }

        .orb-two {

          width: 500px;

          height: 500px;

          bottom: -300px;

          left: -150px;

          background:
            radial-gradient(
              circle,
              rgba(230,57,70,0.11),
              rgba(230,57,70,0)
            );

          animation:
            orbFloatTwo
            16s
            ease-in-out
            infinite;

        }

        .orb-three {

          width: 250px;

          height: 250px;

          top: 40%;

          left: 20%;

          background:
            radial-gradient(
              circle,
              rgba(255,100,110,0.07),
              transparent
            );

          animation:
            orbFloatThree
            11s
            ease-in-out
            infinite;

        }

        .orb-four {

          width: 300px;

          height: 300px;

          right: 10%;

          bottom: 15%;

          background:
            radial-gradient(
              circle,
              rgba(220,40,55,0.05),
              transparent
            );

          animation:
            orbFloatFour
            14s
            ease-in-out
            infinite;

        }

        @keyframes orbFloatOne {

          0%,
          100% {

            transform:
              translate3d(0,0,0)
              scale(1);

          }

          50% {

            transform:
              translate3d(-60px,70px,0)
              scale(1.12);

          }

        }

        @keyframes orbFloatTwo {

          0%,
          100% {

            transform:
              translate3d(0,0,0)
              scale(1);

          }

          50% {

            transform:
              translate3d(80px,-50px,0)
              scale(1.08);

          }

        }

        @keyframes orbFloatThree {

          0%,
          100% {

            transform:
              translate(0,0)
              scale(1);

          }

          50% {

            transform:
              translate(80px,-60px)
              scale(1.2);

          }

        }

        @keyframes orbFloatFour {

          0%,
          100% {

            transform:
              translate(0,0);

          }

          50% {

            transform:
              translate(-70px,40px);

          }

        }

        /* =====================================================
           GRID
        ===================================================== */

        .grid-overlay {

          position: absolute;

          inset: 0;

          opacity: 0.22;

          background-image:
            linear-gradient(
              rgba(0,0,0,0.025)
              1px,
              transparent
              1px
            ),
            linear-gradient(
              90deg,
              rgba(0,0,0,0.025)
              1px,
              transparent
              1px
            );

          background-size:
            45px
            45px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 80%
            );

        }

        /* =====================================================
           MOUSE GLOW
        ===================================================== */

        .mouse-glow {

          position: absolute;

          width: 450px;

          height: 450px;

          left:
            calc(
              var(--mouse-x)
              - 225px
            );

          top:
            calc(
              var(--mouse-y)
              - 225px
            );

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(230,57,70,0.05),
              transparent 70%
            );

          pointer-events: none;

          transition:
            left
            0.25s
            ease,
            top
            0.25s
            ease;

        }

        /* =====================================================
           PARTICLES
        ===================================================== */

        .particles {

          position: fixed;

          inset: 0;

          pointer-events: none;

          z-index: -1;

        }

        .particle {

          position: absolute;

          width: 4px;

          height: 4px;

          border-radius: 50%;

          background: var(--primary);

          opacity: 0;

          animation:
            particleFloat
            7s
            linear
            infinite;

        }

        .p1 {
          left: 10%;
          bottom: -20px;
          animation-delay: 0s;
        }

        .p2 {
          left: 20%;
          bottom: -20px;
          animation-delay: 1s;
        }

        .p3 {
          left: 32%;
          bottom: -20px;
          animation-delay: 2.5s;
        }

        .p4 {
          left: 45%;
          bottom: -20px;
          animation-delay: 1.5s;
        }

        .p5 {
          left: 55%;
          bottom: -20px;
          animation-delay: 4s;
        }

        .p6 {
          left: 65%;
          bottom: -20px;
          animation-delay: 2s;
        }

        .p7 {
          left: 75%;
          bottom: -20px;
          animation-delay: 5s;
        }

        .p8 {
          left: 82%;
          bottom: -20px;
          animation-delay: 3s;
        }

        .p9 {
          left: 90%;
          bottom: -20px;
          animation-delay: 6s;
        }

        .p10 {
          left: 38%;
          bottom: -20px;
          animation-delay: 4.5s;
        }

        @keyframes particleFloat {

          0% {

            transform:
              translateY(0)
              scale(0);

            opacity: 0;

          }

          15% {

            opacity: 0.5;

          }

          70% {

            opacity: 0.2;

          }

          100% {

            transform:
              translateY(-100vh)
              translateX(80px)
              scale(1.5);

            opacity: 0;

          }

        }

        /* =====================================================
           CONTAINER
        ===================================================== */

        .profile-container {

          position: relative;

          z-index: 2;

          width: 100%;

          max-width: 1050px;

          margin:
            0
            auto;

        }

        /* =====================================================
           HEADER
        ===================================================== */

        .profile-header {

          text-align: center;

          margin-bottom: 42px;

          animation:
            headerReveal
            0.9s
            cubic-bezier(.2,.8,.2,1)
            both;

        }

        @keyframes headerReveal {

          from {

            opacity: 0;

            transform:
              translateY(-35px)
              scale(0.97);

          }

          to {

            opacity: 1;

            transform:
              translateY(0)
              scale(1);

          }

        }

        .header-badge {

          position: relative;

          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding:
            9px
            17px;

          border-radius: 100px;

          color: var(--primary);

          background:
            rgba(230,57,70,0.08);

          border:
            1px
            solid
            rgba(230,57,70,0.12);

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 2.5px;

          overflow: hidden;

        }

        .header-badge::after {

          content: "";

          position: absolute;

          top: 0;

          left: -100%;

          width: 60%;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.7),
              transparent
            );

          animation:
            badgeShine
            3s
            ease-in-out
            infinite;

        }

        @keyframes badgeShine {

          0% {
            left: -100%;
          }

          50% {
            left: 150%;
          }

          100% {
            left: 150%;
          }

        }

        .badge-dot {

          width: 7px;

          height: 7px;

          border-radius: 50%;

          background: var(--primary);

          box-shadow:
            0 0 0 0
            rgba(230,57,70,0.5);

          animation:
            badgePulse
            2s
            infinite;

        }

        @keyframes badgePulse {

          0% {

            box-shadow:
              0 0 0 0
              rgba(230,57,70,0.45);

          }

          70% {

            box-shadow:
              0 0 0 8px
              rgba(230,57,70,0);

          }

          100% {

            box-shadow:
              0 0 0 0
              rgba(230,57,70,0);

          }

        }

        .profile-title {

          margin:
            17px
            0
            0;

          font-size: 44px;

          line-height: 1.15;

          letter-spacing: -1.5px;

          font-weight: 850;

          color: #171717;

        }

        .title-name {

          position: relative;

          display: inline-block;

          margin-left: 10px;

          color: var(--primary);

        }

        .title-name::after {

          content: "";

          position: absolute;

          left: 0;

          right: 0;

          bottom: -5px;

          height: 3px;

          border-radius: 20px;

          background:
            linear-gradient(
              90deg,
              transparent,
              var(--primary),
              transparent
            );

          transform:
            scaleX(0);

          transform-origin: center;

          animation:
            titleUnderline
            1.2s
            1s
            ease
            forwards;

        }

        @keyframes titleUnderline {

          to {

            transform:
              scaleX(1);

          }

        }

        .title-underline {

          display: flex;

          justify-content: center;

          gap: 5px;

          margin:
            18px
            0
            14px;

        }

        .title-underline span {

          display: block;

          height: 3px;

          border-radius: 20px;

          background: var(--primary);

        }

        .title-underline span:nth-child(1) {

          width: 18px;

          animation:
            lineGrow
            0.6s
            0.5s
            both;

        }

        .title-underline span:nth-child(2) {

          width: 45px;

          animation:
            lineGrow
            0.7s
            0.65s
            both;

        }

        .title-underline span:nth-child(3) {

          width: 18px;

          animation:
            lineGrow
            0.6s
            0.8s
            both;

        }

        @keyframes lineGrow {

          from {

            opacity: 0;

            transform:
              scaleX(0);

          }

          to {

            opacity: 1;

            transform:
              scaleX(1);

          }

        }

        .profile-subtitle {

          max-width: 600px;

          margin:
            0
            auto;

          color: #777;

          font-size: 14px;

          line-height: 1.7;

        }

        /* =====================================================
           PROFILE CARD
        ===================================================== */

        .profile-card {

          position: relative;

          overflow: hidden;

          background:
            rgba(255,255,255,0.96);

          border:
            1px
            solid
            rgba(0,0,0,0.07);

          border-radius: 26px;

          padding: 40px;

          box-shadow:
            0 30px 90px
            rgba(0,0,0,0.09),
            0 5px 20px
            rgba(0,0,0,0.03);

          animation:
            cardReveal
            1s
            0.15s
            cubic-bezier(.2,.8,.2,1)
            both;

          transform-origin:
            center;

        }

        @keyframes cardReveal {

          from {

            opacity: 0;

            transform:
              translateY(45px)
              scale(0.96);

          }

          to {

            opacity: 1;

            transform:
              translateY(0)
              scale(1);

          }

        }

        .card-border-animation {

          position: absolute;

          inset: 0;

          padding: 1px;

          border-radius: inherit;

          background:
            linear-gradient(
              120deg,
              transparent,
              rgba(230,57,70,0.3),
              transparent,
              rgba(230,57,70,0.15),
              transparent
            );

          background-size:
            300%
            300%;

          animation:
            borderFlow
            7s
            linear
            infinite;

          pointer-events: none;

          mask:
            linear-gradient(#fff 0 0)
            content-box,
            linear-gradient(#fff 0 0);

          mask-composite:
            exclude;

        }

        @keyframes borderFlow {

          0% {

            background-position:
              0%
              50%;

          }

          50% {

            background-position:
              100%
              50%;

          }

          100% {

            background-position:
              0%
              50%;

          }

        }

        .card-shine {

          position: absolute;

          top: 0;

          left: -150%;

          width: 70%;

          height: 100%;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.25),
              transparent
            );

          transform:
            skewX(-18deg);

          animation:
            cardShine
            7s
            ease-in-out
            infinite;

        }

        @keyframes cardShine {

          0%,
          65% {

            left: -150%;

          }

          85% {

            left: 160%;

          }

          100% {

            left: 160%;

          }

        }

        /* =====================================================
           PROFILE HERO
        ===================================================== */

        .profile-hero {

          position: relative;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 25px;

          padding-bottom: 35px;

          border-bottom:
            1px
            solid
            #eeeeee;

          animation:
            heroReveal
            0.8s
            0.45s
            both;

        }

        @keyframes heroReveal {

          from {

            opacity: 0;

            transform:
              translateY(25px);

          }

          to {

            opacity: 1;

            transform:
              translateY(0);

          }

        }

        .hero-left {

          display: flex;

          align-items: center;

          gap: 25px;

          min-width: 0;

        }

        /* =====================================================
           AVATAR AREA
        ===================================================== */

        .avatar-area {

          position: relative;

          width: 120px;

          height: 120px;

          min-width: 120px;

          display: flex;

          align-items: center;

          justify-content: center;

        }

        .profile-avatar {

          position: relative;

          z-index: 5;

          width: 96px;

          height: 96px;

          border-radius: 50%;

          overflow: hidden;

          display: flex;

          align-items: center;

          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #f04a56,
              #b71f2e
            );

          color: #fff;

          font-size: 38px;

          font-weight: 850;

          border:
            5px
            solid
            #fff;

          box-shadow:
            0 12px 35px
            rgba(230,57,70,0.28);

          animation:
            avatarFloat
            4s
            ease-in-out
            infinite;

          transition:
            transform
            0.5s
            cubic-bezier(.2,.8,.2,1),
            box-shadow
            0.5s
            ease;

        }

        .avatar-area:hover .profile-avatar {

          transform:
            scale(1.08)
            rotate(3deg);

          box-shadow:
            0 18px 50px
            rgba(230,57,70,0.4);

        }

        @keyframes avatarFloat {

          0%,
          100% {

            transform:
              translateY(0);

          }

          50% {

            transform:
              translateY(-7px);

          }

        }

        .profile-avatar img {

          width: 100%;

          height: 100%;

          object-fit: cover;

          transition:
            transform
            0.7s
            ease;

        }

        .avatar-area:hover
        .profile-avatar img {

          transform:
            scale(1.12);

        }

        /* =====================================================
           AVATAR RINGS
        ===================================================== */

        .avatar-ring {

          position: absolute;

          border-radius: 50%;

          border:
            1px
            solid
            rgba(230,57,70,0.25);

          pointer-events: none;

        }

        .ring-one {

          width: 108px;

          height: 108px;

          animation:
            ringPulse
            2.8s
            ease-out
            infinite;

        }

        .ring-two {

          width: 118px;

          height: 118px;

          animation:
            ringPulse
            2.8s
            0.8s
            ease-out
            infinite;

        }

        .ring-three {

          width: 130px;

          height: 130px;

          animation:
            ringPulse
            2.8s
            1.6s
            ease-out
            infinite;

        }

        @keyframes ringPulse {

          0% {

            opacity: 0.7;

            transform:
              scale(0.88);

          }

          100% {

            opacity: 0;

            transform:
              scale(1.2);

          }

        }

        .avatar-glow {

          position: absolute;

          width: 100px;

          height: 100px;

          border-radius: 50%;

          background:
            rgba(230,57,70,0.16);

          filter:
            blur(18px);

          animation:
            glowPulse
            2.5s
            ease-in-out
            infinite;

        }

        @keyframes glowPulse {

          0%,
          100% {

            transform:
              scale(0.85);

            opacity: 0.45;

          }

          50% {

            transform:
              scale(1.2);

            opacity: 0.8;

          }

        }

        /* =====================================================
           VERIFIED
        ===================================================== */

        .verified-badge {

          position: absolute;

          z-index: 10;

          right: 5px;

          bottom: 7px;

          width: 28px;

          height: 28px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #e63946,
              #b51f2d
            );

          color: #fff;

          border:
            3px
            solid
            #fff;

          font-size: 10px;

          box-shadow:
            0 5px 15px
            rgba(230,57,70,0.3);

          animation:
            verifiedPop
            0.7s
            1s
            cubic-bezier(.2,1.5,.4,1)
            both;

        }

        @keyframes verifiedPop {

          from {

            opacity: 0;

            transform:
              scale(0)
              rotate(-90deg);

          }

          to {

            opacity: 1;

            transform:
              scale(1)
              rotate(0);

          }

        }

        /* =====================================================
           PROFILE NAME
        ===================================================== */

        .profile-name-area {

          min-width: 0;

        }

        .name-line {

          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 10px;

          margin-bottom: 9px;

        }

        .name-line h2 {

          margin: 0;

          font-size: 29px;

          font-weight: 850;

          color: #1d1d1d;

          letter-spacing:
            -0.7px;

        }

        .active-status {

          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding:
            5px
            10px;

          border-radius: 100px;

          color: #248842;

          background:
            #eef9f1;

          font-size: 10px;

          font-weight: 800;

        }

        .active-status span {

          width: 6px;

          height: 6px;

          border-radius: 50%;

          background: #35a853;

          box-shadow:
            0 0 0 0
            rgba(53,168,83,0.4);

          animation:
            activePulse
            2s
            infinite;

        }

        @keyframes activePulse {

          70% {

            box-shadow:
              0 0 0 7px
              rgba(53,168,83,0);

          }

          100% {

            box-shadow:
              0 0 0 0
              rgba(53,168,83,0);

          }

        }

        .email-line {

          display: flex;

          align-items: center;

          gap: 8px;

          color: #777;

          font-size: 14px;

          margin-bottom: 7px;

          max-width: 450px;

        }

        .email-line i {

          color:
            var(--primary);

        }

        .email-line span {

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }

        .member-line {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #999;

          font-size: 11px;

        }

        .member-line i {

          color: #43a85a;

        }

        /* =====================================================
           HERO BUTTON
        ===================================================== */

        .hero-edit-button {

          position: relative;

          overflow: hidden;

          display: inline-flex;

          align-items: center;

          gap: 10px;

          padding:
            13px
            16px;

          border:
            1px
            solid
            rgba(230,57,70,0.3);

          border-radius: 12px;

          background:
            #fff;

          color:
            var(--primary);

          font-size: 13px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform
            0.3s
            ease,
            box-shadow
            0.3s
            ease,
            background
            0.3s
            ease;

        }

        .hero-edit-button::before {

          content: "";

          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              110deg,
              transparent 30%,
              rgba(255,255,255,0.8) 50%,
              transparent 70%
            );

          transform:
            translateX(-120%);

          transition:
            transform
            0.6s
            ease;

        }

        .hero-edit-button:hover::before {

          transform:
            translateX(120%);

        }

        .hero-edit-button:hover {

          color: #fff;

          background:
            var(--primary);

          border-color:
            var(--primary);

          transform:
            translateY(-4px);

          box-shadow:
            0 12px 30px
            rgba(230,57,70,0.25);

        }

        .button-icon {

          transition:
            transform
            0.4s
            ease;

        }

        .hero-edit-button:hover
        .button-icon {

          transform:
            rotate(-10deg)
            scale(1.15);

        }

        .button-arrow {

          transition:
            transform
            0.3s
            ease;

        }

        .hero-edit-button:hover
        .button-arrow {

          transform:
            translateX(4px);

        }

        /* =====================================================
           SECTION HEADER
        ===================================================== */

        .section-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin:
            34px
            0
            18px;

        }

        .section-kicker {

          display: block;

          margin-bottom: 5px;

          color:
            var(--primary);

          font-size: 9px;

          font-weight: 850;

          letter-spacing: 2.5px;

        }

        .section-title-wrapper h3 {

          margin: 0;

          font-size: 21px;

          font-weight: 850;

          color: #202020;

        }

        .section-icon {

          width: 43px;

          height: 43px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          color:
            var(--primary);

          background:
            var(--primary-light);

          transition:
            transform
            0.4s
            ease;

        }

        .section-header:hover
        .section-icon {

          transform:
            rotate(8deg)
            scale(1.08);

        }

        /* =====================================================
           INFO GRID
        ===================================================== */

        .profile-info {

          display: grid;

          grid-template-columns:
            repeat(2,1fr);

          gap: 14px;

        }

        /* =====================================================
           INFO CARD
        ===================================================== */

        .info-card {

          position: relative;

          overflow: hidden;

          display: flex;

          align-items: center;

          gap: 15px;

          min-height: 78px;

          padding:
            15px
            17px;

          border:
            1px
            solid
            #ededed;

          border-radius: 14px;

          background:
            #fcfcfc;

          cursor: default;

          opacity: 0;

          animation:
            infoReveal
            0.7s
            cubic-bezier(.2,.8,.2,1)
            forwards;

          transition:
            transform
            0.35s
            cubic-bezier(.2,.8,.2,1),
            box-shadow
            0.35s
            ease,
            border-color
            0.35s
            ease,
            background
            0.35s
            ease;

        }

        @keyframes infoReveal {

          from {

            opacity: 0;

            transform:
              translateY(25px)
              scale(0.97);

          }

          to {

            opacity: 1;

            transform:
              translateY(0)
              scale(1);

          }

        }

        .info-card:hover {

          transform:
            translateY(-5px)
            scale(1.015);

          background:
            #fff;

          border-color:
            rgba(230,57,70,0.22);

          box-shadow:
            0 15px 35px
            rgba(0,0,0,0.07);

        }

        .info-card-glow {

          position: absolute;

          width: 80px;

          height: 80px;

          top: -35px;

          right: -35px;

          border-radius: 50%;

          background:
            rgba(230,57,70,0.08);

          transition:
            transform
            0.5s
            ease;

        }

        .info-card:hover
        .info-card-glow {

          transform:
            scale(2.5);

        }

        .info-icon {

          position: relative;

          z-index: 2;

          width: 45px;

          height: 45px;

          min-width: 45px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          color:
            var(--primary);

          background:
            var(--primary-light);

          transition:
            transform
            0.4s
            cubic-bezier(.2,1.5,.4,1),
            background
            0.3s
            ease;

        }

        .info-card:hover
        .info-icon {

          transform:
            rotate(-7deg)
            scale(1.1);

          background:
            var(--primary);

          color: #fff;

        }

        .info-content {

          position: relative;

          z-index: 2;

          min-width: 0;

        }

        .info-content span {

          display: block;

          color: #999;

          font-size: 10px;

          font-weight: 650;

          margin-bottom: 5px;

        }

        .info-content strong {

          display: block;

          color: #292929;

          font-size: 14px;

          font-weight: 800;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

        }

        .info-arrow {

          margin-left: auto;

          color: #d0d0d0;

          font-size: 10px;

          transition:
            transform
            0.3s
            ease,
            color
            0.3s
            ease;

        }

        .info-card:hover
        .info-arrow {

          color:
            var(--primary);

          transform:
            translateX(4px);

        }

        /* =====================================================
           ACTION SECTION
        ===================================================== */

        .actions-section {

          margin-top: 40px;

        }

        .profile-actions {

          display: grid;

          grid-template-columns:
            repeat(2,1fr);

          gap: 15px;

        }

        /* =====================================================
           ACTION CARD
        ===================================================== */

        .action-card {

          position: relative;

          overflow: hidden;

          display: flex;

          align-items: center;

          gap: 15px;

          min-height: 100px;

          padding:
            17px
            18px;

          border:
            1px
            solid
            #eeeeee;

          border-radius: 16px;

          background:
            #fff;

          text-align: left;

          cursor: pointer;

          transition:
            transform
            0.35s
            cubic-bezier(.2,.8,.2,1),
            box-shadow
            0.35s
            ease,
            border-color
            0.35s
            ease;

          animation:
            actionReveal
            0.7s
            cubic-bezier(.2,.8,.2,1)
            both;

        }

        .orders-card {

          animation-delay:
            0.55s;

        }

        .cart-card {

          animation-delay:
            0.65s;

        }

        .wishlist-card {

          animation-delay:
            0.75s;

        }

        .edit-card {

          animation-delay:
            0.85s;

        }

        @keyframes actionReveal {

          from {

            opacity: 0;

            transform:
              translateY(30px)
              scale(0.96);

          }

          to {

            opacity: 1;

            transform:
              translateY(0)
              scale(1);

          }

        }

        .action-card:hover {

          transform:
            translateY(-7px);

          border-color:
            rgba(230,57,70,0.2);

          box-shadow:
            0 18px 40px
            rgba(0,0,0,0.09);

        }

        .action-card.card-active {

          transform:
            scale(0.97);

        }

        .action-background {

          position: absolute;

          width: 150px;

          height: 150px;

          right: -80px;

          bottom: -80px;

          border-radius: 50%;

          background:
            rgba(230,57,70,0.05);

          transition:
            transform
            0.6s
            ease;

        }

        .action-card:hover
        .action-background {

          transform:
            scale(2.5);

        }

        .action-icon {

          position: relative;

          z-index: 2;

          width: 53px;

          height: 53px;

          min-width: 53px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 14px;

          color:
            var(--primary);

          background:
            var(--primary-light);

          font-size: 18px;

          transition:
            transform
            0.5s
            cubic-bezier(.2,1.5,.4,1),
            background
            0.3s
            ease,
            color
            0.3s
            ease;

        }

        .action-card:hover
        .action-icon {

          transform:
            rotate(-8deg)
            scale(1.13);

          background:
            var(--primary);

          color:
            #fff;

        }

        .cart-card:hover
        .action-icon i {

          animation:
            cartBounce
            0.65s
            ease;

        }

        .orders-card:hover
        .action-icon i {

          animation:
            boxShake
            0.65s
            ease;

        }

        .wishlist-card:hover
        .action-icon i {

          animation:
            heartBeat
            0.8s
            ease;

        }

        .edit-card:hover
        .action-icon i {

          animation:
            editRotate
            0.7s
            ease;

        }

        @keyframes cartBounce {

          0%,
          100% {
            transform:
              translateY(0);
          }

          40% {
            transform:
              translateY(-5px);
          }

          70% {
            transform:
              translateY(2px);
          }

        }

        @keyframes boxShake {

          0%,
          100% {
            transform:
              rotate(0);
          }

          25% {
            transform:
              rotate(-8deg);
          }

          75% {
            transform:
              rotate(8deg);
          }

        }

        @keyframes heartBeat {

          0%,
          100% {
            transform:
              scale(1);
          }

          25% {
            transform:
              scale(1.25);
          }

          50% {
            transform:
              scale(0.95);
          }

          75% {
            transform:
              scale(1.18);
          }

        }

        @keyframes editRotate {

          0% {
            transform:
              rotate(0);
          }

          50% {
            transform:
              rotate(-18deg);
          }

          100% {
            transform:
              rotate(0);
          }

        }

        .action-content {

          position: relative;

          z-index: 2;

          min-width: 0;

        }

        .action-small {

          display: block;

          color:
            var(--primary);

          font-size: 8px;

          font-weight: 850;

          letter-spacing: 1.7px;

          margin-bottom: 4px;

        }

        .action-content strong {

          display: block;

          color: #202020;

          font-size: 15px;

          font-weight: 850;

          margin-bottom: 4px;

        }

        .action-content p {

          margin: 0;

          color: #999;

          font-size: 11px;

        }

        .action-arrow {

          position: relative;

          z-index: 2;

          margin-left: auto;

          width: 32px;

          height: 32px;

          min-width: 32px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          color: #aaa;

          background: #f7f7f7;

          transition:
            transform
            0.35s
            ease,
            background
            0.35s
            ease,
            color
            0.35s
            ease;

        }

        .action-card:hover
        .action-arrow {

          transform:
            translateX(5px);

          color: #fff;

          background:
            var(--primary);

        }

        .action-shine {

          position: absolute;

          top: 0;

          left: -130%;

          width: 70%;

          height: 100%;

          transform:
            skewX(-18deg);

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.8),
              transparent
            );

          transition:
            left
            0.7s
            ease;

          pointer-events: none;

        }

        .action-card:hover
        .action-shine {

          left: 150%;

        }

        /* =====================================================
           BOTTOM ACTIONS
        ===================================================== */

        .bottom-actions {

          display: flex;

          justify-content: space-between;

          gap: 15px;

          margin-top: 32px;

          padding-top: 25px;

          border-top:
            1px
            solid
            #eeeeee;

        }

        .home-button,
        .logout-button {

          position: relative;

          overflow: hidden;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          min-height: 45px;

          padding:
            0
            18px;

          border-radius: 11px;

          font-size: 12px;

          font-weight: 800;

          cursor: pointer;

          transition:
            transform
            0.3s
            ease,
            box-shadow
            0.3s
            ease,
            background
            0.3s
            ease;

        }

        .home-button {

          color: #444;

          background: #fff;

          border:
            1px
            solid
            #ddd;

        }

        .home-button:hover {

          color:
            var(--primary);

          border-color:
            var(--primary);

          transform:
            translateY(-3px);

          box-shadow:
            0 8px 20px
            rgba(0,0,0,0.07);

        }

        .logout-button {

          color: #fff;

          background:
            #202020;

          border:
            1px
            solid
            #202020;

        }

        .logout-button:hover {

          background:
            var(--primary);

          border-color:
            var(--primary);

          transform:
            translateY(-3px);

          box-shadow:
            0 10px 25px
            rgba(230,57,70,0.25);

        }

        .bottom-button-icon {

          transition:
            transform
            0.35s
            ease;

        }

        .home-button:hover
        .bottom-button-icon {

          transform:
            translateY(-2px)
            rotate(-5deg);

        }

        .logout-button:hover
        .bottom-button-icon {

          transform:
            translateX(3px);

        }

        /* =====================================================
           SECURITY
        ===================================================== */

        .security-card {

          position: relative;

          display: flex;

          align-items: center;

          gap: 14px;

          margin-top: 18px;

          padding:
            15px
            18px;

          border:
            1px
            solid
            #e5eee7;

          border-radius: 14px;

          background:
            rgba(248,252,249,0.92);

          animation:
            securityReveal
            0.7s
            1s
            both;

          overflow: hidden;

        }

        @keyframes securityReveal {

          from {

            opacity: 0;

            transform:
              translateY(20px);

          }

          to {

            opacity: 1;

            transform:
              translateY(0);

          }

        }

        .security-icon {

          position: relative;

          width: 40px;

          height: 40px;

          min-width: 40px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 11px;

          color:
            #2c9347;

          background:
            #e7f6ea;

        }

        .security-pulse {

          position: absolute;

          left: 0;

          top: 0;

          width: 4px;

          height: 100%;

          background:
            #42a85a;

          animation:
            securityPulse
            2s
            ease-in-out
            infinite;

        }

        @keyframes securityPulse {

          0%,
          100% {

            opacity: 0.4;

          }

          50% {

            opacity: 1;

          }

        }

        .security-content {

          min-width: 0;

        }

        .security-content strong {

          display: block;

          color:
            #27763b;

          font-size: 12px;

          margin-bottom: 3px;

        }

        .security-content p {

          margin: 0;

          color:
            #7d8d80;

          font-size: 10px;

          line-height: 1.5;

        }

        .security-check {

          margin-left: auto;

          color:
            #42a85a;

          font-size: 18px;

          animation:
            checkFloat
            3s
            ease-in-out
            infinite;

        }

        @keyframes checkFloat {

          0%,
          100% {

            transform:
              scale(1);

          }

          50% {

            transform:
              scale(1.15);

          }

        }

        /* =====================================================
           LOGOUT ANIMATION
        ===================================================== */

        .logging-out .profile-card {

          animation:
            logoutAnimation
            0.7s
            ease
            forwards;

        }

        .logging-out .profile-header {

          animation:
            logoutHeader
            0.7s
            ease
            forwards;

        }

        @keyframes logoutAnimation {

          to {

            opacity: 0;

            transform:
              scale(0.95)
              translateY(20px);

            filter:
              blur(8px);

          }

        }

        @keyframes logoutHeader {

          to {

            opacity: 0;

            transform:
              translateY(-20px);

          }

        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 800px) {

          .profile-page {

            padding:
              60px
              15px
              80px;

          }

          .profile-card {

            padding:
              30px;

          }

          .profile-title {

            font-size:
              37px;

          }

          .hero-edit-button {

            padding:
              12px
              14px;

          }

        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 620px) {

          .profile-page {

            padding:
              40px
              12px
              60px;

          }

          .profile-header {

            margin-bottom:
              28px;

          }

          .profile-title {

            font-size:
              30px;

            letter-spacing:
              -0.8px;

          }

          .title-name {

            margin-left:
              6px;

          }

          .profile-subtitle {

            font-size:
              12px;

          }

          .profile-card {

            padding:
              22px
              16px;

            border-radius:
              20px;

          }

          .profile-hero {

            flex-direction:
              column;

            align-items:
              stretch;

            text-align:
              center;

          }

          .hero-left {

            flex-direction:
              column;

            gap:
              16px;

          }

          .avatar-area {

            margin:
              0
              auto;

          }

          .profile-name-area {

            width:
              100%;

          }

          .name-line {

            justify-content:
              center;

          }

          .name-line h2 {

            font-size:
              24px;

          }

          .email-line {

            justify-content:
              center;

            max-width:
              100%;

          }

          .member-line {

            justify-content:
              center;

          }

          .hero-edit-button {

            width:
              100%;

            justify-content:
              center;

          }

          .profile-info {

            grid-template-columns:
              1fr;

          }

          .profile-actions {

            grid-template-columns:
              1fr;

          }

          .section-title-wrapper h3 {

            font-size:
              18px;

          }

          .action-card {

            min-height:
              88px;

          }

          .bottom-actions {

            flex-direction:
              column;

          }

          .home-button,
          .logout-button {

            width:
              100%;

          }

          .security-card {

            align-items:
              flex-start;

          }

          .security-check {

            display:
              none;

          }

        }

        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 380px) {

          .profile-page {

            padding-left:
              9px;

            padding-right:
              9px;

          }

          .profile-card {

            padding:
              18px
              13px;

          }

          .profile-title {

            font-size:
              27px;

          }

          .profile-avatar {

            width:
              88px;

            height:
              88px;

          }

          .avatar-area {

            width:
              110px;

            height:
              110px;

            min-width:
              110px;

          }

          .profile-name h2 {

            font-size:
              21px;

          }

          .action-content p {

            font-size:
              10px;

          }

        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {

            animation-duration:
              0.01ms
              !important;

            animation-iteration-count:
              1
              !important;

            transition-duration:
              0.01ms
              !important;

            scroll-behavior:
              auto
              !important;

          }

        }

      `}</style>

    </section>
  );
};

export default Profile;