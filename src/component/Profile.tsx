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

  // =====================================
  // LOAD USER FROM LOCALSTORAGE
  // =====================================

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

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    setUser(null);

    alert("Logout successful! 👋");

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================
  // PROFILE DATA
  // =====================================

  const profile = user || {
    name: "Your Name",
    email: "your@email.com",
    phone: "Not added",
    id: 0,
  };

  return (
    <section className="profile-page">

      <div className="profile-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="profile-header">

          <span className="profile-label">
            MY ACCOUNT
          </span>

          <h1>
            My <span>Profile</span>
          </h1>

          <div className="profile-line"></div>

          <p>
            Welcome to your profile.
          </p>

        </div>

        {/* =====================================
            PROFILE CARD
        ===================================== */}

        <div className="profile-card">

          {/* =====================================
              PROFILE TOP
          ===================================== */}

          <div className="profile-top">

            {/* Avatar */}

            <div className="profile-avatar">

              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.name || "Profile"}
                />
              ) : (
                <span>
                  {(profile.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}

            </div>

            {/* Name */}

            <div className="profile-name">

              <h2>
                {profile.name}
              </h2>

              <p>
                <i className="fas fa-envelope"></i>
                {profile.email}
              </p>

            </div>

          </div>

          {/* =====================================
              PROFILE INFORMATION
          ===================================== */}

          <div className="profile-info">

            {/* Name */}

            <div className="info-item">

              <div className="info-icon">
                <i className="fas fa-user"></i>
              </div>

              <div>
                <span>
                  Full Name
                </span>

                <strong>
                  {profile.name}
                </strong>
              </div>

            </div>

            {/* Email */}

            <div className="info-item">

              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>

              <div>
                <span>
                  Email Address
                </span>

                <strong>
                  {profile.email}
                </strong>
              </div>

            </div>

            {/* Phone */}

            <div className="info-item">

              <div className="info-icon">
                <i className="fas fa-phone"></i>
              </div>

              <div>
                <span>
                  Phone Number
                </span>

                <strong>
                  {profile.phone || "Not added"}
                </strong>
              </div>

            </div>

            {/* Account ID */}

            <div className="info-item">

              <div className="info-icon">
                <i className="fas fa-id-card"></i>
              </div>

              <div>
                <span>
                  Account ID
                </span>

                <strong>
                  {profile.id
                    ? `#${profile.id}`
                    : "Not available"}
                </strong>
              </div>

            </div>

          </div>

          {/* =====================================
              BUTTONS
          ===================================== */}

          <div className="profile-actions">

            {/* EDIT PROFILE */}

            <button
              type="button"
              className="profile-btn edit-btn"
              onClick={() => {
                navigate("/edit-profile");
              }}
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>

            {/* ORDERS */}

            <button
              type="button"
              className="profile-btn orders-btn"
              onClick={() => {
                navigate("/orders");
              }}
            >
              <i className="fas fa-box"></i>
              Orders
            </button>

            {/* CART */}

            <button
              type="button"
              className="profile-btn cart-btn"
              onClick={() => {
                navigate("/cart");
              }}
            >
              <i className="fas fa-shopping-cart"></i>
              Cart
            </button>

            {/* WISHLIST */}

            <button
              type="button"
              className="profile-btn wishlist-btn"
              onClick={() => {
                navigate("/wishlist");
              }}
            >
              <i className="fas fa-heart"></i>
              Wishlist
            </button>

            {/* BACK HOME */}

            <button
              type="button"
              className="profile-btn home-btn"
              onClick={() => {
                navigate("/");
              }}
            >
              <i className="fas fa-home"></i>
              Back to Home
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              className="profile-btn logout-btn"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>

          </div>

        </div>

      </div>

      {/* ==========================================
          CSS
      ========================================== */}

      <style>{`

        .profile-page {
          min-height: 75vh;
          background: #f8f6f1;
          padding: 80px 20px;
        }

        .profile-container {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
        }

        /* HEADER */

        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-label {
          display: inline-block;
          color: #e63946;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        .profile-header h1 {
          margin: 0;
          color: #222;
          font-size: 42px;
          font-weight: 700;
        }

        .profile-header h1 span {
          color: #e63946;
        }

        .profile-line {
          width: 60px;
          height: 3px;
          background: #e63946;
          margin: 18px auto;
        }

        .profile-header p {
          margin: 0;
          color: #777;
          font-size: 15px;
        }

        /* CARD */

        .profile-card {
          background: #fff;
          border-radius: 14px;
          padding: 40px;
          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.08);
          border-top: 4px solid #e63946;
        }

        /* PROFILE TOP */

        .profile-top {
          display: flex;
          align-items: center;
          gap: 25px;
          padding-bottom: 30px;
          border-bottom: 1px solid #eee;
        }

        /* AVATAR */

        .profile-avatar {
          width: 110px;
          height: 110px;
          min-width: 110px;
          border-radius: 50%;
          overflow: hidden;

          background: #e63946;
          color: #fff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 44px;
          font-weight: 700;

          box-shadow:
            0 5px 18px rgba(230, 57, 70, 0.25);
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* NAME */

        .profile-name h2 {
          margin: 0 0 8px;
          color: #222;
          font-size: 28px;
        }

        .profile-name p {
          margin: 0;
          color: #777;
          font-size: 15px;
        }

        .profile-name p i {
          color: #e63946;
          margin-right: 8px;
        }

        /* INFO */

        .profile-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          padding: 30px 0;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 15px;

          padding: 18px;

          background: #fafafa;
          border: 1px solid #eee;
          border-radius: 8px;
        }

        .info-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;

          border-radius: 50%;

          background:
            rgba(230, 57, 70, 0.1);

          color: #e63946;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info-item span {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .info-item strong {
          display: block;
          color: #333;
          font-size: 15px;
          word-break: break-word;
        }

        /* BUTTONS */

        .profile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;

          padding-top: 25px;
          border-top: 1px solid #eee;
        }

        .profile-btn {
          padding: 13px 20px;

          border-radius: 6px;

          border: 1px solid #ddd;

          background: #fff;

          color: #444;

          font-size: 15px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.2s;
        }

        .profile-btn:hover {
          background: #f5f5f5;
          transform: translateY(-1px);
        }

        /* EDIT */

        .edit-btn {
          background: #e63946;
          color: #fff;
          border-color: #e63946;
        }

        .edit-btn:hover {
          background: #c92f3b;
          border-color: #c92f3b;
        }

        /* ORDERS */

        .orders-btn {
          background: #fff;
          color: #e63946;
          border-color: #e63946;
        }

        .orders-btn:hover {
          background: #e63946;
          color: #fff;
        }

        /* CART */

        .cart-btn {
          background: #fff;
          color: #e63946;
          border-color: #e63946;
        }

        .cart-btn:hover {
          background: #e63946;
          color: #fff;
        }

        /* WISHLIST */

        .wishlist-btn {
          background: #fff;
          color: #e63946;
          border-color: #e63946;
        }

        .wishlist-btn:hover {
          background: #e63946;
          color: #fff;
        }

        /* HOME */

        .home-btn {
          background: #fff;
          color: #444;
        }

        /* LOGOUT */

        .logout-btn {
          background: #222;
          color: #fff;
          border-color: #222;
        }

        .logout-btn:hover {
          background: #000;
          border-color: #000;
        }

        .profile-btn i {
          margin-right: 7px;
        }

        /* MOBILE */

        @media (max-width: 600px) {

          .profile-page {
            padding: 50px 15px;
          }

          .profile-header h1 {
            font-size: 32px;
          }

          .profile-card {
            padding: 25px 20px;
          }

          .profile-top {
            flex-direction: column;
            text-align: center;
          }

          .profile-name h2 {
            font-size: 24px;
          }

          .profile-info {
            grid-template-columns: 1fr;
          }

          .profile-actions {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </section>
  );
};

export default Profile;