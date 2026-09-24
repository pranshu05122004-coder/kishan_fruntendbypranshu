import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number | string;
  old_price?: number | string | null;
  image: string;
  stock: boolean | number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyName?: string | null;
  gstNumber?: string | null;
  address1?: string | null;
  address2?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("productId");
  const quantityParam =
    Number(searchParams.get("quantity")) || 1;

  // =====================================
  // PRODUCT
  // =====================================

  const [product, setProduct] =
    useState<Product | null>(null);

  const [quantity, setQuantity] = useState(
    quantityParam > 0 ? quantityParam : 1
  );

  const [productLoading, setProductLoading] =
    useState(true);

  const [productError, setProductError] =
    useState("");

  // =====================================
  // USER
  // =====================================

  const [user, setUser] =
    useState<User | null>(null);

  const [userLoading, setUserLoading] =
    useState(true);

  const [userError, setUserError] =
    useState("");


const [orderSuccess, setOrderSuccess] = useState(false);
const [createdOrder, setCreatedOrder] = useState<{
  id?: number | string;
  orderNumber?: string;
} | null>(null);


  // =====================================
  // ORDER LOADING
  // =====================================

  const [placingOrder, setPlacingOrder] =
    useState(false);

  // =====================================
  // CUSTOMER / SHIPPING FORM
  // =====================================

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",

    companyName: "",
    gstNumber: "",

    address1: "",
    address2: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    paymentMethod: "COD",
    notes: "",
  });

  // =====================================
  // LOAD PRODUCT
  // =====================================

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setProductError("Product ID missing.");
        setProductLoading(false);
        return;
      }

      try {
        setProductLoading(true);
        setProductError("");

        const response = await fetch(
          `http://localhost:5001/api/products/${productId}`
        );

        const data = await response.json();

        console.log(
          "📦 Product API Status:",
          response.status
        );

        console.log(
          "📦 Product API Data:",
          data
        );

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Product not found."
          );
        }

        const fetchedProduct =
          data.product || data.data;

        if (!fetchedProduct) {
          throw new Error(
            "Product information missing."
          );
        }

        setProduct(fetchedProduct);
      } catch (error) {
        console.error(
          "❌ Checkout Product Error:",
          error
        );

        setProductError(
          error instanceof Error
            ? error.message
            : "Product load nahi ho pa raha hai."
        );
      } finally {
        setProductLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // =====================================
  // LOAD LOGGED-IN USER
  // =====================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setUserLoading(true);
        setUserError("");

        // =====================================
        // TOKEN
        // =====================================

        const token =
          localStorage.getItem("token");

        console.log(
          "🔑 Checkout Token:",
          token
        );

        if (!token) {
          throw new Error(
            "Login token not found. Please login again."
          );
        }

        // =====================================
        // CURRENT USER API
        // =====================================

        const response = await fetch(
          "http://localhost:5001/api/users/me",
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
          "👤 /api/users/me Status:",
          response.status
        );

        console.log(
          "👤 User API Data:",
          data
        );

        // =====================================
        // CHECK RESPONSE
        // =====================================

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "User data not found."
          );
        }

        // =====================================
        // USER DATA
        // =====================================

        const fetchedUser: User =
          data.user || data.data;

        if (!fetchedUser) {
          throw new Error(
            "User information missing."
          );
        }

        console.log(
          "✅ Checkout User:",
          fetchedUser
        );

        setUser(fetchedUser);

        // =====================================
        // AUTO FILL USER DATA
        // =====================================

        setFormData((previous) => ({
          ...previous,

          fullName:
            fetchedUser.name || "",

          email:
            fetchedUser.email || "",

          mobile:
            fetchedUser.phone || "",

          companyName:
            fetchedUser.companyName || "",

          gstNumber:
            fetchedUser.gstNumber || "",

          address1:
            fetchedUser.address1 || "",

          address2:
            fetchedUser.address2 || "",

          area:
            fetchedUser.area || "",

          city:
            fetchedUser.city || "",

          state:
            fetchedUser.state || "",

          pincode:
            fetchedUser.pincode || "",

          country:
            fetchedUser.country || "India",
        }));
      } catch (error) {
        console.error(
          "❌ Checkout User Error:",
          error
        );

        setUser(null);

        setUserError(
          error instanceof Error
            ? error.message
            : "User details load nahi ho pa rahe hain."
        );
      } finally {
        setUserLoading(false);
      }
    };

    loadUser();
  }, []);

  // =====================================
  // FORM CHANGE
  // =====================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // QUANTITY
  // =====================================

  const increaseQuantity = () => {
    setQuantity(
      (previous) => previous + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity(
      (previous) =>
        previous > 1 ? previous - 1 : 1
    );
  };

  // =====================================
  // PRICE
  // =====================================

  const price = product
    ? Number(product.price)
    : 0;

  const oldPrice =
    product?.old_price !== null &&
    product?.old_price !== undefined
      ? Number(product.old_price)
      : null;

  const subtotal =
    price * quantity;

  // =====================================
  // SHIPPING
  // =====================================

  const shippingCharge =
    subtotal >= 50000 ? 0 : 500;

  // =====================================
  // DISCOUNT
  // =====================================

  const discount = 0;

  // =====================================
  // GRAND TOTAL
  // =====================================

  const grandTotal =
    subtotal +
    shippingCharge -
    discount;

  // =====================================
  // PLACE ORDER
  // =====================================

  const handlePlaceOrder = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // =====================================
    // PREVENT DOUBLE CLICK
    // =====================================

    if (placingOrder) {
      return;
    }

    // =====================================
    // PRODUCT CHECK
    // =====================================

    if (!product) {
      alert(
        "Product information missing."
      );
      return;
    }

    // =====================================
    // USER CHECK
    // =====================================

    if (!user) {
      alert(
        "User information load nahi hui. Please login again."
      );
      return;
    }

    // =====================================
    // REQUIRED VALIDATION
    // =====================================

    if (
      !formData.fullName.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.address1.trim() ||
      !formData.area.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      alert(
        "Please saari required details fill karein."
      );
      return;
    }

    // =====================================
    // MOBILE VALIDATION
    // =====================================

    const cleanMobile =
      formData.mobile.replace(/\D/g, "");

    if (
      !/^[0-9]{10}$/.test(
        cleanMobile
      )
    ) {
      alert(
        "Please valid 10 digit mobile number enter karein."
      );
      return;
    }

    // =====================================
    // PIN VALIDATION
    // =====================================

    const cleanPincode =
      formData.pincode.trim();

    if (
      !/^[0-9]{6}$/.test(
        cleanPincode
      )
    ) {
      alert(
        "Please valid 6 digit PIN code enter karein."
      );
      return;
    }

    // =====================================
    // PAYMENT CHECK
    // =====================================

    if (
      formData.paymentMethod !==
      "COD"
    ) {
      alert(
        "Currently only Cash on Delivery available hai."
      );
      return;
    }

    // =====================================
    // AUTH TOKEN
    // =====================================

    const token =
      localStorage.getItem("token");

    console.log(
      "🔑 Order Token:",
      token
    );

    if (!token) {
      alert(
        "Login session nahi mili. Please login again."
      );

      navigate("/login");
      return;
    }

    // =====================================
    // ORDER DATA
    // =====================================

    const orderData = {
      // USER
      userId: user.id,

      // PRODUCT
      productId: product.id,
      productName: product.name,

      // QUANTITY
      quantity: quantity,

      // PRICE
      pricePerItem: price,
      oldPrice: oldPrice,

      // AMOUNTS
      subtotal: subtotal,
      shippingCharge: shippingCharge,
      discount: discount,
      grandTotal: grandTotal,

      // CUSTOMER
      customer: {
        fullName:
          formData.fullName.trim(),

        mobile:
          cleanMobile,

        email:
          formData.email.trim(),

        companyName:
          formData.companyName.trim(),

        gstNumber:
          formData.gstNumber.trim(),
      },

      // SHIPPING ADDRESS
      shippingAddress: {
        address1:
          formData.address1.trim(),

        address2:
          formData.address2.trim(),

        area:
          formData.area.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        pincode:
          cleanPincode,

        country:
          formData.country || "India",
      },

      // PAYMENT
      paymentMethod:
        formData.paymentMethod,

      // NOTES
      notes:
        formData.notes.trim(),
    };

    console.log(
      "================================="
    );

    console.log(
      "📦 FINAL ORDER DATA:",
      orderData
    );

    console.log(
      "================================="
    );

    // =====================================
    // SEND ORDER TO BACKEND
    // =====================================

    try {
      setPlacingOrder(true);

      const response = await fetch(
        "http://localhost:5001/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(orderData),
        }
      );

      const data =
        await response.json();

      console.log(
        "📦 Order API Status:",
        response.status
      );

      console.log(
        "📦 Order API Response:",
        data
      );

      // =====================================
      // ERROR
      // =====================================

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Order place nahi ho pa raha hai."
        );
      }

      // =====================================
      // SUCCESS
      // =====================================

      console.log(
        "✅ ORDER SUCCESS:",
        data
      );

     const orderId =
  data.orderId ||
  data.order?.id ||
  data.data?.orderId ||
  data.data?.id;

const orderNumber =
  data.orderNumber ||
  data.order?.orderNumber ||
  data.data?.orderNumber;

console.log("✅ ORDER ID:", orderId);
console.log("✅ ORDER NUMBER:", orderNumber);

setCreatedOrder({
  id: orderId,
  orderNumber: orderNumber,
});

setOrderSuccess(true);

// Animation show hone do, phir Orders page
setTimeout(() => {
  navigate("/orders");
}, 2200);

      // =====================================
      // GO TO ORDERS
      // =====================================

      navigate("/orders");
    } catch (error) {
      console.error(
        "❌ Place Order Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Order place karte waqt error aa gaya."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (
    productLoading ||
    userLoading
  ) {
    return (
      <section className="checkout-page">
        <div className="checkout-loading">
          <i className="fas fa-spinner fa-spin"></i>

          <h2>
            Loading Checkout...
          </h2>

          <p>
            Product aur user details
            load ho rahi hain.
          </p>
        </div>

        <style>{`
          .checkout-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 70px 20px;
          }

          .checkout-loading {
            min-height: 500px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .checkout-loading i {
            color: #e63946;
            font-size: 42px;
            margin-bottom: 20px;
          }

          .checkout-loading h2 {
            color: #222;
            margin-bottom: 8px;
          }

          .checkout-loading p {
            color: #777;
          }
        `}</style>
      </section>
    );
  }

  // =====================================
  // PRODUCT ERROR
  // =====================================

  if (
    productError ||
    !product
  ) {
    return (
      <section className="checkout-page">
        <div className="checkout-error">
          <i className="fas fa-box-open"></i>

          <h2>
            Checkout Failed
          </h2>

          <p>
            {productError ||
              "Product not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            <i className="fas fa-arrow-left"></i>
            Back to Products
          </button>
        </div>

        <style>{`
          .checkout-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 70px 20px;
          }

          .checkout-error {
            min-height: 500px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .checkout-error > i {
            color: #e63946;
            font-size: 48px;
            margin-bottom: 18px;
          }

          .checkout-error h2 {
            color: #222;
            margin: 0 0 8px;
          }

          .checkout-error p {
            color: #777;
            margin-bottom: 20px;
          }

          .checkout-error button {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            background: #e63946;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
          }

          .checkout-error button i {
            margin-right: 7px;
          }
        `}</style>
      </section>
    );
  }

  // =====================================
  // USER ERROR
  // =====================================

  if (
    userError ||
    !user
  ) {
    return (
      <section className="checkout-page">
        <div className="checkout-error">
          <i className="fas fa-user-times"></i>

          <h2>
            User Details Not Found
          </h2>

          <p>
            {userError ||
              "Please login again."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            <i className="fas fa-sign-in-alt"></i>
            Login Again
          </button>
        </div>

        <style>{`
          .checkout-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 70px 20px;
          }

          .checkout-error {
            min-height: 500px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .checkout-error > i {
            color: #e63946;
            font-size: 48px;
            margin-bottom: 18px;
          }

          .checkout-error h2 {
            color: #222;
            margin: 0 0 8px;
          }

          .checkout-error p {
            color: #777;
            margin-bottom: 20px;
          }

          .checkout-error button {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            background: #e63946;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
          }

          .checkout-error button i {
            margin-right: 7px;
          }
        `}</style>
      </section>
    );
  }
// =====================================
// ORDER SUCCESS SCREEN
// =====================================

if (orderSuccess) {
  return (
    <section className="order-success-page">
      <div className="success-card">

        <div className="success-circle">
          <i className="fas fa-check"></i>
        </div>

        <h1>
          Order Placed!
        </h1>

        <p>
          Your order has been successfully placed.
        </p>

        {createdOrder?.orderNumber ? (
          <div className="success-order-number">
            Order #{createdOrder.orderNumber}
          </div>
        ) : createdOrder?.id ? (
          <div className="success-order-number">
            Order #{createdOrder.id}
          </div>
        ) : null}

        <div className="success-progress">
          <div className="success-progress-bar"></div>
        </div>

        <span className="success-redirect-text">
          Taking you to your orders...
        </span>

      </div>

      <style>{`
        .order-success-page {
          min-height: 75vh;
          background: #f8f6f1;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 40px 20px;

          animation:
            successPageIn
            0.4s ease;
        }

        .success-card {
          width: 100%;
          max-width: 500px;

          background: #fff;

          border-radius: 18px;

          padding: 50px 35px;

          text-align: center;

          box-shadow:
            0 20px 60px
            rgba(0, 0, 0, 0.10);

          animation:
            successCardIn
            0.6s
            cubic-bezier(
              0.175,
              0.885,
              0.32,
              1.275
            );
        }

        .success-circle {
          width: 90px;
          height: 90px;

          margin: 0 auto 25px;

          border-radius: 50%;

          background: #218838;

          color: #fff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 42px;

          animation:
            successCircleIn
            0.7s
            cubic-bezier(
              0.175,
              0.885,
              0.32,
              1.275
            );

          box-shadow:
            0 10px 30px
            rgba(33, 136, 56, 0.25);
        }

        .success-circle i {
          animation:
            checkIn
            0.45s
            0.35s
            both;
        }

        .success-card h1 {
          color: #222;

          font-size: 32px;

          margin:
            0 0 10px;

          animation:
            successTextIn
            0.5s
            0.25s
            both;
        }

        .success-card > p {
          color: #777;

          font-size: 14px;

          margin:
            0 0 20px;

          animation:
            successTextIn
            0.5s
            0.35s
            both;
        }

        .success-order-number {
          display: inline-block;

          padding:
            9px 16px;

          border-radius: 20px;

          background:
            #fff0f1;

          color:
            #e63946;

          font-size: 13px;

          font-weight: 800;

          margin-bottom: 25px;

          animation:
            successTextIn
            0.5s
            0.45s
            both;
        }

        .success-progress {
          width: 100%;

          height: 4px;

          background:
            #eeeeee;

          border-radius: 10px;

          overflow: hidden;

          margin-top: 5px;
        }

        .success-progress-bar {
          width: 0%;

          height: 100%;

          background:
            #e63946;

          border-radius: 10px;

          animation:
            successProgress
            2.1s
            linear
            forwards;
        }

        .success-redirect-text {
          display: block;

          color: #999;

          font-size: 11px;

          margin-top: 12px;
        }

        @keyframes successPageIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes successCardIn {
          from {
            opacity: 0;
            transform:
              translateY(30px)
              scale(0.92);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes successCircleIn {
          from {
            transform:
              scale(0);
            opacity: 0;
          }

          to {
            transform:
              scale(1);
            opacity: 1;
          }
        }

        @keyframes checkIn {
          from {
            transform:
              scale(0)
              rotate(-45deg);
            opacity: 0;
          }

          to {
            transform:
              scale(1)
              rotate(0);
            opacity: 1;
          }
        }

        @keyframes successTextIn {
          from {
            opacity: 0;
            transform:
              translateY(10px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        @keyframes successProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        @media (max-width: 600px) {

          .order-success-page {
            padding:
              25px 15px;
          }

          .success-card {
            padding:
              40px 22px;
          }

          .success-circle {
            width: 78px;
            height: 78px;

            font-size: 34px;
          }

          .success-card h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}

  // =====================================
  // MAIN CHECKOUT
  // =====================================

  return (
    <section className="checkout-page">
      <div className="checkout-container">

        {/* HEADER */}

        <div className="checkout-header">
          <span>
            SECURE CHECKOUT
          </span>

          <h1>
            Complete Your{" "}
            <strong>
              Order
            </strong>
          </h1>

          <div className="checkout-line"></div>

          <p>
            Please confirm your details
            and delivery information.
          </p>
        </div>

        {/* CHECKOUT FORM */}

        <form
          className="checkout-grid"
          onSubmit={handlePlaceOrder}
        >

          {/* =====================================
              LEFT
          ===================================== */}

          <div className="checkout-left">

            {/* CUSTOMER DETAILS */}

            <div className="checkout-card">

              <div className="card-title">
                <div className="title-icon">
                  <i className="fas fa-user"></i>
                </div>

                <div>
                  <h2>
                    Customer Details
                  </h2>

                  <p>
                    Your registered account
                    information
                  </p>
                </div>
              </div>

              <div className="form-grid">

                {/* NAME */}

                <div className="form-group">
                  <label>
                    Full Name{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    readOnly
                    className="database-field"
                  />

                  <small className="database-note">
                    <i className="fas fa-database"></i>
                    Saved from your account
                  </small>
                </div>

                {/* MOBILE */}

                <div className="form-group">
                  <label>
                    Mobile Number{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={
                      formData.mobile
                    }
                    readOnly
                    className="database-field"
                  />

                  <small className="database-note">
                    <i className="fas fa-database"></i>
                    Saved from your account
                  </small>
                </div>

                {/* EMAIL */}

                <div className="form-group">
                  <label>
                    Email Address{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    readOnly
                    className="database-field"
                  />

                  <small className="database-note">
                    <i className="fas fa-database"></i>
                    Saved from your account
                  </small>
                </div>

                {/* COMPANY */}

                <div className="form-group">
                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={
                      formData.companyName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Company / Business name"
                  />
                </div>

                {/* GST */}

                <div className="form-group full-width">
                  <label>
                    GST Number
                  </label>

                  <input
                    type="text"
                    name="gstNumber"
                    value={
                      formData.gstNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Optional"
                  />
                </div>

              </div>
            </div>

            {/* SHIPPING ADDRESS */}

            <div className="checkout-card">

              <div className="card-title">
                <div className="title-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>

                <div>
                  <h2>
                    Shipping Address
                  </h2>

                  <p>
                    Where should we deliver
                    your order?
                  </p>
                </div>
              </div>

              <div className="form-grid">

                {/* ADDRESS 1 */}

                <div className="form-group full-width">
                  <label>
                    Address Line 1{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="address1"
                    value={
                      formData.address1
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House / Flat / Plot number, Street"
                    required
                  />
                </div>

                {/* ADDRESS 2 */}

                <div className="form-group full-width">
                  <label>
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    name="address2"
                    value={
                      formData.address2
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Building, landmark etc. (optional)"
                  />
                </div>

                {/* AREA */}

                <div className="form-group">
                  <label>
                    Area / Locality{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="area"
                    value={
                      formData.area
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Area / Locality"
                    required
                  />
                </div>

                {/* CITY */}

                <div className="form-group">
                  <label>
                    City{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    required
                  />
                </div>

                {/* STATE */}

                <div className="form-group">
                  <label>
                    State{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                    required
                  />
                </div>

                {/* PIN */}

                <div className="form-group">
                  <label>
                    PIN Code{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="6 digit PIN"
                    maxLength={6}
                    required
                  />
                </div>

                {/* COUNTRY */}

                <div className="form-group full-width">
                  <label>
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={
                      formData.country
                    }
                    readOnly
                    className="database-field"
                  />
                </div>

              </div>
            </div>

            {/* PAYMENT */}

            <div className="checkout-card">

              <div className="card-title">
                <div className="title-icon">
                  <i className="fas fa-credit-card"></i>
                </div>

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Select your preferred
                    payment method
                  </p>
                </div>
              </div>

              <div className="payment-options">

                {/* COD */}

                <label
                  className={
                    formData.paymentMethod ===
                    "COD"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      formData.paymentMethod ===
                      "COD"
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <div className="payment-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order
                      arrives
                    </small>
                  </div>
                </label>

                {/* ONLINE PAYMENT */}

                <label className="payment-option payment-option-disabled">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    disabled
                  />

                  <div className="payment-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>

                  <div className="payment-content">
                    <strong>
                      Online Payment
                    </strong>

                    <small>
                      UPI / Card / Net Banking
                    </small>

                    <span className="payment-unavailable">
                      <i className="fas fa-clock"></i>
                      Currently Unavailable
                    </span>
                  </div>

                </label>

              </div>
            </div>

            {/* ORDER NOTES */}

            <div className="checkout-card">

              <div className="card-title">
                <div className="title-icon">
                  <i className="fas fa-comment-alt"></i>
                </div>

                <div>
                  <h2>
                    Order Notes
                  </h2>

                  <p>
                    Any special instructions?
                  </p>
                </div>
              </div>

              <div className="form-group">
                <textarea
                  name="notes"
                  value={
                    formData.notes
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Please call before delivery..."
                  rows={5}
                ></textarea>
              </div>

            </div>

          </div>

          {/* =====================================
              RIGHT
          ===================================== */}

          <div className="checkout-right">

            <div className="order-summary">

              {/* HEADER */}

              <div className="summary-header">
                <h2>
                  Order Summary
                </h2>

                <span>
                  1 Product
                </span>
              </div>

              {/* PRODUCT */}

              <div className="summary-product">

                <div className="summary-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="summary-product-info">

                  <span>
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    Qty: {quantity}
                  </p>

                </div>

              </div>

              {/* PRICE PER ITEM */}

              <div className="summary-single-price">

                <span>
                  Price per item
                </span>

                <div>

                  {oldPrice !== null &&
                    oldPrice > price && (
                      <del>
                        ₹
                        {oldPrice.toLocaleString(
                          "en-IN"
                        )}
                      </del>
                    )}

                  <strong>
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

              {/* QUANTITY */}

              <div className="summary-quantity">

                <span>
                  Quantity
                </span>

                <div className="summary-quantity-box">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      placingOrder
                    }
                  >
                    −
                  </button>

                  <strong>
                    {quantity}
                  </strong>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      placingOrder
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              {/* PRICE DETAILS */}

              <div className="price-details">

                <div>
                  <span>
                    Price per item
                  </span>

                  <strong>
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Quantity
                  </span>

                  <strong>
                    × {quantity}
                  </strong>
                </div>

                <div>
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Shipping
                  </span>

                  <strong
                    className={
                      shippingCharge === 0
                        ? "free-shipping"
                        : ""
                    }
                  >
                    {shippingCharge === 0
                      ? "FREE"
                      : `₹${shippingCharge.toLocaleString(
                          "en-IN"
                        )}`}
                  </strong>
                </div>

                {discount > 0 && (
                  <div>
                    <span>
                      Discount
                    </span>

                    <strong className="discount">
                      - ₹
                      {discount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                )}

              </div>

              {/* TOTAL */}

              <div className="grand-total">

                <span>
                  Grand Total
                </span>

                <strong>
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              {/* PLACE ORDER */}
<button
  type="submit"
  className="place-order-btn"
  disabled={placingOrder}
>
  {placingOrder ? (
    <>
      <i className="fas fa-spinner fa-spin"></i>
      Placing Order...
    </>
  ) : (
    <>
      <i className="fas fa-lock"></i>
      Place Order
      <i className="fas fa-arrow-right"></i>
    </>
  )}
</button>


              {/* SECURITY */}

              <p className="secure-text">

                <i className="fas fa-shield-alt"></i>

                Your information is secure.

              </p>

              {/* BACK */}

              <button
                type="button"
                className="continue-shopping"
                onClick={() =>
                  navigate(
                    `/product/${product.id}`
                  )
                }
                disabled={
                  placingOrder
                }
              >

                <i className="fas fa-arrow-left"></i>

                Back to Product

              </button>

            </div>

          </div>

        </form>

      </div>

      {/* =====================================
          CSS
      ===================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .checkout-page {
          min-height: 75vh;
          background: #f8f6f1;
          padding: 70px 20px;
        }

        .checkout-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HEADER */

        .checkout-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .checkout-header > span {
          color: #e63946;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .checkout-header h1 {
          color: #222;
          font-size: 40px;
          margin: 10px 0;
        }

        .checkout-header h1 strong {
          color: #e63946;
        }

        .checkout-line {
          width: 60px;
          height: 3px;
          background: #e63946;
          margin: 15px auto;
        }

        .checkout-header p {
          color: #777;
          margin: 0;
        }

        /* GRID */

        .checkout-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1.7fr)
            minmax(320px, 0.9fr);

          gap: 25px;

          align-items: start;
        }

        .checkout-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* CARD */

        .checkout-card {
          background: #fff;

          border: 1px solid #eee;
          border-radius: 12px;

          padding: 28px;

          box-shadow:
            0 8px 25px
            rgba(0, 0, 0, 0.05);
        }

        /* CARD TITLE */

        .card-title {
          display: flex;
          align-items: center;

          gap: 14px;

          margin-bottom: 25px;
          padding-bottom: 18px;

          border-bottom:
            1px solid #eee;
        }

        .title-icon {
          width: 42px;
          height: 42px;

          border-radius: 50%;

          background: #fff0f1;
          color: #e63946;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .card-title h2 {
          color: #222;

          font-size: 19px;

          margin:
            0 0 3px;
        }

        .card-title p {
          color: #888;

          font-size: 12px;

          margin: 0;
        }

        /* FORM */

        .form-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          color: #444;

          font-size: 13px;

          font-weight: 700;

          margin-bottom: 7px;
        }

        .form-group label span {
          color: #e63946;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;

          border:
            1px solid #ddd;

          border-radius: 7px;

          padding:
            12px 13px;

          background: #fff;

          color: #222;

          font-size: 14px;

          outline: none;

          transition: 0.2s;

          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;

          min-height: 110px;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          border-color:
            #e63946;

          box-shadow:
            0 0 0 3px
            rgba(
              230,
              57,
              70,
              0.08
            );
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #aaa;
        }

        /* DATABASE FIELD */

        .database-field {
          background:
            #f5f5f5 !important;

          color:
            #555 !important;

          cursor:
            not-allowed;

          border-color:
            #e5e5e5 !important;
        }

        .database-note {
          color: #888;

          font-size: 10px;

          margin-top: 5px;
        }

        .database-note i {
          color: #218838;

          margin-right: 4px;
        }

        /* PAYMENT */

        .payment-options {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;
        }

        .payment-option {
          display: flex;

          align-items: center;

          gap: 12px;

          padding: 15px;

          border:
            1px solid #ddd;

          border-radius: 8px;

          cursor: pointer;

          transition: 0.2s;
        }

        .payment-option.active {
          border-color:
            #e63946;

          background:
            #fff8f8;
        }

        .payment-option input {
          accent-color:
            #e63946;
        }

        .payment-icon {
          width: 38px;
          height: 38px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 6px;

          background:
            #fff0f1;

          color:
            #e63946;

          flex-shrink: 0;
        }

        .payment-option strong {
          display: block;

          color: #333;

          font-size: 13px;

          margin-bottom: 3px;
        }

        .payment-option small {
          color: #888;

          font-size: 11px;
        }

        /* ONLINE PAYMENT DISABLED */

        .payment-option-disabled {
          opacity: 0.65;

          cursor:
            not-allowed !important;

          background:
            #f7f7f7;

          border-color:
            #ddd;

          position: relative;
        }

        .payment-option-disabled:hover {
          border-color:
            #ddd;

          background:
            #f7f7f7;
        }

        .payment-option-disabled input {
          cursor:
            not-allowed;
        }

        .payment-option-disabled .payment-icon {
          background:
            #eeeeee;

          color:
            #999;
        }

        .payment-option-disabled strong {
          color:
            #777;
        }

        .payment-option-disabled small {
          color:
            #999;
        }

        .payment-content {
          display: flex;

          flex-direction: column;

          min-width: 0;
        }

        .payment-unavailable {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          margin-top: 5px;

          color:
            #e63946;

          font-size: 10px;

          font-weight: 700;
        }

        .payment-unavailable i {
          font-size: 9px;
        }

        /* SUMMARY */

        .checkout-right {
          position: sticky;
          top: 20px;
        }

        .order-summary {
          background: #fff;

          border:
            1px solid #eee;

          border-radius: 12px;

          padding: 25px;

          box-shadow:
            0 10px 30px
            rgba(
              0,
              0,
              0,
              0.07
            );
        }

        .summary-header {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          padding-bottom: 18px;

          border-bottom:
            1px solid #eee;
        }

        .summary-header h2 {
          color: #222;

          font-size: 20px;

          margin: 0;
        }

        .summary-header span {
          color: #888;

          font-size: 12px;
        }

        /* PRODUCT */

        .summary-product {
          display: flex;

          gap: 14px;

          padding: 20px 0;

          border-bottom:
            1px solid #eee;
        }

        .summary-image {
          width: 75px;
          height: 75px;

          border-radius: 7px;

          overflow: hidden;

          background:
            #f4f4f4;

          flex-shrink: 0;
        }

        .summary-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .summary-product-info {
          min-width: 0;
        }

        .summary-product-info > span {
          color:
            #e63946;

          font-size: 10px;

          font-weight: 800;

          text-transform:
            uppercase;

          letter-spacing: 1px;
        }

        .summary-product-info h3 {
          color: #222;

          font-size: 15px;

          margin:
            5px 0;
        }

        .summary-product-info p {
          color: #888;

          font-size: 12px;

          margin: 0;
        }

        /* SINGLE PRICE */

        .summary-single-price {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          padding: 16px 0;

          border-bottom:
            1px solid #eee;
        }

        .summary-single-price span {
          color: #555;

          font-size: 13px;

          font-weight: 700;
        }

        .summary-single-price div {
          display: flex;

          align-items: center;

          gap: 8px;
        }

        .summary-single-price del {
          color: #999;

          font-size: 11px;
        }

        .summary-single-price strong {
          color: #222;

          font-size: 14px;
        }

        /* QUANTITY */

        .summary-quantity {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          padding: 16px 0;

          border-bottom:
            1px solid #eee;
        }

        .summary-quantity > span {
          color: #555;

          font-size: 13px;

          font-weight: 700;
        }

        .summary-quantity-box {
          display: flex;

          align-items: center;

          border:
            1px solid #ddd;

          border-radius: 6px;

          overflow: hidden;
        }

        .summary-quantity-box button {
          width: 32px;
          height: 32px;

          border: none;

          background:
            #f5f5f5;

          cursor: pointer;

          font-size: 18px;
        }

        .summary-quantity-box button:hover:not(:disabled) {
          background:
            #e63946;

          color: #fff;
        }

        .summary-quantity-box button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .summary-quantity-box strong {
          width: 35px;

          text-align: center;

          font-size: 13px;
        }

        /* PRICE DETAILS */

        .price-details {
          padding: 18px 0;

          border-bottom:
            1px solid #eee;
        }

        .price-details > div {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          margin-bottom: 12px;
        }

        .price-details > div:last-child {
          margin-bottom: 0;
        }

        .price-details span {
          color: #777;

          font-size: 13px;
        }

        .price-details strong {
          color: #333;

          font-size: 13px;
        }

        .free-shipping {
          color:
            #218838 !important;
        }

        .discount {
          color:
            #218838 !important;
        }

        /* GRAND TOTAL */

        .grand-total {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          padding: 20px 0;
        }

        .grand-total span {
          color: #222;

          font-size: 15px;

          font-weight: 800;
        }

        .grand-total strong {
          color:
            #e63946;

          font-size: 24px;
        }

        /* PLACE ORDER */

        .place-order-btn {
          width: 100%;

          display: flex;

          align-items: center;

          justify-content:
            center;

          gap: 10px;

          padding: 15px;

          border: none;

          border-radius: 7px;

          background:
            #e63946;

          color: #fff;

          font-size: 14px;

          font-weight: 800;

          cursor: pointer;

          transition: 0.2s;
        }

        .place-order-btn:hover:not(:disabled) {
          background:
            #c92f3b;

          transform:
            translateY(-1px);
        }

        .place-order-btn:disabled {
          opacity: 0.7;

          cursor:
            not-allowed;

          transform: none;
        }

        .secure-text {
          text-align: center;

          color: #888;

          font-size: 11px;

          margin:
            14px 0;
        }

        .secure-text i {
          color:
            #218838;

          margin-right: 5px;
        }

        .continue-shopping {
          width: 100%;

          border: none;

          background:
            transparent;

          color: #666;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;
        }

        .continue-shopping:hover:not(:disabled) {
          color:
            #e63946;
        }

        .continue-shopping:disabled {
          opacity: 0.5;

          cursor:
            not-allowed;
        }

        .continue-shopping i {
          margin-right: 6px;
        }

        /* TABLET */

        @media (max-width: 900px) {

          .checkout-grid {
            grid-template-columns: 1fr;
          }

          .checkout-right {
            position: static;
          }

          .order-summary {
            max-width: 100%;
          }

        }

        /* MOBILE */

        @media (max-width: 600px) {

          .checkout-page {
            padding:
              45px 15px;
          }

          .checkout-header h1 {
            font-size: 30px;
          }

          .checkout-card {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns:
              1fr;
          }

          .form-group.full-width {
            grid-column:
              auto;
          }

          .payment-options {
            grid-template-columns:
              1fr;
          }

          .order-summary {
            padding: 20px;
          }

        }

      `}</style>
    </section>
  );
};

export default Checkout;
