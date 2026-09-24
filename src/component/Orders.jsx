import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // LOAD ORDERS
  // =====================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        console.log("🔑 Orders Token:", token);

        if (!token) {
          throw new Error(
            "Login session nahi mili. Please login again."
          );
        }

        // =====================================
        // GET ORDERS
        // =====================================

        const response = await fetch(
          "http://localhost:5001/api/orders",
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(
          "📦 Orders API Status:",
          response.status
        );

        console.log(
          "📦 Orders API Response:",
          data
        );

        // =====================================
        // ERROR
        // =====================================

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Orders load nahi ho pa rahe hain."
          );
        }

        // =====================================
        // ORDERS DATA
        // =====================================

        const fetchedOrders =
          data.orders ||
          data.data ||
          [];

        console.log(
          "✅ Fetched Orders:",
          fetchedOrders
        );

        setOrders(
          Array.isArray(fetchedOrders)
            ? fetchedOrders
            : []
        );
      } catch (err) {
        console.error(
          "❌ Orders Load Error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Orders load karte waqt error aa gaya."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // =====================================
  // FORMAT PRICE
  // =====================================

  const formatPrice = (price) => {
    const amount = Number(price) || 0;

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  // =====================================
  // STATUS CLASS
  // =====================================

  const getStatusClass = (status) => {
    const cleanStatus = String(
      status || "Pending"
    ).toLowerCase();

    if (
      cleanStatus.includes("deliver")
    ) {
      return "status-delivered";
    }

    if (
      cleanStatus.includes("cancel")
    ) {
      return "status-cancelled";
    }

    if (
      cleanStatus.includes("ship")
    ) {
      return "status-shipped";
    }

    if (
      cleanStatus.includes("confirm")
    ) {
      return "status-confirmed";
    }

    if (
      cleanStatus.includes("process")
    ) {
      return "status-processing";
    }

    return "status-pending";
  };

  // =====================================
  // GET ORDER ID
  // =====================================

  const getOrderId = (order) => {
    return (
      order.id ||
      order._id ||
      order.orderId
    );
  };

  // =====================================
  // GET ORDER NUMBER
  // =====================================

  const getOrderNumber = (order) => {
    return (
      order.orderNumber ||
      order.order_no ||
      order.orderNo ||
      `#${getOrderId(order) || "N/A"}`
    );
  };

  // =====================================
  // GET PRODUCT
  // =====================================

  const getProductName = (order) => {
    return (
      order.productName ||
      order.product?.name ||
      order.product?.productName ||
      order.items?.[0]?.productName ||
      order.items?.[0]?.product?.name ||
      "Product"
    );
  };

  const getProductImage = (order) => {
    return (
      order.productImage ||
      order.image ||
      order.product?.image ||
      order.items?.[0]?.image ||
      order.items?.[0]?.product?.image ||
      ""
    );
  };

  const getProductId = (order) => {
    return (
      order.productId ||
      order.product?.id ||
      order.items?.[0]?.productId ||
      order.items?.[0]?.product?.id
    );
  };

  // =====================================
  // GET QUANTITY
  // =====================================

  const getQuantity = (order) => {
    return (
      order.quantity ||
      order.items?.[0]?.quantity ||
      1
    );
  };

  // =====================================
  // GET TOTAL
  // =====================================

  const getTotal = (order) => {
    return (
      order.grandTotal ??
      order.totalAmount ??
      order.total ??
      order.amount ??
      0
    );
  };

  // =====================================
  // GET STATUS
  // =====================================

  const getStatus = (order) => {
    return (
      order.status ||
      order.orderStatus ||
      "Pending"
    );
  };

  // =====================================
  // GET PAYMENT
  // =====================================

  const getPaymentMethod = (order) => {
    return (
      order.paymentMethod ||
      order.payment?.method ||
      "COD"
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <section className="orders-page">
        <div className="orders-loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>

          <h2>
            Loading Your Orders...
          </h2>

          <p>
            Please wait while we fetch your orders.
          </p>
        </div>

        <style>{`

          * {
            box-sizing: border-box;
          }

          .orders-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 70px 20px;
          }

          .orders-loading {
            min-height: 500px;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            text-align: center;
          }

          .loading-spinner {
            width: 70px;
            height: 70px;

            border-radius: 50%;

            background: #fff0f1;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-bottom: 20px;
          }

          .loading-spinner i {
            color: #e63946;
            font-size: 30px;
          }

          .orders-loading h2 {
            color: #222;
            margin: 0 0 8px;
          }

          .orders-loading p {
            color: #888;
            margin: 0;
          }

        `}</style>
      </section>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <section className="orders-page">
        <div className="orders-error">

          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>

          <h2>
            Unable to Load Orders
          </h2>

          <p>
            {error}
          </p>

          <div className="error-actions">

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              <i className="fas fa-redo"></i>
              Try Again
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/products")
              }
            >
              <i className="fas fa-shopping-bag"></i>
              Continue Shopping
            </button>

          </div>
        </div>

        <style>{`

          .orders-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 70px 20px;
          }

          .orders-error {
            min-height: 500px;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            text-align: center;
          }

          .error-icon {
            width: 75px;
            height: 75px;

            border-radius: 50%;

            background: #fff0f1;
            color: #e63946;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 30px;

            margin-bottom: 20px;
          }

          .orders-error h2 {
            color: #222;
            margin: 0 0 10px;
          }

          .orders-error p {
            color: #777;
            margin: 0 0 25px;
            max-width: 500px;
          }

          .error-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .error-actions button {
            border: none;
            border-radius: 7px;

            padding: 12px 18px;

            background: #e63946;
            color: #fff;

            font-weight: 700;

            cursor: pointer;
          }

          .error-actions button i {
            margin-right: 7px;
          }

          .error-actions .secondary-btn {
            background: #222;
          }

        `}</style>
      </section>
    );
  }

  // =====================================
  // EMPTY ORDERS
  // =====================================

  if (orders.length === 0) {
    return (
      <section className="orders-page">

        <div className="orders-container">

          <div className="orders-header">
            <span>
              MY ACCOUNT
            </span>

            <h1>
              My <strong>Orders</strong>
            </h1>

            <div className="orders-line"></div>

            <p>
              Track and manage all your orders.
            </p>
          </div>

          <div className="empty-orders">

            <div className="empty-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will
              appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
            >
              <i className="fas fa-shopping-cart"></i>
              Start Shopping
            </button>

          </div>

        </div>

        <style>{`

          .orders-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 70px 20px;
          }

          .orders-container {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
          }

          .orders-header {
            text-align: center;
            margin-bottom: 40px;
          }

          .orders-header > span {
            color: #e63946;

            font-size: 12px;
            font-weight: 800;

            letter-spacing: 3px;
          }

          .orders-header h1 {
            color: #222;

            font-size: 40px;

            margin: 10px 0;
          }

          .orders-header h1 strong {
            color: #e63946;
          }

          .orders-line {
            width: 60px;
            height: 3px;

            background: #e63946;

            margin: 15px auto;
          }

          .orders-header p {
            color: #777;
            margin: 0;
          }

          .empty-orders {
            background: #fff;

            border: 1px solid #eee;

            border-radius: 12px;

            min-height: 400px;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            text-align: center;

            padding: 40px;

            box-shadow:
              0 8px 25px
              rgba(0, 0, 0, 0.05);
          }

          .empty-icon {
            width: 85px;
            height: 85px;

            border-radius: 50%;

            background: #fff0f1;
            color: #e63946;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 35px;

            margin-bottom: 20px;
          }

          .empty-orders h2 {
            color: #222;
            margin: 0 0 10px;
          }

          .empty-orders p {
            color: #888;

            max-width: 450px;

            line-height: 1.6;

            margin: 0 0 25px;
          }

          .empty-orders button {
            border: none;

            border-radius: 7px;

            background: #e63946;
            color: #fff;

            padding: 13px 22px;

            font-weight: 800;

            cursor: pointer;
          }

          .empty-orders button:hover {
            background: #c92f3b;
          }

          .empty-orders button i {
            margin-right: 8px;
          }

        `}</style>
      </section>
    );
  }

  // =====================================
  // MAIN ORDERS PAGE
  // =====================================

  return (
    <section className="orders-page">

      <div className="orders-container">

        {/* HEADER */}

        <div className="orders-header">

          <span>
            MY ACCOUNT
          </span>

          <h1>
            My <strong>Orders</strong>
          </h1>

          <div className="orders-line"></div>

          <p>
            Track and manage all your orders.
          </p>

        </div>

        {/* ORDER COUNT */}

        <div className="orders-topbar">

          <div>
            <strong>
              {orders.length}
            </strong>

            <span>
              {orders.length === 1
                ? " Order"
                : " Orders"}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            <i className="fas fa-plus"></i>
            New Order
          </button>

        </div>

        {/* ORDERS */}

        <div className="orders-list">

          {orders.map(
            (order, index) => {

              const orderId =
                getOrderId(order);

              const orderNumber =
                getOrderNumber(order);

              const productName =
                getProductName(order);

              const productImage =
                getProductImage(order);

              const productId =
                getProductId(order);

              const quantity =
                getQuantity(order);

              const total =
                getTotal(order);

              const status =
                getStatus(order);

              const paymentMethod =
                getPaymentMethod(order);

              const orderDate =
                order.createdAt ||
                order.created_at ||
                order.date ||
                order.orderDate;

              return (
                <div
                  className="order-card"
                  key={
                    orderId ||
                    `${orderNumber}-${index}`
                  }
                >

                  {/* ORDER TOP */}

                  <div className="order-card-header">

                    <div className="order-number">

                      <span>
                        ORDER
                      </span>

                      <strong>
                        {orderNumber}
                      </strong>

                    </div>

                    <div className="order-date">

                      <i className="far fa-calendar-alt"></i>

                      {formatDate(
                        orderDate
                      )}

                    </div>

                  </div>

                  {/* ORDER BODY */}

                  <div className="order-card-body">

                    {/* PRODUCT */}

                    <div
                      className={
                        productId
                          ? "order-product clickable"
                          : "order-product"
                      }
                      onClick={() => {
                        if (productId) {
                          navigate(
                            `/product/${productId}`
                          );
                        }
                      }}
                    >

                      <div className="order-product-image">

                        {productImage ? (
                          <img
                            src={
                              productImage
                            }
                            alt={
                              productName
                            }
                          />
                        ) : (
                          <div className="no-image">
                            <i className="fas fa-box"></i>
                          </div>
                        )}

                      </div>

                      <div className="order-product-info">

                        <span>
                          PRODUCT
                        </span>

                        <h3>
                          {productName}
                        </h3>

                        <p>
                          Quantity:{" "}
                          <strong>
                            {quantity}
                          </strong>
                        </p>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="order-status-section">

                      <span className="section-label">
                        STATUS
                      </span>

                      <span
                        className={`order-status ${getStatusClass(
                          status
                        )}`}
                      >
                        <i className="fas fa-circle"></i>

                        {status}
                      </span>

                    </div>

                    {/* PAYMENT */}

                    <div className="order-payment">

                      <span className="section-label">
                        PAYMENT
                      </span>

                      <strong>
                        <i className="fas fa-money-bill-wave"></i>

                        {paymentMethod}
                      </strong>

                    </div>

                    {/* TOTAL */}

                    <div className="order-total">

                      <span className="section-label">
                        TOTAL
                      </span>

                      <strong>
                        {formatPrice(total)}
                      </strong>

                    </div>

                  </div>

                  {/* ORDER FOOTER */}

                  <div className="order-card-footer">

                    <span>
                      <i className="fas fa-shield-alt"></i>

                      Secure Order
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (orderId) {
                          navigate(
                            `/orders/${orderId}`
                          );
                        }
                      }}
                      disabled={!orderId}
                    >
                      View Order

                      <i className="fas fa-arrow-right"></i>
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =====================================
          CSS
      ===================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .orders-page {
          min-height: 75vh;

          background: #f8f6f1;

          padding: 70px 20px;
        }

        .orders-container {
          width: 100%;

          max-width: 1100px;

          margin: 0 auto;
        }

        /* HEADER */

        .orders-header {
          text-align: center;

          margin-bottom: 35px;
        }

        .orders-header > span {
          color: #e63946;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 3px;
        }

        .orders-header h1 {
          color: #222;

          font-size: 40px;

          margin: 10px 0;
        }

        .orders-header h1 strong {
          color: #e63946;
        }

        .orders-line {
          width: 60px;

          height: 3px;

          background: #e63946;

          margin: 15px auto;
        }

        .orders-header p {
          color: #777;

          margin: 0;
        }

        /* TOP BAR */

        .orders-topbar {
          background: #fff;

          border: 1px solid #eee;

          border-radius: 10px;

          padding: 15px 18px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 18px;

          box-shadow:
            0 5px 18px
            rgba(0, 0, 0, 0.04);
        }

        .orders-topbar > div {
          color: #777;

          font-size: 13px;
        }

        .orders-topbar > div strong {
          color: #222;

          font-size: 20px;
        }

        .orders-topbar button {
          border: none;

          background: #e63946;

          color: #fff;

          padding: 10px 15px;

          border-radius: 6px;

          font-size: 12px;

          font-weight: 800;

          cursor: pointer;
        }

        .orders-topbar button:hover {
          background: #c92f3b;
        }

        .orders-topbar button i {
          margin-right: 6px;
        }

        /* ORDER LIST */

        .orders-list {
          display: flex;

          flex-direction: column;

          gap: 18px;
        }

        /* ORDER CARD */

        .order-card {
          background: #fff;

          border: 1px solid #eee;

          border-radius: 12px;

          overflow: hidden;

          box-shadow:
            0 8px 25px
            rgba(0, 0, 0, 0.05);

          transition: 0.2s;
        }

        .order-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 12px 30px
            rgba(0, 0, 0, 0.08);
        }

        /* CARD HEADER */

        .order-card-header {
          padding: 17px 20px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          border-bottom: 1px solid #eee;

          background: #fff;
        }

        .order-number {
          display: flex;

          flex-direction: column;

          gap: 3px;
        }

        .order-number span,
        .section-label {
          color: #999;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1.5px;
        }

        .order-number strong {
          color: #222;

          font-size: 14px;
        }

        .order-date {
          color: #888;

          font-size: 11px;
        }

        .order-date i {
          margin-right: 5px;

          color: #e63946;
        }

        /* CARD BODY */

        .order-card-body {
          padding: 20px;

          display: grid;

          grid-template-columns:
            minmax(250px, 2fr)
            minmax(120px, 0.8fr)
            minmax(120px, 0.8fr)
            minmax(100px, 0.7fr);

          gap: 20px;

          align-items: center;
        }

        /* PRODUCT */

        .order-product {
          display: flex;

          align-items: center;

          gap: 13px;

          min-width: 0;
        }

        .order-product.clickable {
          cursor: pointer;
        }

        .order-product-image {
          width: 72px;
          height: 72px;

          border-radius: 8px;

          overflow: hidden;

          background: #f4f4f4;

          flex-shrink: 0;
        }

        .order-product-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;

          display: flex;

          align-items: center;
          justify-content: center;

          color: #aaa;

          font-size: 22px;
        }

        .order-product-info {
          min-width: 0;
        }

        .order-product-info > span {
          color: #e63946;

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .order-product-info h3 {
          color: #222;

          font-size: 14px;

          margin: 5px 0;

          line-height: 1.4;
        }

        .order-product-info p {
          color: #888;

          font-size: 11px;

          margin: 0;
        }

        .order-product-info p strong {
          color: #444;
        }

        /* STATUS */

        .order-status-section,
        .order-payment,
        .order-total {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .order-status {
          width: fit-content;

          display: inline-flex;

          align-items: center;

          gap: 6px;

          padding: 6px 9px;

          border-radius: 20px;

          font-size: 10px;

          font-weight: 800;
        }

        .order-status i {
          font-size: 6px;
        }

        .status-pending {
          color: #a66a00;

          background: #fff6df;
        }

        .status-processing {
          color: #006bb3;

          background: #e8f5ff;
        }

        .status-confirmed {
          color: #18702e;

          background: #e9f8ed;
        }

        .status-shipped {
          color: #6042a5;

          background: #f0eaff;
        }

        .status-delivered {
          color: #18702e;

          background: #e3f8e9;
        }

        .status-cancelled {
          color: #b4232e;

          background: #ffe8ea;
        }

        /* PAYMENT */

        .order-payment strong {
          color: #333;

          font-size: 12px;

          font-weight: 700;
        }

        .order-payment strong i {
          color: #218838;

          margin-right: 5px;
        }

        /* TOTAL */

        .order-total strong {
          color: #e63946;

          font-size: 17px;
        }

        /* FOOTER */

        .order-card-footer {
          border-top: 1px solid #eee;

          padding: 13px 20px;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .order-card-footer > span {
          color: #888;

          font-size: 10px;

          font-weight: 600;
        }

        .order-card-footer > span i {
          color: #218838;

          margin-right: 5px;
        }

        .order-card-footer button {
          border: none;

          background: transparent;

          color: #e63946;

          font-size: 11px;

          font-weight: 800;

          cursor: pointer;
        }

        .order-card-footer button:hover:not(:disabled) {
          color: #c92f3b;
        }

        .order-card-footer button:disabled {
          color: #aaa;

          cursor: not-allowed;
        }

        .order-card-footer button i {
          margin-left: 6px;
        }

        /* MOBILE */

        @media (max-width: 800px) {

          .orders-page {
            padding: 45px 15px;
          }

          .orders-header h1 {
            font-size: 30px;
          }

          .order-card-body {
            grid-template-columns: 1fr 1fr;
          }

          .order-product {
            grid-column: 1 / -1;
          }

        }

        @media (max-width: 550px) {

          .orders-topbar {
            padding: 13px;
          }

          .orders-topbar button {
            padding: 9px 11px;
          }

          .order-card-header {
            padding: 15px;
          }

          .order-card-body {
            padding: 15px;

            grid-template-columns: 1fr;
          }

          .order-product {
            grid-column: auto;
          }

          .order-card-footer {
            padding: 12px 15px;
          }

        }

      `}</style>

    </section>
  );
};

export default Orders;
