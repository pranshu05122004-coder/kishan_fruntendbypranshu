import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <section className="cart-page">

      <div className="cart-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="cart-header">

          <span className="cart-label">
            SHOPPING CART
          </span>

          <h1>
            My <span>Cart</span>
          </h1>

          <div className="cart-line"></div>

          <p>
            Review your products before checkout.
          </p>

        </div>

        {/* =====================================
            EMPTY CART
        ===================================== */}

        <div className="cart-card">

          <div className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>

          <h2>
            Your Cart is Empty
          </h2>

          <p>
            Looks like you haven't added any products
            to your cart yet.
          </p>

          <button
            type="button"
            className="cart-shop-btn"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-shopping-bag"></i>
            Continue Shopping
          </button>

        </div>

        {/* =====================================
            BACK TO PROFILE
        ===================================== */}

        <button
          type="button"
          className="cart-back-btn"
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

        .cart-page {
          min-height: 75vh;
          background: #f8f6f1;
          padding: 80px 20px;
        }

        .cart-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        /* HEADER */

        .cart-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .cart-label {
          display: inline-block;
          color: #e63946;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        .cart-header h1 {
          margin: 0;
          color: #222;
          font-size: 42px;
          font-weight: 700;
        }

        .cart-header h1 span {
          color: #e63946;
        }

        .cart-line {
          width: 60px;
          height: 3px;
          background: #e63946;
          margin: 18px auto;
        }

        .cart-header p {
          margin: 0;
          color: #777;
          font-size: 15px;
        }

        /* CARD */

        .cart-card {
          background: #fff;
          border-radius: 14px;
          padding: 70px 40px;
          text-align: center;

          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.08);

          border-top: 4px solid #e63946;
        }

        /* ICON */

        .cart-icon {
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

        .cart-card h2 {
          margin: 0 0 10px;
          color: #222;
          font-size: 28px;
        }

        .cart-card p {
          max-width: 450px;
          margin: 0 auto 30px;

          color: #777;
          font-size: 15px;
          line-height: 1.7;
        }

        /* SHOP BUTTON */

        .cart-shop-btn {
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

        .cart-shop-btn:hover {
          background: #c92f3b;
          transform: translateY(-1px);
        }

        .cart-shop-btn i {
          margin-right: 8px;
        }

        /* BACK BUTTON */

        .cart-back-btn {
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

        .cart-back-btn:hover {
          background: #f5f5f5;
        }

        .cart-back-btn i {
          margin-right: 7px;
        }

        /* MOBILE */

        @media (max-width: 600px) {

          .cart-page {
            padding: 50px 15px;
          }

          .cart-header h1 {
            font-size: 32px;
          }

          .cart-card {
            padding: 50px 20px;
          }

          .cart-card h2 {
            font-size: 24px;
          }

        }

      `}</style>

    </section>
  );
};

export default Cart;