
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();

  return (
    <section className="wishlist-page">

      <div className="wishlist-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="wishlist-header">

          <span className="wishlist-label">
            MY COLLECTION
          </span>

          <h1>
            My <span>Wishlist</span>
          </h1>

          <div className="wishlist-line"></div>

          <p>
            Save your favorite products for later.
          </p>

        </div>

        {/* =====================================
            EMPTY WISHLIST
        ===================================== */}

        <div className="wishlist-card">

          <div className="wishlist-icon">
            <i className="fas fa-heart"></i>
          </div>

          <h2>
            Your Wishlist is Empty
          </h2>

          <p>
            You haven't added any products to your
            wishlist yet. Explore our products and
            save your favorites here.
          </p>

          <button
            type="button"
            className="wishlist-shop-btn"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-shopping-bag"></i>
            Explore Products
          </button>

        </div>

        {/* =====================================
            BACK TO PROFILE
        ===================================== */}

        <button
          type="button"
          className="wishlist-back-btn"
          onClick={() => navigate("/profile")}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Profile
        </button>

      </div>

      {/* =====================================
          CSS
      ===================================== */}

      <style>{`

        .wishlist-page {
          min-height: 75vh;
          background: #f8f6f1;
          padding: 80px 20px;
        }

        .wishlist-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        /* HEADER */

        .wishlist-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .wishlist-label {
          display: inline-block;
          color: #e63946;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        .wishlist-header h1 {
          margin: 0;
          color: #222;
          font-size: 42px;
          font-weight: 700;
        }

        .wishlist-header h1 span {
          color: #e63946;
        }

        .wishlist-line {
          width: 60px;
          height: 3px;
          background: #e63946;
          margin: 18px auto;
        }

        .wishlist-header p {
          margin: 0;
          color: #777;
          font-size: 15px;
        }

        /* CARD */

        .wishlist-card {
          background: #fff;
          border-radius: 14px;
          padding: 70px 40px;
          text-align: center;

          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.08);

          border-top: 4px solid #e63946;
        }

        /* ICON */

        .wishlist-icon {
          width: 90px;
          height: 90px;
          margin: 0 auto 25px;

          border-radius: 50%;

          background: rgba(230, 57, 70, 0.1);
          color: #e63946;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 36px;
        }

        .wishlist-card h2 {
          margin: 0 0 10px;
          color: #222;
          font-size: 28px;
        }

        .wishlist-card p {
          max-width: 500px;
          margin: 0 auto 30px;

          color: #777;
          font-size: 15px;
          line-height: 1.7;
        }

        /* SHOP BUTTON */

        .wishlist-shop-btn {
          padding: 13px 25px;

          border: none;
          border-radius: 6px;

          background: #e63946;
          color: #fff;

          font-size: 15px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.2s;
        }

        .wishlist-shop-btn:hover {
          background: #c92f3b;
          transform: translateY(-1px);
        }

        .wishlist-shop-btn i {
          margin-right: 8px;
        }

        /* BACK BUTTON */

        .wishlist-back-btn {
          display: block;
          margin: 25px auto 0;

          padding: 12px 20px;

          border: 1px solid #ddd;
          border-radius: 6px;

          background: #fff;
          color: #444;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .wishlist-back-btn:hover {
          background: #f5f5f5;
        }

        .wishlist-back-btn i {
          margin-right: 7px;
        }

        /* MOBILE */

        @media (max-width: 600px) {

          .wishlist-page {
            padding: 50px 15px;
          }

          .wishlist-header h1 {
            font-size: 32px;
          }

          .wishlist-card {
            padding: 50px 20px;
          }

          .wishlist-card h2 {
            font-size: 24px;
          }

        }

      `}</style>

    </section>
  );
};

export default Wishlist;
