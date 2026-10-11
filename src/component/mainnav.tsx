import { useEffect, useState } from "react";
import SearchOverlay from "./SearchOverlay";
import "../assets/css/nav.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Mainnav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutAnimating, setLogoutAnimating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // CHECK LOGIN STATUS
  // ==========================================

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  // ==========================================
  // PAGE LOAD + AUTH CHANGE
  // ==========================================

  useEffect(() => {
    checkLoginStatus();

    window.addEventListener("authChanged", checkLoginStatus);
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("authChanged", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // ==========================================
  // SCROLL EFFECT
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU ON ROUTE CHANGE
  // ==========================================

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    setLogoutAnimating(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setIsLoggedIn(false);

      window.dispatchEvent(new Event("authChanged"));

      alert("Logout successful!");

      navigate("/login", {
        replace: true,
      });

      setLogoutAnimating(false);
    }, 350);
  };

  // ==========================================
  // ACTIVE ROUTE
  // ==========================================

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav
        className={`navbar navbar-expand-lg premium-navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
        id="nav"
      >
        {/* Animated background glow */}
        <div className="nav-glow nav-glow-one"></div>
        <div className="nav-glow nav-glow-two"></div>

        <div className="container nav-container">
          {/* =====================================
              LOGO
          ===================================== */}

          <Link
            className="navbar-brand premium-brand"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            <div className="blogo">
              {/* Logo icon */}
              <div className="bico-wrap">
                <div className="bico">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="logo-pulse"></div>
              </div>

              {/* Logo text */}
              <div className="brand-content">
                <div className="bname">
                  Industrial
                  <span> Doctor</span>
                </div>

                <div className="bsub">
                  <span className="sub-line"></span>
                  Industrial Automation Solutions
                </div>
              </div>
            </div>
          </Link>

          {/* =====================================
              MOBILE MENU BUTTON
          ===================================== */}

          <button
            className={`navbar-toggler premium-toggler ${
              menuOpen ? "toggler-active" : ""
            }`}
            type="button"
            aria-controls="navmenu"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* =====================================
              NAV MENU
          ===================================== */}

          <div
            className={`navbar-collapse premium-collapse ${
              menuOpen ? "mobile-menu-open" : ""
            }`}
            id="navmenu"
          >
            <ul className="navbar-nav mx-auto premium-nav-links">
              {/* HOME */}

              <li className="nav-item">
                <Link
                  className={`nav-link premium-nav-link ${
                    isActive("/") ? "active" : ""
                  }`}
                  to="/"
                >
                  <span className="nav-icon">
                    <i className="fas fa-home"></i>
                  </span>

                  <span>Home</span>

                  <span className="nav-line"></span>
                </Link>
              </li>

              {/* ABOUT */}

              <li className="nav-item">
                <a
                  className="nav-link premium-nav-link"
                  href="/#about"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <i className="fas fa-info-circle"></i>
                  </span>

                  <span>About</span>

                  <span className="nav-line"></span>
                </a>
              </li>

              {/* PRODUCTS */}

              <li className="nav-item">
                <Link
                  className={`nav-link premium-nav-link ${
                    isActive("/products") ? "active" : ""
                  }`}
                  to="/products"
                >
                  <span className="nav-icon">
                    <i className="fas fa-box-open"></i>
                  </span>

                  <span>Products</span>

                  <span className="nav-line"></span>
                </Link>
              </li>

              {/* CATEGORY */}

              <li className="nav-item">
                <Link
                  className={`nav-link premium-nav-link ${
                    isActive("/category") ? "active" : ""
                  }`}
                  to="/category"
                >
                  <span className="nav-icon">
                    <i className="fas fa-layer-group"></i>
                  </span>

                  <span>Category</span>

                  <span className="nav-line"></span>
                </Link>
              </li>

              {/* VLOG */}

              <li className="nav-item">
                <a
                  className="nav-link premium-nav-link"
                  href="/#chefs"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <i className="fas fa-play-circle"></i>
                  </span>

                  <span>Vlog</span>

                  <span className="nav-line"></span>
                </a>
              </li>

              {/* REVIEWS */}

              <li className="nav-item">
                <a
                  className="nav-link premium-nav-link"
                  href="/#testimonials"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <i className="fas fa-star"></i>
                  </span>

                  <span>Reviews</span>

                  <span className="nav-line"></span>
                </a>
              </li>

              {/* CONTACT */}

              <li className="nav-item">
                <a
                  className="nav-link premium-nav-link"
                  href="/#contact-section"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <i className="fas fa-phone-alt"></i>
                  </span>

                  <span>Contact</span>

                  <span className="nav-line"></span>
                </a>
              </li>

              {/* =====================================
                  NOT LOGGED IN
              ===================================== */}

              {!isLoggedIn && (
                <>
                  {/* SIGNUP */}

                  <li className="nav-item auth-item">
                    <Link
                      className={`nav-link premium-nav-link auth-link ${
                        isActive("/register") ? "active" : ""
                      }`}
                      to="/register"
                    >
                      <span className="nav-icon">
                        <i className="fas fa-user-plus"></i>
                      </span>

                      <span>Signup</span>

                      <span className="nav-line"></span>
                    </Link>
                  </li>

                  {/* LOGIN */}

                  <li className="nav-item">
                    <Link
                      className={`nav-link premium-login ${
                        isActive("/login") ? "active" : ""
                      }`}
                      to="/login"
                    >
                      <i className="fas fa-sign-in-alt"></i>

                      <span>Login</span>
                    </Link>
                  </li>
                </>
              )}

              {/* =====================================
                  LOGGED IN
              ===================================== */}

              {isLoggedIn && (
                <>
                  {/* PROFILE */}

                  <li className="nav-item">
                    <Link
                      className={`nav-link premium-profile ${
                        isActive("/profile") ? "active" : ""
                      }`}
                      to="/profile"
                    >
                      <span className="profile-icon">
                        <i className="fas fa-user"></i>
                      </span>

                      <span>Profile</span>
                    </Link>
                  </li>

                  {/* LOGOUT */}

                  <li className="nav-item">
                    <button
                      type="button"
                      className={`premium-logout ${
                        logoutAnimating ? "logout-active" : ""
                      }`}
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>

                      <span>Logout</span>
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* =====================================
                RIGHT SIDE
            ===================================== */}

            <div className="nav-actions">
              {/* SEARCH */}

              <button
                type="button"
                id="navSearchBtn"
                className="premium-search"
                title="Search products"
                onClick={() => {
                  setSearchOpen(true);
                  setMenuOpen(false);
                }}
              >
                <span className="search-ring"></span>

                <i className="fas fa-search"></i>
              </button>

              {/* SHOP NOW */}

              <a
                href="/#menu"
                className="premium-shop"
                onClick={() => setMenuOpen(false)}
              >
                <span className="shop-icon">
                  <i className="fas fa-shopping-bag"></i>
                </span>

                <span>Shop Now</span>

                <i className="fas fa-arrow-right shop-arrow"></i>

                <span className="shop-shine"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ==========================================
          SEARCH OVERLAY
      ========================================== */}

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ==========================================
          NAVBAR PREMIUM CSS
      ========================================== */}

      <style>{`
        /* ==========================================
           ROOT
        ========================================== */

        .premium-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
          min-height: 82px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(20, 43, 75, 0.08);
          transition:
            min-height 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease,
            transform 0.35s ease;
          overflow: visible;
        }

        .premium-navbar::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--primary, #c62828),
            #ffb300,
            var(--primary, #c62828),
            transparent
          );
          background-size: 200% 100%;
          animation: navGradient 5s linear infinite;
          opacity: 0.7;
        }

        .navbar-scrolled {
          min-height: 68px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow:
            0 10px 35px rgba(15, 35, 60, 0.10),
            0 2px 8px rgba(15, 35, 60, 0.04);
        }

        /* ==========================================
           BACKGROUND GLOWS
        ========================================== */

        .nav-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(30px);
          opacity: 0.18;
          animation: navGlow 8s ease-in-out infinite alternate;
        }

        .nav-glow-one {
          width: 180px;
          height: 80px;
          top: -50px;
          left: 18%;
          background: var(--primary, #c62828);
        }

        .nav-glow-two {
          width: 160px;
          height: 70px;
          right: 10%;
          top: -45px;
          background: #ffb300;
          animation-delay: -3s;
        }

        /* ==========================================
           CONTAINER
        ========================================== */

        .nav-container {
          position: relative;
          z-index: 2;
          min-height: inherit;
        }

        /* ==========================================
           LOGO
        ========================================== */

        .premium-brand {
          text-decoration: none;
          position: relative;
          z-index: 5;
        }

        .blogo {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .bico-wrap {
          width: 43px;
          height: 43px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bico {
          width: 39px;
          height: 39px;
          border-radius: 12px;
          background: linear-gradient(
            145deg,
            var(--primary, #c62828),
            #8f1717
          );
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          transform: rotate(-4deg);
          box-shadow:
            0 8px 18px rgba(198, 40, 40, 0.27),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .premium-brand:hover .bico {
          transform: rotate(0deg) scale(1.08);
          box-shadow:
            0 12px 25px rgba(198, 40, 40, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
        }

        .bico span {
          width: 3px;
          border-radius: 5px;
          background: white;
          display: block;
        }

        .bico span:nth-child(1) {
          height: 12px;
        }

        .bico span:nth-child(2) {
          height: 20px;
        }

        .bico span:nth-child(3) {
          height: 15px;
        }

        .logo-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 13px;
          border: 1px solid rgba(198, 40, 40, 0.25);
          animation: logoPulse 2.8s ease-out infinite;
        }

        .brand-content {
          line-height: 1;
        }

        .bname {
          font-size: 1.22rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #182638;
          white-space: nowrap;
        }

        .bname span {
          color: var(--primary, #c62828);
        }

        .bsub {
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.57rem;
          font-weight: 700;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          color: #7a8491;
          white-space: nowrap;
        }

        .sub-line {
          width: 14px;
          height: 2px;
          border-radius: 5px;
          background: #ffb300;
        }

        /* ==========================================
           NAV LINKS
        ========================================== */

        .premium-nav-links {
          gap: 2px;
          align-items: center;
        }

        .premium-nav-link {
          position: relative;
          display: flex !important;
          align-items: center;
          gap: 5px;
          padding: 9px 9px !important;
          margin: 0 1px;
          color: #536171 !important;
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.05px;
          border-radius: 10px;
          transition:
            color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }

        .premium-nav-link:hover {
          color: var(--primary, #c62828) !important;
          background: rgba(198, 40, 40, 0.055);
          transform: translateY(-2px);
        }

        .premium-nav-link.active {
          color: var(--primary, #c62828) !important;
          background: rgba(198, 40, 40, 0.065);
        }

        .nav-icon {
          font-size: 0.66rem;
          opacity: 0.55;
          transition:
            transform 0.25s ease,
            opacity 0.25s ease;
        }

        .premium-nav-link:hover .nav-icon,
        .premium-nav-link.active .nav-icon {
          opacity: 1;
          transform: translateY(-1px) scale(1.1);
        }

        .nav-line {
          position: absolute;
          left: 50%;
          bottom: 3px;
          width: 0;
          height: 2px;
          border-radius: 10px;
          background: linear-gradient(
            90deg,
            var(--primary, #c62828),
            #ffb300
          );
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .premium-nav-link:hover .nav-line,
        .premium-nav-link.active .nav-line {
          width: 25px;
        }

        /* ==========================================
           LOGIN
        ========================================== */

        .premium-login {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-left: 4px;
          padding: 9px 15px !important;
          border-radius: 11px;
          color: white !important;
          background: linear-gradient(
            135deg,
            var(--primary, #c62828),
            #9d1d1d
          );
          font-size: 0.81rem;
          font-weight: 800;
          box-shadow:
            0 7px 17px rgba(198, 40, 40, 0.20),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .premium-login:hover,
        .premium-login.active {
          color: white !important;
          transform: translateY(-2px);
          box-shadow:
            0 11px 24px rgba(198, 40, 40, 0.30),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .premium-login i {
          font-size: 0.72rem;
        }

        /* ==========================================
           PROFILE
        ========================================== */

        .premium-profile {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px !important;
          color: #bd2828 !important;
          font-size: 0.82rem;
          font-weight: 800;
          border-radius: 12px;
          transition: 0.25s ease;
        }

        .premium-profile:hover,
        .premium-profile.active {
          color: var(--primary, #c62828) !important;
          background: rgba(198, 40, 40, 0.06);
        }

        .profile-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--primary, #c62828);
          background: rgba(198, 40, 40, 0.09);
          transition: 0.3s ease;
        }

        .premium-profile:hover .profile-icon {
          transform: rotate(8deg) scale(1.08);
        }

        /* ==========================================
           LOGOUT
        ========================================== */

        .premium-logout {
          border: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          margin-left: 1px;
          border-radius: 9px;
          background: transparent;
          color: #7b8794;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .premium-logout:hover {
          color: #c62828;
          background: rgba(198, 40, 40, 0.06);
          transform: translateY(-1px);
        }

        .premium-logout.logout-active {
          transform: scale(0.92);
          opacity: 0.5;
        }

        /* ==========================================
           RIGHT ACTIONS
        ========================================== */

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 8px;
        }

        /* ==========================================
           SEARCH
        ========================================== */

        .premium-search {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(20, 43, 75, 0.09);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          color: #465566;
          background: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition:
            transform 0.3s ease,
            color 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .premium-search:hover {
          color: var(--primary, #c62828);
          border-color: rgba(198, 40, 40, 0.2);
          transform: translateY(-2px) rotate(2deg);
          box-shadow: 0 8px 18px rgba(20, 43, 75, 0.10);
        }

        .premium-search i {
          position: relative;
          z-index: 2;
          font-size: 0.82rem;
        }

        .search-ring {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary, #c62828);
          opacity: 0;
          transition: 0.3s ease;
        }

        .premium-search:hover .search-ring {
          width: 42px;
          height: 42px;
          opacity: 0.06;
        }

        /* ==========================================
           SHOP BUTTON
        ========================================== */

        .premium-shop {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 7px;
          min-height: 41px;
          padding: 0 14px;
          border-radius: 12px;
          color: white !important;
          text-decoration: none;
          background: linear-gradient(
            135deg,
            #cd2828,
            #e95c6f
          );
          font-size: 0.79rem;
          font-weight: 800;
          box-shadow:
            0 8px 20px rgba(24, 38, 56, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .premium-shop:hover {
          color: white !important;
          transform: translateY(-3px);
          box-shadow:
            0 13px 27px rgba(24, 38, 56, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .shop-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.12);
        }

        .shop-icon i {
          font-size: 0.68rem;
        }

        .shop-arrow {
          font-size: 0.62rem;
          transition: transform 0.3s ease;
        }

        .premium-shop:hover .shop-arrow {
          transform: translateX(4px);
        }

        .shop-shine {
          position: absolute;
          top: 0;
          left: -80%;
          width: 45%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.7s ease;
        }

        .premium-shop:hover .shop-shine {
          left: 130%;
        }

        /* ==========================================
           MOBILE TOGGLER
        ========================================== */

        .premium-toggler {
          width: 44px;
          height: 44px;
          padding: 0 !important;
          border: 1px solid rgba(20, 43, 75, 0.08) !important;
          border-radius: 12px;
          display: none;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 5px 15px rgba(20, 43, 75, 0.07);
        }

        .premium-toggler span {
          width: 19px;
          height: 2px;
          border-radius: 10px;
          background: #26384d;
          transition: 0.3s ease;
        }

        .premium-toggler.toggler-active span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .premium-toggler.toggler-active span:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }

        .premium-toggler.toggler-active span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ==========================================
           ANIMATIONS
        ========================================== */

        @keyframes navGradient {
          0% {
            background-position: 0% 50%;
          }

          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes navGlow {
          0% {
            transform: translateX(-20px) scale(0.9);
          }

          100% {
            transform: translateX(20px) scale(1.1);
          }
        }

        @keyframes logoPulse {
          0% {
            transform: scale(0.9);
            opacity: 0.55;
          }

          70%,
          100% {
            transform: scale(1.45);
            opacity: 0;
          }
        }

        /* ==========================================
           DESKTOP ENTRY ANIMATION
        ========================================== */

        @media (min-width: 992px) {
          .premium-brand {
            animation: navBrandIn 0.7s ease both;
          }

          .premium-nav-links .nav-item {
            animation: navItemIn 0.5s ease both;
          }

          .premium-nav-links .nav-item:nth-child(1) {
            animation-delay: 0.05s;
          }

          .premium-nav-links .nav-item:nth-child(2) {
            animation-delay: 0.08s;
          }

          .premium-nav-links .nav-item:nth-child(3) {
            animation-delay: 0.11s;
          }

          .premium-nav-links .nav-item:nth-child(4) {
            animation-delay: 0.14s;
          }

          .premium-nav-links .nav-item:nth-child(5) {
            animation-delay: 0.17s;
          }

          .premium-nav-links .nav-item:nth-child(6) {
            animation-delay: 0.20s;
          }

          .premium-nav-links .nav-item:nth-child(7) {
            animation-delay: 0.23s;
          }

          .premium-nav-links .nav-item:nth-child(8) {
            animation-delay: 0.26s;
          }

          .premium-nav-links .nav-item:nth-child(9) {
            animation-delay: 0.29s;
          }

          .nav-actions {
            animation: navActionsIn 0.6s ease 0.3s both;
          }
        }

        @keyframes navBrandIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes navItemIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes navActionsIn {
          from {
            opacity: 0;
            transform: translateX(15px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ==========================================
           TABLET
        ========================================== */

        @media (max-width: 1200px) {
          .premium-nav-link {
            padding-left: 7px !important;
            padding-right: 7px !important;
            font-size: 0.78rem;
          }

          .nav-icon {
            display: none;
          }

          .bsub {
            display: none;
          }

          .premium-shop {
            padding: 0 11px;
          }
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 991px) {
          .premium-navbar {
            min-height: 72px;
          }

          .navbar-scrolled {
            min-height: 66px;
          }

          .premium-toggler {
            display: flex;
          }

          .premium-collapse {
            position: absolute;
            left: 10px;
            right: 10px;
            top: calc(100% + 9px);
            padding: 12px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.97);
            backdrop-filter: blur(22px);
            -webkit-backdrop-filter: blur(22px);
            border: 1px solid rgba(141, 10, 10, 0.08);
            box-shadow:
              0 20px 50px rgba(15, 35, 60, 0.15),
              0 4px 15px rgba(15, 35, 60, 0.06);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-12px) scale(0.98);
            transform-origin: top;
            transition:
              opacity 0.3s ease,
              visibility 0.3s ease,
              transform 0.3s ease;
          }

          .premium-collapse.mobile-menu-open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
          }

          .premium-nav-links {
            align-items: stretch;
            width: 100%;
            gap: 3px;
          }

          .premium-nav-link {
            width: 100%;
            padding: 11px 13px !important;
            margin: 0 !important;
            font-size: 0.86rem;
            border-radius: 11px;
          }

          .nav-icon {
            display: inline-block;
            width: 21px;
            text-align: center;
          }

          .nav-line {
            display: none;
          }

          .premium-nav-link:hover {
            transform: translateX(4px);
          }

          .premium-login,
          .premium-profile,
          .premium-logout {
            margin-top: 4px;
            width: 100%;
            justify-content: center;
          }

          .nav-actions {
            margin: 10px 0 0;
            padding-top: 10px;
            border-top: 1px solid rgba(20, 43, 75, 0.08);
            justify-content: center;
          }

          .premium-search {
            flex: 1;
            width: auto;
          }

          .premium-shop {
            flex: 2;
            justify-content: center;
          }

          .nav-glow {
            opacity: 0.1;
          }
        }

        /* ==========================================
           SMALL MOBILE
        ========================================== */

        @media (max-width: 500px) {
          .premium-navbar {
            min-height: 67px;
          }

          .brand-content .bname {
            font-size: 1.05rem;
          }

          .bico-wrap {
            width: 38px;
            height: 38px;
          }

          .bico {
            width: 35px;
            height: 35px;
            border-radius: 10px;
          }

          .premium-toggler {
            width: 40px;
            height: 40px;
          }

          .premium-collapse {
            left: 7px;
            right: 7px;
          }
        }

        /* ==========================================
           REDUCED MOTION
        ========================================== */

        @media (prefers-reduced-motion: reduce) {
          .premium-navbar *,
          .premium-navbar,
          .nav-glow,
          .logo-pulse {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Mainnav;