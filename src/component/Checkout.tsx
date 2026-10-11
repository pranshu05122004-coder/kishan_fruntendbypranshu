import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:5001/api";

interface Variant {
  id: number;
  variant_name?: string | null;
  variant_code?: string | null;
  part_number?: string | null;
  price: number;
  old_price?: number | null;
  image?: string | null;
  stock?: number | null;
  status?: string | null;
}

interface Product {
  id: number;
  name: string;
  category?: string;
  description?: string;
  price: number;
  old_price?: number | null;
  image?: string | null;
  stock?: number | null;
  variants?: Variant[];
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

interface CreatedOrder {
  orderId?: number | string;
  orderNumber?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("productId");
  const variantId = searchParams.get("variantId");
  const quantityFromUrl = Number(
    searchParams.get("quantity") || 1
  );

  // =========================================================
  // PRODUCT / USER
  // =========================================================

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<Variant | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  // =========================================================
  // QUANTITY
  // =========================================================

  const [quantity, setQuantity] = useState(
    Math.max(1, quantityFromUrl)
  );

  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] =
    useState(true);

  const [userLoading, setUserLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [savingAddress, setSavingAddress] =
    useState(false);

  // =========================================================
  // ERRORS
  // =========================================================

  const [productError, setProductError] =
    useState("");

  const [userError, setUserError] =
    useState("");

  // =========================================================
  // ORDER SUCCESS
  // =========================================================

  const [orderSuccess, setOrderSuccess] =
    useState(false);

  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);

  // =========================================================
  // SAVED ADDRESS STATES
  // =========================================================

  const [hasSavedAddress, setHasSavedAddress] =
    useState(false);

  const [useSavedAddress, setUseSavedAddress] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState(false);

  const [saveAddress, setSaveAddress] =
    useState(true);

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",

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

  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setProductError(
          "Product ID is missing."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setProductError("");

        const response = await fetch(
          `${API_BASE}/products/${productId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load product."
          );
        }

        const loadedProduct: Product =
          data.product ||
          data.data ||
          data;

        setProduct(loadedProduct);

        // =====================================================
        // SELECT VARIANT
        // =====================================================

        if (
          variantId &&
          Array.isArray(
            loadedProduct.variants
          )
        ) {
          const foundVariant =
            loadedProduct.variants.find(
              (variant) =>
                String(variant.id) ===
                String(variantId)
            );

          if (foundVariant) {
            setSelectedVariant(
              foundVariant
            );
          }
        } else if (
          Array.isArray(
            loadedProduct.variants
          ) &&
          loadedProduct.variants.length === 1
        ) {
          setSelectedVariant(
            loadedProduct.variants[0]
          );
        }
      } catch (error: any) {
        console.error(
          "Product load error:",
          error
        );

        setProductError(
          error?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, variantId]);

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setUserLoading(true);
        setUserError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          setUserError(
            "Please login to continue with checkout."
          );

          setUserLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE}/users/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load account details."
          );
        }

        const loggedUser: User =
          data.user ||
          data.data ||
          data;

        setUser(loggedUser);

        // =====================================================
        // CHECK SAVED ADDRESS
        // =====================================================

        const savedAddress =
          !!loggedUser.address1 &&
          !!loggedUser.area &&
          !!loggedUser.city &&
          !!loggedUser.state &&
          !!loggedUser.pincode;

        setHasSavedAddress(
          savedAddress
        );

        setUseSavedAddress(
          savedAddress
        );

        setEditingAddress(
          !savedAddress
        );

        // =====================================================
        // AUTO FILL USER DETAILS
        // =====================================================

        setFormData((prev) => ({
          ...prev,

          fullName:
            loggedUser.name || "",

          email:
            loggedUser.email || "",

          mobile:
            loggedUser.phone || "",

          companyName:
            loggedUser.companyName ||
            "",

          gstNumber:
            loggedUser.gstNumber ||
            "",

          address1:
            loggedUser.address1 ||
            "",

          address2:
            loggedUser.address2 ||
            "",

          area:
            loggedUser.area ||
            "",

          city:
            loggedUser.city ||
            "",

          state:
            loggedUser.state ||
            "",

          pincode:
            loggedUser.pincode ||
            "",

          country:
            loggedUser.country ||
            "India",
        }));
      } catch (error: any) {
        console.error(
          "User load error:",
          error
        );

        setUserError(
          error?.message ||
            "Unable to load account details."
        );
      } finally {
        setUserLoading(false);
      }
    };

    loadUser();
  }, []);

  // =========================================================
  // FORM HANDLER
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // PRICE
  // =========================================================

  const price = Number(
    selectedVariant?.price ??
      product?.price ??
      0
  );

  const oldPrice = Number(
    selectedVariant?.old_price ??
      product?.old_price ??
      0
  );

  const subtotal =
    price * quantity;

  const shippingCharge =
    subtotal >= 50000
      ? 0
      : 500;

  const discount = 0;

  const grandTotal =
    subtotal +
    shippingCharge -
    discount;

  // =========================================================
  // QUANTITY
  // =========================================================

  const increaseQuantity = () => {
    const availableStock =
      selectedVariant?.stock ??
      product?.stock ??
      999999;

    if (
      quantity <
      availableStock
    ) {
      setQuantity(
        (prev) => prev + 1
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(
        (prev) => prev - 1
      );
    }
  };

  // =========================================================
  // RESTORE SAVED ADDRESS
  // =========================================================

  const restoreSavedAddress = () => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,

      address1:
        user.address1 || "",

      address2:
        user.address2 || "",

      area:
        user.area || "",

      city:
        user.city || "",

      state:
        user.state || "",

      pincode:
        user.pincode || "",

      country:
        user.country || "India",
    }));
  };

  // =========================================================
  // USE SAVED ADDRESS
  // =========================================================

  const handleUseSavedAddress = () => {
    restoreSavedAddress();

    setUseSavedAddress(true);
    setEditingAddress(false);
  };

  // =========================================================
  // EDIT SAVED ADDRESS
  // =========================================================

  const handleEditAddress = () => {
    restoreSavedAddress();

    setUseSavedAddress(false);
    setEditingAddress(true);

    setSaveAddress(true);
  };

  // =========================================================
  // USE NEW ADDRESS
  // =========================================================

  const handleUseNewAddress = () => {
    setUseSavedAddress(false);
    setEditingAddress(true);

    setFormData((prev) => ({
      ...prev,

      address1: "",
      address2: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    }));

    setSaveAddress(true);
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelAddressEdit = () => {
    if (!user) return;

    restoreSavedAddress();

    setUseSavedAddress(true);
    setEditingAddress(false);
  };

  // =========================================================
  // SAVE ADDRESS TO USER PROFILE
  // =========================================================

  const saveUserAddress = async (
    token: string,
    cleanMobile: string,
    cleanPincode: string
  ) => {
    if (!saveAddress) {
      return true;
    }

    try {
      setSavingAddress(true);

      const response = await fetch(
        `${API_BASE}/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name:
              formData.fullName.trim(),

            phone:
              cleanMobile,

            companyName:
              formData.companyName.trim(),

            gstNumber:
              formData.gstNumber.trim(),

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
              formData.country ||
              "India",
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save address."
        );
      }

      // Update local user state
      if (data.user) {
        setUser(data.user);
      }

      setHasSavedAddress(true);

      return true;
    } catch (error) {
      console.error(
        "Save address error:",
        error
      );

      return false;
    } finally {
      setSavingAddress(false);
    }
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder =
    async () => {
      if (placingOrder) return;

      if (!product) {
        alert(
          "Product information is missing."
        );

        return;
      }

      if (!user) {
        alert(
          "Please login before placing the order."
        );

        return;
      }

      // =====================================================
      // REQUIRED FIELDS
      // =====================================================

      if (
        !formData.fullName.trim() ||
        !formData.email.trim() ||
        !formData.mobile.trim() ||
        !formData.address1.trim() ||
        !formData.area.trim() ||
        !formData.city.trim() ||
        !formData.state.trim() ||
        !formData.pincode.trim()
      ) {
        alert(
          "Please fill all required customer and delivery details."
        );

        return;
      }

      // =====================================================
      // MOBILE
      // =====================================================

      const cleanMobile =
        formData.mobile.replace(
          /\D/g,
          ""
        );

      if (
        cleanMobile.length !== 10
      ) {
        alert(
          "Please enter a valid 10-digit mobile number."
        );

        return;
      }

      // =====================================================
      // PINCODE
      // =====================================================

      const cleanPincode =
        formData.pincode.replace(
          /\D/g,
          ""
        );

      if (
        cleanPincode.length !== 6
      ) {
        alert(
          "Please enter a valid 6-digit PIN code."
        );

        return;
      }

      // =====================================================
      // PAYMENT
      // =====================================================

      if (
        formData.paymentMethod !==
        "COD"
      ) {
        alert(
          "Online payment is currently unavailable."
        );

        return;
      }

      try {
        setPlacingOrder(true);

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          alert(
            "Your session has expired. Please login again."
          );

          navigate("/login");

          return;
        }

        // ===================================================
        // ORDER DATA
        // ===================================================

        const orderData = {
          userId: user.id,

          productId: product.id,

          productName:
            product.name,

          variantId:
            selectedVariant?.id ||
            null,

          variantName:
            selectedVariant?.variant_name ||
            null,

          variantCode:
            selectedVariant?.variant_code ||
            null,

          partNumber:
            selectedVariant?.part_number ||
            null,

          quantity,

          pricePerItem:
            price,

          oldPrice,

          subtotal,

          shippingCharge,

          discount,

          grandTotal,

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
              formData.country ||
              "India",
          },

          paymentMethod:
            formData.paymentMethod,

          notes:
            formData.notes.trim(),
        };

        console.log(
          "ORDER DATA:",
          orderData
        );

        // ===================================================
        // CREATE ORDER
        // ===================================================

        const response =
          await fetch(
            `${API_BASE}/orders`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify(
                orderData
              ),
            }
          );

        const data =
          await response.json();

        console.log(
          "ORDER RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to place order."
          );
        }

        // ===================================================
        // GET ORDER DETAILS
        // ===================================================

        const orderId =
          data.orderId ||
          data.order?.id ||
          data.data?.orderId ||
          data.data?.id;

        const orderNumber =
          data.orderNumber ||
          data.order?.orderNumber ||
          data.data?.orderNumber;

        setCreatedOrder({
          orderId,
          orderNumber,
        });

        // ===================================================
        // SAVE ADDRESS AFTER ORDER
        // ===================================================

        if (saveAddress) {
          const addressSaved =
            await saveUserAddress(
              token,
              cleanMobile,
              cleanPincode
            );

          if (!addressSaved) {
            console.warn(
              "Order placed, but address could not be saved."
            );
          }
        }

        // ===================================================
        // SUCCESS
        // ===================================================

        setOrderSuccess(true);

        setTimeout(() => {
          navigate("/orders");
        }, 2200);

      } catch (error: any) {
        console.error(
          "Place order error:",
          error
        );

        alert(
          error?.message ||
            "Something went wrong while placing your order."
        );
      } finally {
        setPlacingOrder(false);
      }
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    loading ||
    userLoading
  ) {
    return (
      <>
        <style>{`
          .checkout-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            font-family: Arial, sans-serif;
          }

          .loading-box {
            text-align: center;
          }

          .loader {
            width: 48px;
            height: 48px;
            border: 4px solid #e5e7eb;
            border-top-color: #c62828;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-text {
            color: #475569;
            font-size: 15px;
          }
        `}</style>

        <div className="checkout-loading">
          <div className="loading-box">
            <div className="loader" />

            <div className="loading-text">
              Preparing your checkout...
            </div>
          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // PRODUCT ERROR
  // =========================================================

  if (
    productError ||
    !product
  ) {
    return (
      <>
        <style>{`
          .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          .error-card {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 18px;
            padding: 35px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          }

          .error-icon {
            font-size: 50px;
            margin-bottom: 15px;
          }

          .error-card h2 {
            margin: 0 0 10px;
            color: #111827;
          }

          .error-card p {
            color: #64748b;
            margin-bottom: 25px;
          }

          .error-btn {
            border: none;
            background: #c62828;
            color: white;
            padding: 12px 24px;
            border-radius: 9px;
            cursor: pointer;
            font-weight: 600;
          }
        `}</style>

        <div className="error-page">
          <div className="error-card">

            <div className="error-icon">
              ⚠️
            </div>

            <h2>
              Unable to Load Product
            </h2>

            <p>
              {productError ||
                "Product information is unavailable."}
            </p>

            <button
              className="error-btn"
              onClick={() =>
                navigate(-1)
              }
            >
              Go Back
            </button>

          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // USER ERROR
  // =========================================================

  if (
    userError ||
    !user
  ) {
    return (
      <>
        <style>{`
          .error-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          .error-card {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 18px;
            padding: 35px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          }

          .error-icon {
            font-size: 50px;
            margin-bottom: 15px;
          }

          .error-card h2 {
            margin: 0 0 10px;
            color: #111827;
          }

          .error-card p {
            color: #64748b;
            margin-bottom: 25px;
          }

          .error-btn {
            border: none;
            background: #c62828;
            color: white;
            padding: 12px 24px;
            border-radius: 9px;
            cursor: pointer;
            font-weight: 600;
          }
        `}</style>

        <div className="error-page">
          <div className="error-card">

            <div className="error-icon">
              🔐
            </div>

            <h2>
              Login Required
            </h2>

            <p>
              {userError ||
                "Please login to continue."}
            </p>

            <button
              className="error-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>

          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // ORDER SUCCESS
  // =========================================================

  if (orderSuccess) {
    return (
      <>
        <style>{`
          .success-page {
            min-height: 100vh;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          .success-card {
            width: 100%;
            max-width: 500px;
            background: white;
            border-radius: 24px;
            padding: 45px 30px;
            text-align: center;
            box-shadow: 0 15px 50px rgba(0,0,0,0.10);
          }

          .success-circle {
            width: 82px;
            height: 82px;
            margin: 0 auto 22px;
            border-radius: 50%;
            background: #dcfce7;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #16a34a;
            font-size: 42px;
            font-weight: 700;
            animation: successPop 0.45s ease-out;
          }

          @keyframes successPop {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .success-card h1 {
            margin: 0 0 10px;
            color: #111827;
            font-size: 30px;
          }

          .success-card p {
            color: #64748b;
            margin: 8px 0;
          }

          .order-number {
            margin: 20px 0;
            padding: 14px;
            border-radius: 12px;
            background: #f8fafc;
            font-weight: 700;
            color: #334155;
          }

          .redirect-text {
            margin-top: 25px;
            font-size: 13px;
            color: #94a3b8;
          }

          .progress {
            height: 4px;
            width: 100%;
            background: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
          }

          .progress-bar {
            height: 100%;
            width: 0;
            background: #16a34a;
            animation: progress 2.2s linear forwards;
          }

          @keyframes progress {
            from {
              width: 0;
            }

            to {
              width: 100%;
            }
          }
        `}</style>

        <div className="success-page">
          <div className="success-card">

            <div className="success-circle">
              ✓
            </div>

            <h1>
              Order Placed!
            </h1>

            <p>
              Thank you for your order.
            </p>

            <p>
              Your order has been successfully
              received.
            </p>

            {createdOrder?.orderNumber && (
              <div className="order-number">
                Order Number:{" "}
                {createdOrder.orderNumber}
              </div>
            )}

            {!createdOrder?.orderNumber &&
              createdOrder?.orderId && (
                <div className="order-number">
                  Order ID:{" "}
                  {createdOrder.orderId}
                </div>
              )}

            <div className="redirect-text">
              Redirecting to your orders...
            </div>

            <div className="progress">
              <div className="progress-bar" />
            </div>

          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // MAIN CHECKOUT
  // =========================================================

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .checkout-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: Arial, Helvetica, sans-serif;
          padding: 35px 20px 60px;
          color: #111827;
        }

        .checkout-container {
          max-width: 1250px;
          margin: 0 auto;
        }

        .checkout-header {
          margin-bottom: 28px;
        }

        .checkout-header h1 {
          margin: 0;
          font-size: 30px;
          color: #111827;
        }

        .checkout-header p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 15px;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 390px;
          gap: 25px;
          align-items: start;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .checkout-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(15,23,42,0.04);
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .card-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fef2f2;
          color: #c62828;
          border-radius: 10px;
          font-size: 18px;
        }

        .card-heading h2 {
          margin: 0;
          font-size: 19px;
          color: #111827;
        }

        .card-description {
          margin: 0 0 22px 52px;
          color: #64748b;
          font-size: 13px;
        }

        /* =====================================================
           PRODUCT
        ===================================================== */

        .product-confirmation {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          background: #f8fafc;
        }

        .product-confirmation-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 800;
          color: #334155;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .product-confirmation-title span {
          color: #16a34a;
        }

        .confirmation-main {
          display: grid;
          grid-template-columns: 100px minmax(0, 1fr);
          gap: 18px;
        }

        .confirmation-image {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          border: 1px solid #e5e7eb;
        }

        .confirmation-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .confirmation-info h3 {
          margin: 0 0 5px;
          font-size: 18px;
          color: #111827;
        }

        .confirmation-category {
          display: inline-block;
          background: #fee2e2;
          color: #991b1b;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .variant-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .variant-info {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          padding: 9px 10px;
        }

        .variant-label {
          display: block;
          color: #94a3b8;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .variant-value {
          display: block;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
          word-break: break-word;
        }

        .variant-price {
          color: #c62828;
          font-size: 16px;
        }

        .no-variant {
          background: #fff;
          border: 1px dashed #cbd5e1;
          padding: 12px;
          border-radius: 9px;
          color: #64748b;
          font-size: 13px;
        }

        /* =====================================================
           FORM
        ===================================================== */

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .required {
          color: #dc2626;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          border: 1px solid #dbe1e8;
          background: white;
          border-radius: 9px;
          padding: 12px 13px;
          font-size: 14px;
          color: #1e293b;
          outline: none;
          transition: 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          border-color: #c62828;
          box-shadow: 0 0 0 3px rgba(198,40,40,0.08);
        }

        .form-group input:read-only {
          background: #f8fafc;
          color: #64748b;
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        /* =====================================================
           SAVED ADDRESS
        ===================================================== */

        .saved-address-wrapper {
          width: 100%;
        }

        .saved-address-card {
          border: 1px solid #dbe5ef;
          border-radius: 14px;
          background: #ffffff;
          overflow: hidden;
        }

        .saved-address-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 18px;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .saved-address-title {
          color: #111827;
          font-size: 16px;
          font-weight: 800;
        }

        .saved-address-subtitle {
          color: #64748b;
          font-size: 12px;
          margin-top: 4px;
        }

        .saved-badge {
          background: #dcfce7;
          color: #15803d;
          font-size: 10px;
          font-weight: 800;
          padding: 5px 9px;
          border-radius: 20px;
        }

        .saved-address-content {
          padding: 18px;
          color: #475569;
          font-size: 14px;
          line-height: 1.7;
        }

        .saved-name {
          color: #111827;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .saved-mobile {
          margin-top: 8px;
          color: #64748b;
          font-size: 13px;
        }

        .saved-address-actions {
          display: flex;
          gap: 10px;
          padding: 0 18px 18px;
        }

        .use-address-btn,
        .edit-address-btn {
          border: none;
          border-radius: 9px;
          padding: 11px 15px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          transition: 0.2s;
        }

        .use-address-btn {
          background: #c62828;
          color: white;
        }

        .use-address-btn:hover {
          background: #a91f1f;
        }

        .edit-address-btn {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #dbe1e8;
        }

        .edit-address-btn:hover {
          background: #e2e8f0;
        }

        .new-address-btn {
          margin-top: 12px;
          width: 100%;
          border: 1px dashed #c62828;
          background: #fffafa;
          color: #c62828;
          padding: 12px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
        }

        .new-address-btn:hover {
          background: #fef2f2;
        }

        .save-address-option {
          grid-column: 1 / -1;
          padding-top: 3px;
        }

        .save-address-label {
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .save-address-label input {
          width: 17px;
          height: 17px;
          accent-color: #c62828;
          cursor: pointer;
        }

        .cancel-edit-btn {
          grid-column: 1 / -1;
          border: 1px solid #dbe1e8;
          background: #f8fafc;
          color: #475569;
          padding: 10px 14px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .cancel-edit-btn:hover {
          background: #f1f5f9;
        }

        /* =====================================================
           PAYMENT
        ===================================================== */

        .payment-option {
          border: 2px solid #c62828;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 13px;
          background: #fffafa;
        }

        .payment-radio {
          width: 20px;
          height: 20px;
          accent-color: #c62828;
        }

        .payment-content {
          flex: 1;
        }

        .payment-title {
          font-weight: 800;
          color: #1e293b;
          font-size: 14px;
        }

        .payment-description {
          color: #64748b;
          font-size: 12px;
          margin-top: 4px;
        }

        .payment-unavailable {
          margin-top: 10px;
          font-size: 11px;
          color: #dc2626;
          font-weight: 700;
        }

        /* =====================================================
           SUMMARY
        ===================================================== */

        .summary-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 23px;
          position: sticky;
          top: 20px;
          box-shadow: 0 5px 20px rgba(15,23,42,0.04);
        }

        .summary-card h2 {
          margin: 0 0 20px;
          font-size: 20px;
          color: #111827;
        }

        .summary-product {
          display: flex;
          gap: 13px;
          padding-bottom: 17px;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-image {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          flex-shrink: 0;
        }

        .summary-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .summary-product-info {
          min-width: 0;
        }

        .summary-product-info h3 {
          margin: 0 0 5px;
          font-size: 14px;
          line-height: 1.35;
          color: #1e293b;
        }

        .summary-category {
          font-size: 10px;
          color: #64748b;
          margin-bottom: 5px;
        }

        .summary-variant {
          font-size: 11px;
          color: #475569;
          line-height: 1.5;
        }

        .summary-variant strong {
          color: #1e293b;
        }

        .summary-price {
          margin-top: 5px;
          font-weight: 800;
          color: #c62828;
        }

        .old-price {
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 400;
          margin-left: 6px;
          font-size: 12px;
        }

        .quantity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 17px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .quantity-label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid #dbe1e8;
          border-radius: 8px;
          overflow: hidden;
        }

        .quantity-controls button {
          width: 34px;
          height: 34px;
          border: none;
          background: #f8fafc;
          cursor: pointer;
          font-size: 18px;
          color: #334155;
        }

        .quantity-controls button:hover {
          background: #f1f5f9;
        }

        .quantity-controls button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .quantity-number {
          width: 38px;
          text-align: center;
          font-weight: 700;
          font-size: 13px;
        }

        .price-details {
          padding: 17px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 11px;
          font-size: 13px;
          color: #64748b;
        }

        .price-row:last-child {
          margin-bottom: 0;
        }

        .free-shipping {
          color: #16a34a;
          font-weight: 700;
        }

        .discount-text {
          color: #16a34a;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0;
        }

        .total-label {
          font-size: 16px;
          font-weight: 800;
          color: #111827;
        }

        .total-value {
          font-size: 22px;
          font-weight: 900;
          color: #c62828;
        }

        .place-order-btn {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: #c62828;
          color: white;
          padding: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .place-order-btn:hover {
          background: #a91f1f;
        }

        .place-order-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .secure-text {
          text-align: center;
          margin: 13px 0 18px;
          font-size: 11px;
          color: #94a3b8;
        }

        .back-btn {
          width: 100%;
          border: 1px solid #dbe1e8;
          background: white;
          color: #475569;
          padding: 11px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .back-btn:hover {
          background: #f8fafc;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .summary-card {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .checkout-page {
            padding: 22px 12px 40px;
          }

          .checkout-header h1 {
            font-size: 25px;
          }

          .checkout-card {
            padding: 18px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full {
            grid-column: auto;
          }

          .card-description {
            margin-left: 0;
          }

          .confirmation-main {
            grid-template-columns: 1fr;
          }

          .confirmation-image {
            width: 100%;
            height: 160px;
          }

          .variant-grid {
            grid-template-columns: 1fr 1fr;
          }

          .variant-grid .variant-info:last-child {
            grid-column: 1 / -1;
          }

          .saved-address-actions {
            flex-direction: column;
          }

          .use-address-btn,
          .edit-address-btn {
            width: 100%;
          }

          .saved-address-header {
            align-items: flex-start;
            gap: 10px;
          }
        }

      `}</style>

      <div className="checkout-page">

        <div className="checkout-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="checkout-header">

            <h1>
              Complete Your Order
            </h1>

            <p>
              Please confirm your details and delivery information.
            </p>

          </div>

          <div className="checkout-layout">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="left-column">

              {/* =================================================
                  PRODUCT CONFIRMATION
              ================================================= */}

              <div className="checkout-card">

                <div className="card-heading">

                  <div className="card-icon">
                    ✓
                  </div>

                  <h2>
                    Product & Variant Confirmation
                  </h2>

                </div>

                <p className="card-description">
                  Please confirm the product and variant you want to order.
                </p>

                <div className="product-confirmation">

                  <div className="product-confirmation-title">
                    <span>●</span>
                    Selected Product
                  </div>

                  <div className="confirmation-main">

                    <div className="confirmation-image">

                      <img
                        src={
                          selectedVariant?.image ||
                          product.image ||
                          "/placeholder.png"
                        }
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/placeholder.png";
                        }}
                      />

                    </div>

                    <div className="confirmation-info">

                      <h3>
                        {product.name}
                      </h3>

                      {product.category && (
                        <div className="confirmation-category">
                          {product.category}
                        </div>
                      )}

                      {selectedVariant ? (
                        <div className="variant-grid">

                          <div className="variant-info">
                            <span className="variant-label">
                              Variant
                            </span>

                            <span className="variant-value">
                              {selectedVariant.variant_name ||
                                "—"}
                            </span>
                          </div>

                          <div className="variant-info">
                            <span className="variant-label">
                              Variant Code
                            </span>

                            <span className="variant-value">
                              {selectedVariant.variant_code ||
                                "—"}
                            </span>
                          </div>

                          <div className="variant-info">
                            <span className="variant-label">
                              Part Number
                            </span>

                            <span className="variant-value">
                              {selectedVariant.part_number ||
                                "—"}
                            </span>
                          </div>

                          <div className="variant-info">
                            <span className="variant-label">
                              Price
                            </span>

                            <span className="variant-value variant-price">
                              ₹
                              {Number(
                                selectedVariant.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>

                          <div className="variant-info">
                            <span className="variant-label">
                              Stock
                            </span>

                            <span className="variant-value">
                              {selectedVariant.stock ??
                                "Available"}
                            </span>
                          </div>

                          <div className="variant-info">
                            <span className="variant-label">
                              Quantity
                            </span>

                            <span className="variant-value">
                              {quantity}
                            </span>
                          </div>

                        </div>
                      ) : (
                        <div className="no-variant">
                          This product does not have a
                          selected variant.
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CUSTOMER DETAILS
              ================================================= */}

              <div className="checkout-card">

                <div className="card-heading">

                  <div className="card-icon">
                    👤
                  </div>

                  <h2>
                    Customer Details
                  </h2>

                </div>

                <p className="card-description">
                  Your registered account information
                </p>

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Full Name{" "}
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      readOnly
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Mobile Number{" "}
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      readOnly
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Email Address{" "}
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                    />

                  </div>

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
                      onChange={handleChange}
                      placeholder="Enter company name"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      GST Number
                    </label>

                    <input
                      type="text"
                      name="gstNumber"
                      value={
                        formData.gstNumber
                      }
                      onChange={handleChange}
                      placeholder="Enter GST number"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  SHIPPING ADDRESS
              ================================================= */}

              <div className="checkout-card">

                <div className="card-heading">

                  <div className="card-icon">
                    📍
                  </div>

                  <h2>
                    Shipping Address
                  </h2>

                </div>

                <p className="card-description">
                  Where should we deliver your order?
                </p>

                {/* =================================================
                    SAVED ADDRESS CARD
                ================================================= */}

                {hasSavedAddress &&
                useSavedAddress &&
                !editingAddress ? (

                  <div className="saved-address-wrapper">

                    <div className="saved-address-card">

                      <div className="saved-address-header">

                        <div>

                          <div className="saved-address-title">
                            ✓ Saved Address
                          </div>

                          <div className="saved-address-subtitle">
                            Your default delivery address
                          </div>

                        </div>

                        <span className="saved-badge">
                          SAVED
                        </span>

                      </div>

                      <div className="saved-address-content">

                        <div className="saved-name">
                          {formData.fullName}
                        </div>

                        <div>
                          {formData.address1}
                        </div>

                        {formData.address2 && (
                          <div>
                            {formData.address2}
                          </div>
                        )}

                        <div>
                          {formData.area},{" "}
                          {formData.city}
                        </div>

                        <div>
                          {formData.state} -{" "}
                          {formData.pincode}
                        </div>

                        <div>
                          {formData.country}
                        </div>

                        <div className="saved-mobile">
                          📞 {formData.mobile}
                        </div>

                      </div>

                      <div className="saved-address-actions">

                        <button
                          type="button"
                          className="use-address-btn"
                          onClick={
                            handleUseSavedAddress
                          }
                        >
                          ✓ Use This Address
                        </button>

                        <button
                          type="button"
                          className="edit-address-btn"
                          onClick={
                            handleEditAddress
                          }
                        >
                          ✏️ Edit Address
                        </button>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="new-address-btn"
                      onClick={
                        handleUseNewAddress
                      }
                    >
                      + Use a New Address
                    </button>

                  </div>

                ) : (

                  /* =================================================
                     ADDRESS FORM
                  ================================================= */

                  <div className="form-grid">

                    <div className="form-group full">

                      <label>
                        Address Line 1{" "}
                        <span className="required">
                          *
                        </span>
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
                        placeholder="House / Building / Street"
                      />

                    </div>

                    <div className="form-group full">

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
                        placeholder="Apartment / Landmark"
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Area / Locality{" "}
                        <span className="required">
                          *
                        </span>
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
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        City{" "}
                        <span className="required">
                          *
                        </span>
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
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        State{" "}
                        <span className="required">
                          *
                        </span>
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
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        PIN Code{" "}
                        <span className="required">
                          *
                        </span>
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
                        maxLength={6}
                        placeholder="6-digit PIN"
                      />

                    </div>

                    <div className="form-group">

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
                      />

                    </div>

                    {/* =================================================
                        SAVE ADDRESS CHECKBOX
                    ================================================= */}

                    <div className="save-address-option">

                      <label className="save-address-label">

                        <input
                          type="checkbox"
                          checked={
                            saveAddress
                          }
                          onChange={(e) =>
                            setSaveAddress(
                              e.target.checked
                            )
                          }
                        />

                        <span>
                          Save this address for future orders
                        </span>

                      </label>

                    </div>

                    {/* =================================================
                        CANCEL EDIT
                    ================================================= */}

                    {hasSavedAddress &&
                    editingAddress && (
                      <button
                        type="button"
                        className="cancel-edit-btn"
                        onClick={
                          handleCancelAddressEdit
                        }
                      >
                        ← Cancel & Use Saved Address
                      </button>
                    )}

                  </div>

                )}

              </div>

              {/* =================================================
                  PAYMENT
              ================================================= */}

              <div className="checkout-card">

                <div className="card-heading">

                  <div className="card-icon">
                    💳
                  </div>

                  <h2>
                    Payment Method
                  </h2>

                </div>

                <p className="card-description">
                  Select your preferred payment method
                </p>

                <div className="payment-option">

                  <input
                    type="radio"
                    className="payment-radio"
                    checked={
                      formData.paymentMethod ===
                      "COD"
                    }
                    onChange={() =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          paymentMethod:
                            "COD",
                        })
                      )
                    }
                  />

                  <div className="payment-content">

                    <div className="payment-title">
                      Cash on Delivery
                    </div>

                    <div className="payment-description">
                      Pay when your order arrives
                    </div>

                  </div>

                </div>

                <div
                  className="payment-option"
                  style={{
                    marginTop: 12,
                    borderColor:
                      "#e5e7eb",
                    background:
                      "#f8fafc",
                    opacity: 0.7,
                  }}
                >

                  <input
                    type="radio"
                    className="payment-radio"
                    disabled
                  />

                  <div className="payment-content">

                    <div className="payment-title">
                      Online Payment
                    </div>

                    <div className="payment-description">
                      UPI / Card / Net Banking
                    </div>

                    <div className="payment-unavailable">
                      Currently Unavailable
                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  NOTES
              ================================================= */}

              <div className="checkout-card">

                <div className="card-heading">

                  <div className="card-icon">
                    📝
                  </div>

                  <h2>
                    Order Notes
                  </h2>

                </div>

                <p className="card-description">
                  Any special instructions?
                </p>

                <div className="form-group">

                  <textarea
                    name="notes"
                    value={
                      formData.notes
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Write any special instructions for your order..."
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT SUMMARY
            ================================================= */}

            <div className="summary-card">

              <h2>
                Order Summary
              </h2>

              {/* PRODUCT */}

              <div className="summary-product">

                <div className="summary-image">

                  <img
                    src={
                      selectedVariant?.image ||
                      product.image ||
                      "/placeholder.png"
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/placeholder.png";
                    }}
                  />

                </div>

                <div className="summary-product-info">

                  <h3>
                    {product.name}
                  </h3>

                  {product.category && (
                    <div className="summary-category">
                      {product.category}
                    </div>
                  )}

                  {selectedVariant && (
                    <div className="summary-variant">

                      <div>
                        <strong>
                          Variant:
                        </strong>{" "}
                        {selectedVariant.variant_name ||
                          "—"}
                      </div>

                      <div>
                        <strong>
                          Code:
                        </strong>{" "}
                        {selectedVariant.variant_code ||
                          "—"}
                      </div>

                      <div>
                        <strong>
                          Part No:
                        </strong>{" "}
                        {selectedVariant.part_number ||
                          "—"}
                      </div>

                    </div>
                  )}

                  <div className="summary-price">

                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}

                    {oldPrice >
                      price && (
                      <span className="old-price">
                        ₹
                        {oldPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}

                  </div>

                </div>

              </div>

              {/* QUANTITY */}

              <div className="quantity-row">

                <span className="quantity-label">
                  Quantity
                </span>

                <div className="quantity-controls">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                  >
                    −
                  </button>

                  <span className="quantity-number">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              {/* PRICE */}

              <div className="price-details">

                <div className="price-row">

                  <span>
                    Product Price
                  </span>

                  <span>
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="price-row">

                  <span>
                    Quantity
                  </span>

                  <span>
                    × {quantity}
                  </span>

                </div>

                <div className="price-row">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="price-row">

                  <span>
                    Shipping
                  </span>

                  <span
                    className={
                      shippingCharge ===
                      0
                        ? "free-shipping"
                        : ""
                    }
                  >
                    {shippingCharge ===
                    0
                      ? "FREE"
                      : `₹${shippingCharge.toLocaleString(
                          "en-IN"
                        )}`}
                  </span>

                </div>

                {discount > 0 && (
                  <div className="price-row">

                    <span>
                      Discount
                    </span>

                    <span className="discount-text">
                      - ₹
                      {discount.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>
                )}

              </div>

              {/* TOTAL */}

              <div className="total-row">

                <span className="total-label">
                  Grand Total
                </span>

                <span className="total-value">
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* PLACE ORDER */}

              <button
                className="place-order-btn"
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  placingOrder ||
                  savingAddress
                }
              >
                {placingOrder
                  ? "Placing Order..."
                  : savingAddress
                  ? "Saving Address..."
                  : "Place Order"}
              </button>

              <div className="secure-text">
                🔒 Your information is securely protected
              </div>

              <button
                className="back-btn"
                onClick={() =>
                  navigate(-1)
                }
              >
                ← Back to Product
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Checkout;