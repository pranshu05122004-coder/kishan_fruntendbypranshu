import { useEffect, useState } from "react";
import SearchOverlay from "./SearchOverlay";
import "../assets/css/nav.css";
import { Link, useNavigate } from "react-router-dom";


function Mainnav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // ==========================================
  // CHECK LOGIN STATUS
  // ==========================================

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Dono hone chahiye
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
    // Page load par check
    checkLoginStatus();

    // Login / Logout ke baad
    window.addEventListener(
      "authChanged",
      checkLoginStatus
    );

    // Agar dusre tab se login/logout ho
    window.addEventListener(
      "storage",
      checkLoginStatus
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        checkLoginStatus
      );

      window.removeEventListener(
        "storage",
        checkLoginStatus
      );
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    // LocalStorage clear
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navbar immediately update
    setIsLoggedIn(false);

    // Other components ko inform
    window.dispatchEvent(
      new Event("authChanged")
    );

    alert("Logout successful!");

    // Login page par bhejo
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        id="nav"
      >
        <div className="container">

          {/* =====================================
              LOGO
          ===================================== */}

          <Link
            className="navbar-brand"
            to="/"
          >
            <div className="blogo">

              <div className="bico"></div>

              <div>
                <div className="bname">
                  Industrial
                  <span> Doctor</span>
                </div>

                <div className="bsub">
                  Industrial Automation Solutions
                </div>
              </div>

            </div>
          </Link>

          {/* =====================================
              MOBILE MENU BUTTON
          ===================================== */}

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navmenu"
            aria-controls="navmenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i
              className="fas fa-bars"
              style={{
                color: "var(--primary)",
                fontSize: "1.35rem",
              }}
            ></i>
          </button>

          {/* =====================================
              NAV MENU
          ===================================== */}

          <div
            className="collapse navbar-collapse"
            id="navmenu"
          >

            <ul className="navbar-nav mx-auto">

              {/* HOME */}

              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="/"
                >
                  Home
                </Link>
              </li>


              {/* ABOUT */}

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/#about"
                >
                  About
                </a>
              </li>


              {/* PRODUCTS */}

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/products"
                >
                  Products
                </Link>
              </li>


              {/* =====================================
                  CATEGORY
              ===================================== */}

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/category"
                >
                  Category
                </Link>
              </li>


              {/* VLOG */}

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/#chefs"
                >
                  Vlog
                </a>
              </li>


              {/* REVIEWS */}

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/#testimonials"
                >
                  Reviews
                </a>
              </li>


              {/* CONTACT */}

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/#contact-section"
                >
                  Contact
                </a>
              </li>


              {/* =====================================
                  USER NOT LOGGED IN
              ===================================== */}

              {!isLoggedIn && (
                <>
                  {/* SIGNUP */}

                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/register"
                    >
                      Signup
                    </Link>
                  </li>


                  {/* LOGIN */}

                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}


              {/* =====================================
                  USER LOGGED IN
              ===================================== */}

              {isLoggedIn && (
                <>
                  {/* PROFILE */}

                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/profile"
                    >
                      <i className="fas fa-user me-1"></i>
                      Profile
                    </Link>
                  </li>


                  {/* LOGOUT */}

                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link border-0 bg-transparent"
                      onClick={handleLogout}
                    >
                    </button>
                  </li>
                </>
              )}

            </ul>


            {/* =====================================
                RIGHT SIDE
            ===================================== */}

            <div className="d-flex align-items-center gap-1">

              {/* SEARCH */}

              <button
                type="button"
                id="navSearchBtn"
                title="Search"
                onClick={() =>
                  setSearchOpen(true)
                }
              >
                <i className="fas fa-search"></i>
              </button>


              {/* SHOP NOW */}

              <a
                href="/#menu"
                className="nav-link nav-cta"
              >
                <i className="fas fa-shopping-bag me-1"></i>
                Shop Now
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
        onClose={() =>
          setSearchOpen(false)
        }
      />
    </>
  );
}

export default Mainnav;
