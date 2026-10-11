import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5001/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/api/orders/${orderId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Invoice download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Kishan-Invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download invoice.");
    }
  };

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOrderId = (order) => {
    return order.id || order.order_id || order.orderId;
  };

  const getOrderNumber = (order) => {
    return (
      order.order_number ||
      order.orderNumber ||
      `KSN-${getOrderId(order)}`
    );
  };

  const getProductName = (order) => {
    return (
      order.product_name ||
      order.productName ||
      order.name ||
      order.items?.[0]?.product_name ||
      order.items?.[0]?.name ||
      "Product"
    );
  };

  const getProductImage = (order) => {
    return (
      order.product_image ||
      order.productImage ||
      order.image ||
      order.items?.[0]?.product_image ||
      order.items?.[0]?.image ||
      "/placeholder.png"
    );
  };

  const getProductId = (order) => {
    return (
      order.product_id ||
      order.productId ||
      order.items?.[0]?.product_id ||
      order.items?.[0]?.productId
    );
  };

  const getQuantity = (order) => {
    return (
      order.quantity ||
      order.qty ||
      order.items?.[0]?.quantity ||
      1
    );
  };

  const getTotal = (order) => {
    return (
      order.total ||
      order.total_amount ||
      order.totalAmount ||
      order.amount ||
      0
    );
  };

  const getStatus = (order) => {
    return (
      order.status ||
      order.order_status ||
      order.orderStatus ||
      "Processing"
    );
  };

  const getPaymentMethod = (order) => {
    return (
      order.payment_method ||
      order.paymentMethod ||
      "Online Payment"
    );
  };

  const statusKey = (status) => {
    const value = String(status).toLowerCase();

    if (value.includes("deliver")) return "delivered";
    if (value.includes("ship")) return "shipped";
    if (value.includes("cancel")) return "cancelled";
    if (value.includes("pack")) return "packed";

    return "processing";
  };

  const getProgress = (status) => {
    const key = statusKey(status);

    if (key === "delivered") return 100;
    if (key === "shipped") return 72;
    if (key === "packed") return 48;
    if (key === "cancelled") return 0;

    return 25;
  };

  const activeOrders = orders.filter(
    (order) =>
      !["delivered", "cancelled"].includes(
        statusKey(getStatus(order))
      )
  ).length;

  const deliveredOrders = orders.filter(
    (order) => statusKey(getStatus(order)) === "delivered"
  ).length;

  const copyOrderNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="kishan-orders">
        <div className="orders-bg-glow glow-one" />
        <div className="orders-bg-glow glow-two" />

        <div className="orders-loading">
          <div className="loading-orbit">
            <div className="loading-box">
              <i className="fas fa-box-open" />
            </div>
          </div>

          <h3>Preparing your orders</h3>
          <p>Just a moment...</p>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kishan-orders">
        <div className="orders-bg-glow glow-one" />
        <div className="orders-bg-glow glow-two" />

        <div className="orders-error">
          <div className="error-icon">
            <i className="fas fa-exclamation" />
          </div>

          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button onClick={fetchOrders}>
            <i className="fas fa-rotate-right" />
            Try Again
          </button>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="kishan-orders">
        <div className="orders-bg-glow glow-one" />
        <div className="orders-bg-glow glow-two" />

        <div className="empty-orders">
          <div className="empty-visual">
            <div className="empty-orbit orbit-a" />
            <div className="empty-orbit orbit-b" />

            <div className="empty-box">
              <i className="fas fa-bag-shopping" />
            </div>
          </div>

          <span className="eyebrow">ORDER CENTER</span>

          <h1>
            Nothing here.
            <br />
            <span>Yet.</span>
          </h1>

          <p>
            Your future purchases will appear here.
            Start exploring and find something you love.
          </p>

          <button onClick={() => navigate("/products")}>
            Explore Products
            <i className="fas fa-arrow-right" />
          </button>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="kishan-orders">
      <div className="orders-bg-grid" />

      <div className="orders-bg-glow glow-one" />
      <div className="orders-bg-glow glow-two" />

      <main className="orders-wrapper">

        {/* ================= HERO ================= */}

        <section className="orders-hero">

          <div className="hero-copy">

            <div className="hero-eyebrow">
              <span className="live-dot" />
              MY ACCOUNT
            </div>

            <h1>
              Your
              <span> orders.</span>
            </h1>

            <p>
              Everything you've bought,
              <br />
              all in one place.
            </p>

          </div>

          <div className="hero-counter">

            <div className="counter-ring">
              <div>
                <strong>{orders.length}</strong>
                <small>ORDERS</small>
              </div>
            </div>

            <div className="counter-label">
              <span>ORDER CENTER</span>
              <b>Everything looks good.</b>
            </div>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="order-stats">

          <div className="stat-card">
            <span className="stat-icon">
              <i className="fas fa-receipt" />
            </span>

            <div>
              <small>TOTAL ORDERS</small>
              <strong>{orders.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon active">
              <i className="fas fa-truck-fast" />
            </span>

            <div>
              <small>ON THE WAY</small>
              <strong>{activeOrders}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon delivered">
              <i className="fas fa-circle-check" />
            </span>

            <div>
              <small>DELIVERED</small>
              <strong>{deliveredOrders}</strong>
            </div>
          </div>

          <button
            className="refresh-orders"
            onClick={fetchOrders}
          >
            <i className="fas fa-rotate-right" />
            Refresh
          </button>

        </section>

        {/* ================= SECTION HEADER ================= */}

        <div className="journey-header">

          <div>
            <span>YOUR SHOPPING JOURNEY</span>
            <h2>Recent orders</h2>
          </div>

          <button
            className="new-order-btn"
            onClick={() => navigate("/products")}
          >
            New Order
            <i className="fas fa-arrow-up-right-from-square" />
          </button>

        </div>

        {/* ================= ORDERS ================= */}

        <section className="orders-list">

          {orders.map((order, index) => {

            const orderId = getOrderId(order);
            const orderNumber = getOrderNumber(order);
            const status = getStatus(order);
            const statusType = statusKey(status);
            const progress = getProgress(status);
            const productId = getProductId(order);

            return (
              <article
                className={`order-card ${statusType}`}
                key={orderId || index}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >

                {/* top glow */}

                <div className="card-light" />

                {/* CARD TOP */}

                <div className="order-card-top">

                  <div className="order-meta">

                    <div className="order-number">
                      <span>ORDER</span>

                      <strong>{orderNumber}</strong>

                      <button
                        onClick={() =>
                          copyOrderNumber(orderNumber)
                        }
                        title="Copy order number"
                      >
                        <i className="far fa-copy" />
                      </button>
                    </div>

                    <div className="order-date">
                      <i className="far fa-calendar" />
                      {formatDate(
                        order.created_at ||
                        order.createdAt ||
                        order.date
                      )}
                    </div>

                  </div>

                  <div className={`status-pill ${statusType}`}>
                    <span />
                    {status}
                  </div>

                </div>

                {/* PRODUCT AREA */}

                <div className="order-product">

                  <div className="product-stage">

                    <div className="product-glow" />

                    <img
                      src={getProductImage(order)}
                      alt={getProductName(order)}
                    />

                    <div className="quantity-badge">
                      ×{getQuantity(order)}
                    </div>

                  </div>

                  <div className="product-details">

                    <span className="product-label">
                      PRODUCT
                    </span>

                    <h3>
                      {getProductName(order)}
                    </h3>

                    <div className="product-info">

                      <span>
                        <i className="fas fa-box" />
                        Qty {getQuantity(order)}
                      </span>

                      <span>
                        <i className="fas fa-credit-card" />
                        {getPaymentMethod(order)}
                      </span>

                    </div>

                  </div>

                  <div className="product-price">
                    <small>TOTAL</small>
                    <strong>
                      {formatPrice(getTotal(order))}
                    </strong>
                  </div>

                </div>

                {/* JOURNEY */}

                <div className="order-journey">

                  <div className="journey-title">
                    <span>ORDER JOURNEY</span>

                    {statusType === "delivered" && (
                      <b>
                        <i className="fas fa-check" />
                        Complete
                      </b>
                    )}
                  </div>

                  <div className="journey-track">

                    <div
                      className="journey-progress"
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                    {[
                      ["confirmed", "Confirmed"],
                      ["packed", "Packed"],
                      ["shipped", "Shipped"],
                      ["delivered", "Delivered"],
                    ].map(([key, label], i) => {

                      const currentProgress = [
                        "processing",
                        "packed",
                        "shipped",
                        "delivered",
                      ];

                      const currentIndex =
                        currentProgress.indexOf(statusType);

                      const completed =
                        statusType !== "cancelled" &&
                        i <= currentIndex;

                      return (
                        <div
                          className={`journey-step ${
                            completed ? "completed" : ""
                          }`}
                          key={key}
                        >
                          <span className="step-dot">
                            {completed && (
                              <i className="fas fa-check" />
                            )}
                          </span>

                          <small>{label}</small>
                        </div>
                      );
                    })}

                  </div>

                </div>

                {/* FOOTER */}

                <div className="order-footer">

                  <div className="secure-order">
                    <i className="fas fa-shield-halved" />

                    <div>
                      <strong>Secure Order</strong>
                      <span>
                        Protected by Kishan
                      </span>
                    </div>
                  </div>

                  <div className="order-actions">

                    <button
                      className="invoice-btn"
                      onClick={() =>
                        downloadInvoice(orderId)
                      }
                    >
                      <i className="fas fa-file-arrow-down" />
                      Invoice
                    </button>

                    <button
                      className="view-order-btn"
                      onClick={() =>
                        navigate(`/orders/${orderId}`)
                      }
                    >
                      View Order
                      <i className="fas fa-arrow-right" />
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </section>

        {/* BOTTOM CTA */}

        <section className="orders-bottom">

          <div>
            <span>KEEP EXPLORING</span>
            <h2>Something else<br />caught your eye?</h2>
          </div>

          <button onClick={() => navigate("/products")}>
            Continue Shopping
            <i className="fas fa-arrow-right" />
          </button>

        </section>

      </main>

      <style>{styles}</style>
    </div>
  );
};

const styles = `
/* =====================================================
   KISHAN — PREMIUM ORDERS
===================================================== */

.kishan-orders {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 15% 10%,
      rgba(230,57,70,.08),
      transparent 28%
    ),
    radial-gradient(
      circle at 90% 50%,
      rgba(255,180,100,.08),
      transparent 25%
    ),
    #f7f7f5;
  color: #111;
  font-family: Inter, -apple-system, BlinkMacSystemFont,
    "SF Pro Display", "Segoe UI", sans-serif;
  padding: 55px 24px 100px;
}

.kishan-orders *,
.kishan-orders *::before,
.kishan-orders *::after {
  box-sizing: border-box;
}

.orders-wrapper {
  max-width: 1180px;
  margin: auto;
  position: relative;
  z-index: 2;
}

/* ================= BACKGROUND ================= */

.orders-bg-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: .32;
  background-image:
    linear-gradient(
      rgba(0,0,0,.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(0,0,0,.025) 1px,
      transparent 1px
    );
  background-size: 60px 60px;
  mask-image: linear-gradient(
    to bottom,
    black,
    transparent 85%
  );
}

.orders-bg-glow {
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: .12;
  pointer-events: none;
  animation: ambientMove 10s ease-in-out infinite alternate;
}

.glow-one {
  background: #e63946;
  top: -250px;
  left: -220px;
}

.glow-two {
  background: #ffb36b;
  right: -260px;
  top: 45%;
  animation-delay: -5s;
}

@keyframes ambientMove {
  from {
    transform: translate(0,0) scale(1);
  }
  to {
    transform: translate(70px,50px) scale(1.15);
  }
}

/* ================= HERO ================= */

.orders-hero {
  min-height: 330px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  padding: 40px 5px 55px;
}

.hero-eyebrow,
.hero-eyebrow span {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2.5px;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #777;
  margin-bottom: 22px;
}

.live-dot {
  width: 7px;
  height: 7px;
  background: #e63946;
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgba(230,57,70,.1);
  animation: livePulse 1.8s infinite;
}

@keyframes livePulse {
  50% {
    box-shadow: 0 0 0 9px rgba(230,57,70,0);
  }
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(58px, 8vw, 104px);
  line-height: .88;
  letter-spacing: -6px;
  font-weight: 800;
}

.hero-copy h1 span {
  display: block;
  color: #e63946;
}

.hero-copy p {
  margin: 30px 0 0;
  color: #777;
  font-size: 17px;
  line-height: 1.6;
}

.hero-counter {
  display: flex;
  align-items: center;
  gap: 22px;
}

.counter-ring {
  width: 175px;
  height: 175px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle,
      #fff 55%,
      transparent 56%
    ),
    conic-gradient(
      #e63946,
      #ffb36b,
      #e63946
    );
  animation: ringRotate 12s linear infinite;
  box-shadow:
    0 25px 70px rgba(0,0,0,.1);
}

.counter-ring > div {
  text-align: center;
  animation: ringCounter 12s linear infinite reverse;
}

.counter-ring strong {
  display: block;
  font-size: 48px;
  letter-spacing: -3px;
}

.counter-ring small {
  color: #999;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
}

@keyframes ringRotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ringCounter {
  to {
    transform: rotate(-360deg);
  }
}

.counter-label {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.counter-label span {
  font-size: 9px;
  color: #999;
  font-weight: 800;
  letter-spacing: 2px;
}

.counter-label b {
  font-size: 14px;
}

/* ================= STATS ================= */

.order-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 12px;
  margin-bottom: 90px;
}

.stat-card {
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(0,0,0,.07);
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  backdrop-filter: blur(15px);
  transition: .35s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(0,0,0,.07);
}

.stat-icon {
  width: 43px;
  height: 43px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: #f0f0ee;
}

.stat-icon.active {
  background: #fff0e5;
  color: #ef7b25;
}

.stat-icon.delivered {
  background: #eaf8ef;
  color: #219653;
}

.stat-card small {
  display: block;
  font-size: 8px;
  letter-spacing: 1.4px;
  color: #999;
  font-weight: 800;
}

.stat-card strong {
  display: block;
  font-size: 23px;
  margin-top: 3px;
}

.refresh-orders {
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 20px;
  padding: 0 22px;
  background: white;
  font-weight: 700;
  cursor: pointer;
  transition: .3s;
}

.refresh-orders:hover {
  background: #111;
  color: white;
  transform: translateY(-3px);
}

.refresh-orders i {
  margin-right: 8px;
}

/* ================= HEADER ================= */

.journey-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 25px;
}

.journey-header > div span,
.orders-bottom span {
  font-size: 9px;
  letter-spacing: 2px;
  color: #999;
  font-weight: 800;
}

.journey-header h2 {
  margin: 8px 0 0;
  font-size: 34px;
  letter-spacing: -1.5px;
}

.new-order-btn {
  border: 0;
  background: #111;
  color: white;
  border-radius: 50px;
  padding: 14px 20px;
  font-weight: 700;
  cursor: pointer;
  transition: .3s;
}

.new-order-btn:hover {
  background: #e63946;
  transform: translateY(-3px);
}

.new-order-btn i {
  margin-left: 10px;
}

/* ================= ORDER CARD ================= */

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.order-card {
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,.84);
  border: 1px solid rgba(0,0,0,.075);
  border-radius: 30px;
  padding: 25px;
  box-shadow:
    0 15px 50px rgba(0,0,0,.045);
  backdrop-filter: blur(20px);
  animation: cardReveal .7s cubic-bezier(.16,1,.3,1) both;
  transition:
    transform .45s cubic-bezier(.16,1,.3,1),
    box-shadow .45s ease;
}

.order-card:hover {
  transform: translateY(-7px);
  box-shadow:
    0 30px 80px rgba(0,0,0,.11);
}

.card-light {
  position: absolute;
  width: 350px;
  height: 350px;
  top: -250px;
  right: -120px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(230,57,70,.13),
    transparent 70%
  );
  pointer-events: none;
  transition: .6s;
}

.order-card:hover .card-light {
  transform: scale(1.5);
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ================= TOP ================= */

.order-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(0,0,0,.06);
}

.order-meta {
  display: flex;
  align-items: center;
  gap: 25px;
}

.order-number {
  display: flex;
  align-items: center;
  gap: 9px;
}

.order-number span,
.product-label,
.product-price small,
.journey-title span {
  color: #aaa;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.order-number strong {
  font-size: 13px;
}

.order-number button {
  border: 0;
  background: #f1f1ef;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  cursor: pointer;
  color: #777;
  transition: .25s;
}

.order-number button:hover {
  background: #111;
  color: white;
}

.order-date {
  color: #888;
  font-size: 12px;
}

.order-date i {
  margin-right: 7px;
}

.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 13px;
  border-radius: 50px;
  background: #fff7ec;
  color: #c46b15;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .5px;
}

.status-pill span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 5px rgba(196,107,21,.1);
  animation: statusPulse 1.7s infinite;
}

.status-pill.delivered {
  background: #eaf8ef;
  color: #219653;
}

.status-pill.shipped {
  background: #edf4ff;
  color: #3175d8;
}

.status-pill.cancelled {
  background: #fff0f0;
  color: #d93030;
}

@keyframes statusPulse {
  50% {
    box-shadow: 0 0 0 8px transparent;
  }
}

/* ================= PRODUCT ================= */

.order-product {
  display: grid;
  grid-template-columns: 145px 1fr auto;
  align-items: center;
  gap: 28px;
  padding: 28px 5px;
}

.product-stage {
  height: 135px;
  border-radius: 22px;
  background:
    radial-gradient(
      circle at 50% 45%,
      white,
      #f1f1ef
    );
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
}

.product-stage img {
  width: 85%;
  height: 85%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  transition: .5s cubic-bezier(.16,1,.3,1);
  filter: drop-shadow(0 15px 15px rgba(0,0,0,.13));
}

.order-card:hover .product-stage img {
  transform: scale(1.09) translateY(-4px);
}

.product-glow {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,.9);
  filter: blur(20px);
}

.quantity-badge {
  position: absolute;
  z-index: 3;
  right: 9px;
  bottom: 9px;
  background: #111;
  color: white;
  border-radius: 30px;
  padding: 5px 9px;
  font-size: 10px;
  font-weight: 800;
}

.product-details h3 {
  font-size: 23px;
  letter-spacing: -.7px;
  margin: 7px 0 15px;
}

.product-info {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.product-info span {
  color: #888;
  font-size: 11px;
}

.product-info i {
  margin-right: 6px;
  color: #aaa;
}

.product-price {
  text-align: right;
}

.product-price strong {
  display: block;
  font-size: 27px;
  margin-top: 7px;
  letter-spacing: -1px;
}

/* ================= JOURNEY ================= */

.order-journey {
  background: #f7f7f5;
  border-radius: 19px;
  padding: 20px 22px 17px;
}

.journey-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.journey-title b {
  font-size: 10px;
  color: #219653;
}

.journey-title b i {
  margin-right: 5px;
}

.journey-track {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.journey-track::before {
  content: "";
  position: absolute;
  top: 6px;
  left: 8px;
  right: 8px;
  height: 2px;
  background: #dededb;
}

.journey-progress {
  position: absolute;
  top: 6px;
  left: 8px;
  height: 2px;
  background: linear-gradient(
    90deg,
    #e63946,
    #ff8b5b
  );
  transition: width 1s cubic-bezier(.16,1,.3,1);
}

.journey-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.step-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ddd;
  border: 3px solid #f7f7f5;
  transition: .4s;
}

.journey-step.completed .step-dot {
  background: #e63946;
  box-shadow: 0 0 0 4px rgba(230,57,70,.1);
}

.journey-step small {
  font-size: 9px;
  color: #aaa;
}

.journey-step.completed small {
  color: #222;
  font-weight: 700;
}

/* ================= FOOTER ================= */

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 22px;
}

.secure-order {
  display: flex;
  align-items: center;
  gap: 10px;
}

.secure-order > i {
  width: 35px;
  height: 35px;
  border-radius: 11px;
  background: #edf8f1;
  color: #219653;
  display: grid;
  place-items: center;
}

.secure-order strong {
  display: block;
  font-size: 11px;
}

.secure-order span {
  display: block;
  color: #aaa;
  font-size: 9px;
  margin-top: 3px;
}

.order-actions {
  display: flex;
  gap: 9px;
}

.invoice-btn,
.view-order-btn {
  border-radius: 50px;
  padding: 12px 17px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  transition: .3s;
}

.invoice-btn {
  border: 1px solid #ddd;
  background: white;
}

.invoice-btn:hover {
  border-color: #111;
  transform: translateY(-2px);
}

.invoice-btn i {
  margin-right: 7px;
}

.view-order-btn {
  border: 0;
  background: #111;
  color: white;
}

.view-order-btn i {
  margin-left: 12px;
  transition: .3s;
}

.view-order-btn:hover {
  background: #e63946;
}

.view-order-btn:hover i {
  transform: translateX(4px);
}

/* ================= BOTTOM ================= */

.orders-bottom {
  margin-top: 100px;
  border-radius: 30px;
  padding: 55px;
  background: #111;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.orders-bottom::after {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  right: -160px;
  top: -190px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(230,57,70,.6),
    transparent 70%
  );
}

.orders-bottom h2 {
  position: relative;
  z-index: 2;
  font-size: 40px;
  line-height: 1;
  letter-spacing: -2px;
  margin: 12px 0 0;
}

.orders-bottom button {
  position: relative;
  z-index: 2;
  border: 0;
  background: white;
  color: #111;
  border-radius: 50px;
  padding: 16px 22px;
  font-weight: 800;
  cursor: pointer;
  transition: .3s;
}

.orders-bottom button:hover {
  background: #e63946;
  color: white;
  transform: translateY(-3px);
}

.orders-bottom button i {
  margin-left: 12px;
}

/* ================= LOADING ================= */

.orders-loading,
.orders-error,
.empty-orders {
  min-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  position: relative;
  z-index: 3;
}

.loading-orbit {
  width: 90px;
  height: 90px;
  border: 1px solid #ddd;
  border-top-color: #e63946;
  border-radius: 50%;
  display: grid;
  place-items: center;
  animation: spin 1.3s linear infinite;
}

.loading-box {
  width: 52px;
  height: 52px;
  background: white;
  border-radius: 17px;
  display: grid;
  place-items: center;
  color: #e63946;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.orders-loading h3 {
  margin: 25px 0 5px;
}

.orders-loading p,
.orders-error p {
  color: #999;
}

/* ================= ERROR ================= */

.error-icon {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background: #fff0f0;
  color: #e63946;
  display: grid;
  place-items: center;
  font-size: 24px;
  box-shadow: 0 0 0 15px rgba(230,57,70,.04);
}

.orders-error h2 {
  margin: 25px 0 5px;
}

.orders-error button,
.empty-orders button {
  border: 0;
  background: #111;
  color: white;
  padding: 14px 21px;
  border-radius: 50px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 18px;
}

.orders-error button i {
  margin-right: 8px;
}

/* ================= EMPTY ================= */

.empty-visual {
  width: 170px;
  height: 170px;
  position: relative;
  display: grid;
  place-items: center;
  margin-bottom: 25px;
}

.empty-box {
  width: 80px;
  height: 80px;
  border-radius: 25px;
  background: white;
  display: grid;
  place-items: center;
  font-size: 30px;
  color: #e63946;
  box-shadow: 0 20px 50px rgba(0,0,0,.1);
  animation: floatBox 3s ease-in-out infinite;
  z-index: 2;
}

@keyframes floatBox {
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

.empty-orbit {
  position: absolute;
  inset: 10px;
  border: 1px dashed #ccc;
  border-radius: 50%;
  animation: spin 10s linear infinite;
}

.orbit-b {
  inset: 30px;
  animation-duration: 7s;
  animation-direction: reverse;
}

.empty-orders .eyebrow {
  color: #999;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
}

.empty-orders h1 {
  font-size: 60px;
  line-height: .9;
  letter-spacing: -4px;
  margin: 15px 0;
}

.empty-orders h1 span {
  color: #e63946;
}

.empty-orders p {
  max-width: 420px;
  color: #888;
  line-height: 1.7;
}

/* ================= MOBILE ================= */

@media (max-width: 800px) {

  .kishan-orders {
    padding: 25px 15px 60px;
  }

  .orders-hero {
    min-height: auto;
    padding: 30px 0 45px;
    display: block;
  }

  .hero-copy h1 {
    font-size: 70px;
    letter-spacing: -4px;
  }

  .hero-counter {
    margin-top: 35px;
  }

  .counter-ring {
    width: 120px;
    height: 120px;
  }

  .counter-ring strong {
    font-size: 35px;
  }

  .order-stats {
    grid-template-columns: 1fr 1fr;
    margin-bottom: 55px;
  }

  .stat-card:last-of-type {
    grid-column: span 2;
  }

  .refresh-orders {
    min-height: 55px;
  }

  .journey-header {
    align-items: start;
    gap: 20px;
  }

  .journey-header h2 {
    font-size: 27px;
  }

  .new-order-btn {
    padding: 11px 14px;
    font-size: 10px;
  }

  .order-card {
    padding: 17px;
    border-radius: 23px;
  }

  .order-card-top {
    align-items: flex-start;
    gap: 15px;
  }

  .order-meta {
    display: block;
  }

  .order-date {
    margin-top: 8px;
  }

  .order-product {
    grid-template-columns: 95px 1fr;
    gap: 15px;
    padding: 20px 0;
  }

  .product-stage {
    width: 95px;
    height: 95px;
  }

  .product-details h3 {
    font-size: 17px;
  }

  .product-info {
    display: block;
  }

  .product-info span {
    display: block;
    margin-top: 6px;
  }

  .product-price {
    grid-column: 2;
    text-align: left;
    margin-top: -3px;
  }

  .product-price strong {
    font-size: 22px;
  }

  .order-journey {
    padding: 17px 12px;
  }

  .journey-step small {
    font-size: 7px;
  }

  .order-footer {
    display: block;
  }

  .order-actions {
    margin-top: 17px;
  }

  .invoice-btn,
  .view-order-btn {
    flex: 1;
    padding: 12px 8px;
  }

  .orders-bottom {
    margin-top: 60px;
    padding: 35px 25px;
    display: block;
  }

  .orders-bottom h2 {
    font-size: 32px;
  }

  .orders-bottom button {
    margin-top: 25px;
  }
}

@media (max-width: 480px) {

  .hero-copy h1 {
    font-size: 58px;
  }

  .order-stats {
    grid-template-columns: 1fr;
  }

  .stat-card:last-of-type {
    grid-column: auto;
  }

  .refresh-orders {
    width: 100%;
  }

  .journey-header {
    display: block;
  }

  .new-order-btn {
    margin-top: 15px;
  }

  .status-pill {
    font-size: 8px;
    padding: 7px 9px;
  }

  .order-number strong {
    font-size: 11px;
  }

  .order-product {
    grid-template-columns: 82px 1fr;
  }

  .product-stage {
    width: 82px;
    height: 82px;
  }

  .product-details h3 {
    font-size: 15px;
  }

  .order-actions {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
  }
}

@media (prefers-reduced-motion: reduce) {

  .kishan-orders *,
  .kishan-orders *::before,
  .kishan-orders *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;

export default Orders;