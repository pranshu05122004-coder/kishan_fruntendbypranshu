import { API_URL, API_BASE } from "../config/api";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

// =====================================
// PRODUCT VARIANT
// =====================================

interface ProductVariant {
  id: number;
  product_id: number;
  variant_name: string;
  variant_code?: string;
  part_number?: string | null;
  price?: number | string;
  old_price?: number | string | null;
  image?: string | null;
  pdf_path?: string | null;
  stock?: number;
  status?: number;
}

// =====================================
// PRODUCT
// =====================================

interface Product {
  id: number;
  name: string;
  slug?: string;
  category: string;
  description: string;
  price: number | string;
  old_price?: number | string | null;
  image: string;
  rating: number | string;
  stock: boolean | number;
  variants?: ProductVariant[];
}

// =====================================
// COMPONENT
// =====================================

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const variantId =
    searchParams.get("variantId");

  // =====================================
  // STATES
  // =====================================

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [imageLoaded, setImageLoaded] =
    useState(false);

  const [cartAdded, setCartAdded] =
    useState(false);

  const [wishlistAdded, setWishlistAdded] =
    useState(false);

  const [imageZoom, setImageZoom] =
    useState(false);

  // =====================================
  // LOAD PRODUCT
  // =====================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        setSelectedVariant(null);
        setQuantity(1);

        if (!id) {
          throw new Error(
            "Product ID missing."
          );
        }

        console.log(
          "📦 Product ID:",
          id
        );

        console.log(
          "🆔 Variant ID:",
          variantId
        );

        const response = await fetch(
          `${API_BASE}/products/${id}`
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Product not found."
          );
        }

        console.log(
          "📦 PRODUCT DETAILS:",
          data.product
        );

        setProduct(data.product);

        // =====================================
        // FIND SELECTED VARIANT
        // =====================================

        const productVariants =
          data.product?.variants || [];

        if (
          variantId &&
          productVariants.length > 0
        ) {
          const foundVariant =
            productVariants.find(
              (
                variant: ProductVariant
              ) =>
                String(variant.id) ===
                String(variantId)
            );

          if (foundVariant) {
            console.log(
              "✅ SELECTED VARIANT:",
              foundVariant
            );

            setSelectedVariant(
              foundVariant
            );
          } else {
            console.warn(
              "⚠️ Variant not found:",
              variantId
            );

            setSelectedVariant(null);
          }
        } else {
          setSelectedVariant(null);
        }
      } catch (error) {
        console.error(
          "❌ Product Details Error:",
          error
        );

        setError(
          "Product load nahi ho pa raha hai."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, variantId]);

  // =====================================
  // DISPLAY VALUES
  // =====================================

  const displayName =
    selectedVariant?.variant_name ||
    product?.name ||
    "";

  const displayCode =
    selectedVariant?.variant_code ||
    "";

  const displayPartNumber =
    selectedVariant?.part_number ||
    "";

  const price =
    selectedVariant?.price !== undefined
      ? Number(selectedVariant.price)
      : product
      ? Number(product.price)
      : 0;

  const oldPrice =
    selectedVariant?.old_price !== null &&
    selectedVariant?.old_price !== undefined &&
    selectedVariant?.old_price !== ""
      ? Number(selectedVariant.old_price)
      : product?.old_price !== null &&
        product?.old_price !== undefined &&
        product?.old_price !== ""
      ? Number(product.old_price)
      : null;

  const rating = product
    ? Number(product.rating)
    : 0;

  // =====================================
  // DISCOUNT
  // =====================================

  const discount =
    oldPrice !== null &&
    oldPrice > price
      ? Math.round(
          ((oldPrice - price) /
            oldPrice) *
            100
        )
      : 0;

  // =====================================
  // STOCK
  // =====================================

  const variantStock =
    selectedVariant?.stock !== undefined
      ? Number(selectedVariant.stock)
      : null;

  const isInStock =
    selectedVariant
      ? variantStock !== null &&
        variantStock > 0
      : product
      ? Boolean(product.stock)
      : false;

  // =====================================
  // TOTAL
  // =====================================

  const totalPrice =
    price * quantity;

  // =====================================
  // IMAGE
  // =====================================

  const displayImage =
    selectedVariant?.image ||
    product?.image ||
    "";

  // =====================================
  // PDF URL
  // =====================================

  const pdfUrl =
    selectedVariant?.pdf_path
      ? selectedVariant.pdf_path.startsWith(
          "http"
        )
        ? selectedVariant.pdf_path
        : `${API_URL}${selectedVariant.pdf_path}`
      : product
      ? `${API_URL}/pdf/${product.id}.pdf`
      : null;

  // =====================================
  // MORE DETAILS / PDF
  // =====================================

  const handleMoreDetails = () => {
    if (!pdfUrl) {
      alert(
        "Product/Variant PDF available nahi hai."
      );
      return;
    }

    console.log(
      "📄 Opening PDF:",
      pdfUrl
    );

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================
  // QUANTITY
  // =====================================

  const increaseQuantity = () => {
    if (
      selectedVariant &&
      variantStock !== null &&
      quantity >= variantStock
    ) {
      return;
    }

    setQuantity(
      (previous) =>
        previous + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity(
      (previous) =>
        previous > 1
          ? previous - 1
          : 1
    );
  };

  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = () => {
    if (
      !product ||
      !isInStock
    ) {
      return;
    }

    console.log(
      "🛒 ADD TO CART:",
      {
        productId: product.id,
        variantId:
          selectedVariant?.id || null,
        quantity,
        price,
      }
    );

    setCartAdded(true);

    setTimeout(() => {
      setCartAdded(false);
    }, 900);

    alert(
      `${displayName} x ${quantity} added to cart 🛒`
    );
  };

  // =====================================
  // WISHLIST
  // =====================================

  const handleWishlist = () => {
    if (!product) {
      return;
    }

    setWishlistAdded(
      (previous) => !previous
    );

    alert(
      `${displayName} added to wishlist ❤️`
    );
  };

  // =====================================
  // CHECKOUT
  // =====================================

  const handleCheckout = () => {
    if (
      !product ||
      !isInStock
    ) {
      return;
    }

    const checkoutUrl =
      selectedVariant
        ? `/checkout?productId=${product.id}&variantId=${selectedVariant.id}&quantity=${quantity}`
        : `/checkout?productId=${product.id}&quantity=${quantity}`;

    console.log(
      "🛒 CHECKOUT URL:",
      checkoutUrl
    );

    navigate(
      checkoutUrl,
      {
        state: {
          product,
          variant:
            selectedVariant,
          productId:
            product.id,
          variantId:
            selectedVariant?.id ||
            null,
          quantity,
        },
      }
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <section className="product-details-page premium-details-page">

        <div className="details-bg-grid"></div>

        <div className="details-orb details-orb-one"></div>
        <div className="details-orb details-orb-two"></div>

        <div className="premium-loading">

          <div className="loading-product-icon">

            <div className="loading-circle"></div>

            <i className="fas fa-box-open"></i>

          </div>

          <span>
            PRODUCT DETAILS
          </span>

          <h2>
            Loading Product
            <b>...</b>
          </h2>

          <p>
            Preparing product information
            for you.
          </p>

          <div className="loading-line">
            <span></span>
          </div>

        </div>

        <style>{PRODUCT_DETAILS_CSS}</style>
      </section>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (
    error ||
    !product
  ) {
    return (
      <section className="product-details-page premium-details-page">

        <div className="details-bg-grid"></div>

        <div className="premium-error">

          <div className="error-box-icon">
            <i className="fas fa-box-open"></i>
          </div>

          <span>
            PRODUCT UNAVAILABLE
          </span>

          <h2>
            Product Not Found
          </h2>

          <p>
            {error ||
              "This product does not exist."}
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

        <style>{PRODUCT_DETAILS_CSS}</style>
      </section>
    );
  }

  // =====================================
  // MAIN
  // =====================================

  return (
    <section className="product-details-page premium-details-page">

      {/* =================================
          BACKGROUND
      ================================= */}

      <div className="details-bg-grid"></div>

      <div className="details-orb details-orb-one"></div>
      <div className="details-orb details-orb-two"></div>
      <div className="details-orb details-orb-three"></div>

      <div className="details-floating-shape shape-a"></div>
      <div className="details-floating-shape shape-b"></div>

      <div className="product-details-container">

        {/* =================================
            TOP NAV
        ================================= */}

        <div className="details-topbar">

          <button
            type="button"
            className="back-products"
            onClick={() =>
              navigate("/products")
            }
          >
            <span className="back-icon">
              <i className="fas fa-arrow-left"></i>
            </span>

            <span>
              Back to Products
            </span>
          </button>

          <div className="details-breadcrumb">

            <span>
              Products
            </span>

            <i className="fas fa-chevron-right"></i>

            <strong>
              {product.category}
            </strong>

          </div>

        </div>

        {/* =================================
            MAIN PRODUCT CARD
        ================================= */}

        <div className="product-details-card">

          {/* =================================
              IMAGE AREA
          ================================= */}

          <div
            className={`details-image ${
              imageZoom
                ? "image-zoomed"
                : ""
            }`}
            onMouseEnter={() =>
              setImageZoom(true)
            }
            onMouseLeave={() =>
              setImageZoom(false)
            }
          >

            {/* IMAGE */}

            {!imageLoaded && (
              <div className="image-loader">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            )}

            <img
              src={displayImage}
              alt={displayName}
              onLoad={() =>
                setImageLoaded(true)
              }
              onError={() =>
                setImageLoaded(true)
              }
            />

            {/* IMAGE GRADIENT */}

            <div className="details-image-overlay"></div>

            {/* SALE */}

            {discount > 0 && (
              <div className="details-sale">

                <i className="fas fa-bolt"></i>

                <span>
                  {discount}% OFF
                </span>

              </div>
            )}

            {/* CATEGORY */}

            <div className="image-category">

              <i className="fas fa-tag"></i>

              {product.category}

            </div>

            {/* ZOOM */}

            <div className="zoom-hint">

              <i className="fas fa-expand"></i>

              <span>
                Hover to explore
              </span>

            </div>

            {/* IMAGE DECORATION */}

            <div className="image-dots">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {/* PRODUCT NUMBER */}

            <div className="image-product-number">
              #
              {String(
                product.id
              ).padStart(4, "0")}
            </div>

          </div>

          {/* =================================
              INFO
          ================================= */}

          <div className="details-info">

            {/* EYEBROW */}

            <div className="details-eyebrow">

              <span></span>

              INDUSTRIAL PRODUCT

              <span></span>

            </div>

            {/* NAME */}

            <h1>
              {displayName}
            </h1>

            {/* VARIANT ACTIVE */}

            {selectedVariant && (
              <div className="selected-variant">

                <div className="selected-variant-icon">
                  <i className="fas fa-layer-group"></i>
                </div>

                <div className="selected-variant-text">

                  <small>
                    SELECTED VARIANT
                  </small>

                  <strong>
                    {selectedVariant.variant_name}
                  </strong>

                </div>

                <div className="selected-check">
                  <i className="fas fa-check"></i>
                </div>

              </div>
            )}

            {/* CODES */}

            <div className="codes-grid">

              {displayCode && (
                <div className="code-card">

                  <span>
                    <i className="fas fa-barcode"></i>
                    Variant Code
                  </span>

                  <strong>
                    {displayCode}
                  </strong>

                </div>
              )}

              {displayPartNumber && (
                <div className="code-card">

                  <span>
                    <i className="fas fa-hashtag"></i>
                    Part Number
                  </span>

                  <strong>
                    {displayPartNumber}
                  </strong>

                </div>
              )}

            </div>

            {/* RATING */}

            <div className="details-rating">

              <div className="rating-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <i
                      key={star}
                      className={
                        star <=
                        Math.round(
                          rating
                        )
                          ? "fas fa-star"
                          : "far fa-star"
                      }
                    ></i>
                  )
                )}

              </div>

              <strong>
                {rating.toFixed(1)}
              </strong>

              <span>
                Customer Rating
              </span>

            </div>

            {/* DESCRIPTION */}

            <div className="description-box">

              <span className="description-line"></span>

              <p>
                {product.description}
              </p>

            </div>

            {/* PRICE */}

            <div className="details-price-box">

              <div>

                <span>
                  OUR PRICE
                </span>

                <div className="price-main">

                  <strong>
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  {oldPrice !== null &&
                    oldPrice > price && (
                      <del>
                        ₹
                        {oldPrice.toLocaleString(
                          "en-IN"
                        )}
                      </del>
                    )}

                </div>

              </div>

              {discount > 0 && (
                <div className="saved-badge">

                  <i className="fas fa-arrow-down"></i>

                  Save {discount}%

                </div>
              )}

            </div>

            {/* STOCK */}

            <div
              className={
                isInStock
                  ? "stock-box available"
                  : "stock-box unavailable"
              }
            >

              <div className="stock-status-icon">

                <i
                  className={
                    isInStock
                      ? "fas fa-check"
                      : "fas fa-times"
                  }
                ></i>

              </div>

              <div>

                <strong>
                  {isInStock
                    ? "Available"
                    : "Currently Unavailable"}
                </strong>

                <span>
                  {isInStock
                    ? selectedVariant
                      ? `${variantStock} units available`
                      : "Ready to order"
                    : "Please check back later"}
                </span>

              </div>

              {isInStock && (
                <span className="stock-live">
                  IN STOCK
                </span>
              )}

            </div>

            {/* QUANTITY */}

            {isInStock && (
              <div className="quantity-section">

                <div className="quantity-title">

                  <span>
                    Quantity
                  </span>

                  <small>
                    {variantStock !==
                      null
                      ? `Max ${variantStock}`
                      : "Select quantity"}
                  </small>

                </div>

                <div className="quantity-box">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                  >
                    <i className="fas fa-minus"></i>
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
                      selectedVariant
                        ? variantStock !==
                            null &&
                          quantity >=
                            variantStock
                        : false
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </button>

                </div>

              </div>
            )}

            {/* TOTAL */}

            {isInStock && (
              <div className="details-total">

                <div>

                  <span>
                    Total Amount
                  </span>

                  <small>
                    {quantity} × ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </small>

                </div>

                <strong>
                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>
            )}

            {/* ACTIONS */}

            <div className="details-actions">

              {/* CART */}

              <button
                type="button"
                className={`details-cart-btn ${
                  cartAdded
                    ? "cart-success"
                    : ""
                }`}
                disabled={!isInStock}
                onClick={
                  handleAddToCart
                }
              >

                <span className="action-icon">

                  <i
                    className={
                      cartAdded
                        ? "fas fa-check"
                        : "fas fa-shopping-cart"
                    }
                  ></i>

                </span>

                <span>
                  {cartAdded
                    ? "Added to Cart"
                    : isInStock
                    ? "Add to Cart"
                    : "Out of Stock"}
                </span>

              </button>

              {/* CHECKOUT */}

              <button
                type="button"
                className="details-checkout-btn"
                disabled={!isInStock}
                onClick={
                  handleCheckout
                }
              >

                <span className="action-icon">
                  <i className="fas fa-bolt"></i>
                </span>

                <span>
                  Buy Now
                </span>

                <i className="fas fa-arrow-right action-arrow"></i>

              </button>

            </div>

            {/* SECONDARY ACTIONS */}

            <div className="secondary-actions">

              <button
                type="button"
                className={
                  wishlistAdded
                    ? "wishlist-active"
                    : ""
                }
                onClick={
                  handleWishlist
                }
              >

                <i
                  className={
                    wishlistAdded
                      ? "fas fa-heart"
                      : "far fa-heart"
                  }
                ></i>

                {wishlistAdded
                  ? "Saved"
                  : "Add to Wishlist"}

              </button>

              <button
                type="button"
                onClick={
                  handleMoreDetails
                }
              >

                <i className="fas fa-file-pdf"></i>

                Product PDF

              </button>

            </div>

            {/* PDF LARGE BUTTON */}

            <button
              type="button"
              className="more-details-btn"
              onClick={
                handleMoreDetails
              }
            >

              <span className="pdf-icon">
                <i className="fas fa-file-pdf"></i>
              </span>

              <span className="pdf-text">

                <small>
                  DOCUMENTATION
                </small>

                <strong>
                  View Product Details PDF
                </strong>

              </span>

              <span className="pdf-arrow">
                <i className="fas fa-arrow-up-right-from-square"></i>
              </span>

            </button>

            {/* TRUST */}

            <div className="details-trust">

              <div>

                <i className="fas fa-shield-halved"></i>

                <span>
                  Quality Assured
                </span>

              </div>

              <div>

                <i className="fas fa-truck-fast"></i>

                <span>
                  Fast Delivery
                </span>

              </div>

              <div>

                <i className="fas fa-headset"></i>

                <span>
                  Expert Support
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =================================
            BOTTOM INFO STRIP
        ================================= */}

        <div className="product-info-strip">

          <div className="info-strip-item">

            <div className="strip-icon">
              <i className="fas fa-certificate"></i>
            </div>

            <div>
              <strong>
                Industrial Grade
              </strong>

              <span>
                Built for reliable performance
              </span>
            </div>

          </div>

          <div className="strip-divider"></div>

          <div className="info-strip-item">

            <div className="strip-icon">
              <i className="fas fa-box"></i>
            </div>

            <div>
              <strong>
                Secure Packaging
              </strong>

              <span>
                Carefully packed before dispatch
              </span>
            </div>

          </div>

          <div className="strip-divider"></div>

          <div className="info-strip-item">

            <div className="strip-icon">
              <i className="fas fa-comments"></i>
            </div>

            <div>
              <strong>
                Customer Support
              </strong>

              <span>
                Assistance whenever required
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* =================================
          CSS
      ================================= */}

      <style>{PRODUCT_DETAILS_CSS}</style>

    </section>
  );
};

// =====================================
// PREMIUM CSS
// =====================================

const PRODUCT_DETAILS_CSS = `

/* =====================================
   ROOT
===================================== */

.premium-details-page {

  --red: #e63946;
  --red-dark: #c92f3b;
  --red-light: #fff1f2;

  --dark: #191919;
  --text: #555;
  --muted: #999;

  position: relative;

  min-height: 100vh;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 8% 12%,
      rgba(230,57,70,.07),
      transparent 25%
    ),
    radial-gradient(
      circle at 92% 75%,
      rgba(230,57,70,.055),
      transparent 25%
    ),
    #f8f6f1;

  padding:
    55px 20px 70px;
}

/* =====================================
   BACKGROUND GRID
===================================== */

.details-bg-grid {

  position: absolute;

  inset: 0;

  pointer-events: none;

  opacity: .35;

  background-image:
    linear-gradient(
      rgba(230,57,70,.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(230,57,70,.035) 1px,
      transparent 1px
    );

  background-size:
    45px 45px;

  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 85%
    );
}

/* =====================================
   ORBS
===================================== */

.details-orb {

  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(1px);

  animation:
    detailsOrbFloat
    9s
    ease-in-out
    infinite;
}

.details-orb-one {

  width: 280px;
  height: 280px;

  top: 80px;
  left: -150px;

  background:
    radial-gradient(
      circle,
      rgba(230,57,70,.09),
      transparent 70%
    );
}

.details-orb-two {

  width: 350px;
  height: 350px;

  right: -170px;
  top: 420px;

  background:
    radial-gradient(
      circle,
      rgba(230,57,70,.07),
      transparent 70%
    );

  animation-delay:
    -3s;
}

.details-orb-three {

  width: 180px;
  height: 180px;

  bottom: 30px;
  left: 45%;

  background:
    radial-gradient(
      circle,
      rgba(230,57,70,.045),
      transparent 70%
    );

  animation-delay:
    -6s;
}

@keyframes detailsOrbFloat {

  0%,
  100% {
    transform:
      translate3d(
        0,
        0,
        0
      );
  }

  50% {
    transform:
      translate3d(
        20px,
        -25px,
        0
      );
  }

}

/* =====================================
   FLOATING SHAPES
===================================== */

.details-floating-shape {

  position: absolute;

  border:
    1px solid
    rgba(230,57,70,.08);

  pointer-events: none;

  animation:
    shapeMove
    12s
    ease-in-out
    infinite;
}

.shape-a {

  width: 70px;
  height: 70px;

  right: 8%;
  top: 180px;

  transform:
    rotate(45deg);
}

.shape-b {

  width: 45px;
  height: 45px;

  left: 6%;
  bottom: 200px;

  border-radius: 50%;

  animation-delay:
    -5s;
}

@keyframes shapeMove {

  0%,
  100% {
    transform:
      translateY(0)
      rotate(0);
  }

  50% {
    transform:
      translateY(-25px)
      rotate(20deg);
  }

}

/* =====================================
   CONTAINER
===================================== */

.product-details-container {

  position: relative;

  z-index: 2;

  width: 100%;

  max-width: 1180px;

  margin: 0 auto;
}

/* =====================================
   TOP BAR
===================================== */

.details-topbar {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 24px;

  animation:
    detailsReveal
    .7s
    ease
    both;
}

@keyframes detailsReveal {

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

/* =====================================
   BACK BUTTON
===================================== */

.back-products {

  display: flex;

  align-items: center;

  gap: 9px;

  border: none;

  background: transparent;

  color: #555;

  font-size: 12px;

  font-weight: 800;

  cursor: pointer;

  transition:
    color .25s ease;
}

.back-products:hover {
  color:
    var(--red);
}

.back-icon {

  width: 32px;
  height: 32px;

  display: flex;

  align-items: center;

  justify-content: center;

  border:
    1px solid #e5e5e5;

  border-radius: 9px;

  background:
    rgba(255,255,255,.8);

  transition:
    all .25s ease;
}

.back-products:hover
.back-icon {

  background:
    var(--red);

  border-color:
    var(--red);

  color:
    #fff;

  transform:
    translateX(-3px);
}

/* =====================================
   BREADCRUMB
===================================== */

.details-breadcrumb {

  display: flex;

  align-items: center;

  gap: 9px;

  color:
    #aaa;

  font-size: 10px;

  font-weight: 700;
}

.details-breadcrumb i {
  font-size: 8px;
}

.details-breadcrumb strong {
  color:
    var(--red);

  text-transform:
    uppercase;

  letter-spacing:
    .7px;
}

/* =====================================
   MAIN CARD
===================================== */

.product-details-card {

  display:
    grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  overflow:
    hidden;

  border:
    1px solid
    rgba(0,0,0,.06);

  border-radius:
    25px;

  background:
    rgba(255,255,255,.94);

  box-shadow:
    0 25px 70px
    rgba(0,0,0,.085);

  animation:
    cardReveal
    .75s
    .08s
    ease
    both;
}

@keyframes cardReveal {

  from {
    opacity: 0;

    transform:
      translateY(35px)
      scale(.98);
  }

  to {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);
  }

}

/* =====================================
   IMAGE
===================================== */

.details-image {

  position:
    relative;

  min-height:
    650px;

  overflow:
    hidden;

  background:
    linear-gradient(
      135deg,
      #f2f2f2,
      #e9e9e9
    );

  cursor:
    zoom-in;
}

.details-image img {

  width:
    100%;

  height:
    100%;

  min-height:
    650px;

  display:
    block;

  object-fit:
    cover;

  opacity:
    0;

  transform:
    scale(1.025);

  transition:
    opacity .6s ease,
    transform 1s
      cubic-bezier(.2,.8,.2,1);
}

.details-image img[src] {
  opacity:
    1;
}

.details-image.image-zoomed img {

  transform:
    scale(1.07);
}

/* =====================================
   IMAGE OVERLAY
===================================== */

.details-image-overlay {

  position:
    absolute;

  inset:
    0;

  pointer-events:
    none;

  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,.10),
      transparent 30%,
      transparent 65%,
      rgba(0,0,0,.48)
    );
}

/* =====================================
   IMAGE LOADER
===================================== */

.image-loader {

  position:
    absolute;

  inset:
    0;

  z-index:
    5;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  background:
    #eeeeee;

  color:
    var(--red);

  font-size:
    28px;
}

/* =====================================
   SALE
===================================== */

.details-sale {

  position:
    absolute;

  top:
    20px;

  left:
    20px;

  z-index:
    6;

  display:
    flex;

  align-items:
    center;

  gap:
    7px;

  padding:
    9px 13px;

  border-radius:
    10px;

  background:
    linear-gradient(
      135deg,
      #e63946,
      #bd2935
    );

  color:
    #fff;

  font-size:
    11px;

  font-weight:
    900;

  letter-spacing:
    .5px;

  box-shadow:
    0 10px 25px
    rgba(230,57,70,.25);

  animation:
    saleBounce
    2.2s
    ease-in-out
    infinite;
}

@keyframes saleBounce {

  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-3px);
  }

}

/* =====================================
   IMAGE CATEGORY
===================================== */

.image-category {

  position:
    absolute;

  left:
    20px;

  bottom:
    20px;

  z-index:
    5;

  display:
    flex;

  align-items:
    center;

  gap:
    6px;

  padding:
    8px 12px;

  border:
    1px solid
    rgba(255,255,255,.2);

  border-radius:
    8px;

  background:
    rgba(0,0,0,.45);

  backdrop-filter:
    blur(8px);

  color:
    #fff;

  font-size:
    10px;

  font-weight:
    800;

  text-transform:
    uppercase;

  letter-spacing:
    1px;
}

.image-category i {
  color:
    #ff7781;
}

/* =====================================
   ZOOM
===================================== */

.zoom-hint {

  position:
    absolute;

  right:
    20px;

  bottom:
    20px;

  z-index:
    5;

  display:
    flex;

  align-items:
    center;

  gap:
    6px;

  color:
    rgba(255,255,255,.8);

  font-size:
    9px;

  opacity:
    .7;

  transition:
    opacity .3s ease;
}

.details-image:hover
.zoom-hint {
  opacity:
    1;
}

/* =====================================
   DOTS
===================================== */

.image-dots {

  position:
    absolute;

  top:
    50%;

  right:
    20px;

  display:
    flex;

  flex-direction:
    column;

  gap:
    5px;

  z-index:
    5;
}

.image-dots span {

  width:
    4px;

  height:
    4px;

  border-radius:
    50%;

  background:
    rgba(255,255,255,.75);

  animation:
    imageDot
    2s
    ease-in-out
    infinite;
}

.image-dots span:nth-child(2) {
  animation-delay:
    .2s;
}

.image-dots span:nth-child(3) {
  animation-delay:
    .4s;
}

.image-dots span:nth-child(4) {
  animation-delay:
    .6s;
}

@keyframes imageDot {

  0%,
  100% {
    opacity:
      .4;

    transform:
      translateX(0);
  }

  50% {
    opacity:
      1;

    transform:
      translateX(-4px);
  }

}

/* =====================================
   PRODUCT NUMBER
===================================== */

.image-product-number {

  position:
    absolute;

  top:
    22px;

  right:
    22px;

  z-index:
    5;

  color:
    rgba(255,255,255,.7);

  font-size:
    10px;

  font-weight:
    800;

  font-family:
    monospace;
}

/* =====================================
   INFO
===================================== */

.details-info {

  position:
    relative;

  padding:
    42px 44px;

  overflow:
    hidden;
}

.details-info::before {

  content:
    "";

  position:
    absolute;

  width:
    200px;

  height:
    200px;

  right:
    -120px;

  top:
    -120px;

  border-radius:
    50%;

  background:
    rgba(230,57,70,.045);

  pointer-events:
    none;
}

/* =====================================
   EYEBROW
===================================== */

.details-eyebrow {

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  margin-bottom:
    13px;

  color:
    var(--red);

  font-size:
    9px;

  font-weight:
    900;

  letter-spacing:
    1.8px;
}

.details-eyebrow span {

  width:
    24px;

  height:
    1px;

  background:
    var(--red);
}

/* =====================================
   TITLE
===================================== */

.details-info h1 {

  position:
    relative;

  margin:
    0 0 18px;

  color:
    var(--dark);

  font-size:
    clamp(32px, 3vw, 44px);

  line-height:
    1.1;

  font-weight:
    850;

  letter-spacing:
    -1.5px;
}

/* =====================================
   SELECTED VARIANT
===================================== */

.selected-variant {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  margin-bottom:
    12px;

  padding:
    10px;

  border:
    1px solid
    rgba(230,57,70,.13);

  border-radius:
    12px;

  background:
    linear-gradient(
      135deg,
      #fff6f7,
      #fff
    );

  animation:
    variantReveal
    .4s
    ease
    both;
}

@keyframes variantReveal {

  from {
    opacity:
      0;

    transform:
      translateX(-8px);
  }

  to {
    opacity:
      1;

    transform:
      translateX(0);
  }

}

.selected-variant-icon {

  width:
    38px;

  height:
    38px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    10px;

  background:
    var(--red-light);

  color:
    var(--red);
}

.selected-variant-text {

  display:
    flex;

  flex-direction:
    column;

  flex: 1;

  gap:
    2px;
}

.selected-variant-text small {

  color:
    #aaa;

  font-size:
    7px;

  font-weight:
    900;

  letter-spacing:
    1px;
}

.selected-variant-text strong {

  color:
    #333;

  font-size:
    11px;
}

.selected-check {

  width:
    24px;

  height:
    24px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    var(--red);

  color:
    #fff;

  font-size:
    9px;
}

/* =====================================
   CODES
===================================== */

.codes-grid {

  display:
    grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap:
    8px;

  margin-bottom:
    14px;
}

.code-card {

  display:
    flex;

  flex-direction:
    column;

  gap:
    4px;

  padding:
    9px 11px;

  border:
    1px solid #ededed;

  border-radius:
    9px;

  background:
    #fafafa;
}

.code-card span {

  color:
    #999;

  font-size:
    8px;

  font-weight:
    800;

  text-transform:
    uppercase;

  letter-spacing:
    .5px;
}

.code-card span i {
  margin-right:
    5px;

  color:
    var(--red);
}

.code-card strong {

  color:
    #333;

  font-size:
    11px;

  word-break:
    break-word;
}

/* =====================================
   RATING
===================================== */

.details-rating {

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  margin-bottom:
    19px;
}

.rating-stars {

  display:
    flex;

  gap:
    2px;

  color:
    #f3a923;

  font-size:
    11px;
}

.details-rating strong {

  color:
    #333;

  font-size:
    11px;
}

.details-rating > span {

  color:
    #aaa;

  font-size:
    10px;
}

/* =====================================
   DESCRIPTION
===================================== */

.description-box {

  position:
    relative;

  display:
    flex;

  gap:
    12px;

  margin-bottom:
    22px;
}

.description-line {

  width:
    3px;

  min-width:
    3px;

  border-radius:
    10px;

  background:
    linear-gradient(
      to bottom,
      var(--red),
      rgba(230,57,70,.15)
    );
}

.description-box p {

  margin:
    0;

  color:
    #707070;

  font-size:
    12px;

  line-height:
    1.75;
}

/* =====================================
   PRICE
===================================== */

.details-price-box {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    15px;

  margin-bottom:
    15px;

  padding:
    15px;

  border:
    1px solid #eeeeee;

  border-radius:
    13px;

  background:
    linear-gradient(
      135deg,
      #fff,
      #fafafa
    );
}

.details-price-box > div:first-child
> span {

  display:
    block;

  margin-bottom:
    3px;

  color:
    #aaa;

  font-size:
    8px;

  font-weight:
    900;

  letter-spacing:
    1px;
}

.price-main {

  display:
    flex;

  align-items:
    baseline;

  gap:
    8px;
}

.price-main strong {

  color:
    #222;

  font-size:
    29px;

  line-height:
    1;
}

.price-main del {

  color:
    #aaa;

  font-size:
    11px;
}

.saved-badge {

  display:
    flex;

  align-items:
    center;

  gap:
    5px;

  padding:
    7px 9px;

  border-radius:
    8px;

  background:
    #eaf8ef;

  color:
    #218838;

  font-size:
    9px;

  font-weight:
    900;
}

/* =====================================
   STOCK
===================================== */

.stock-box {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  margin-bottom:
    17px;

  padding:
    10px 12px;

  border:
    1px solid;

  border-radius:
    11px;
}

.stock-box.available {

  border-color:
    rgba(33,136,56,.15);

  background:
    #f5fbf7;

  color:
    #218838;
}

.stock-box.unavailable {

  border-color:
    rgba(220,53,69,.15);

  background:
    #fff7f7;

  color:
    #dc3545;
}

.stock-status-icon {

  width:
    30px;

  height:
    30px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    currentColor;

  color:
    #218838;

  flex-shrink:
    0;
}

.stock-box.unavailable
.stock-status-icon {
  color:
    #dc3545;
}

.stock-status-icon i {
  color:
    #fff;

  font-size:
    10px;
}

.stock-box > div:nth-child(2) {

  display:
    flex;

  flex-direction:
    column;

  flex: 1;

  gap:
    2px;
}

.stock-box strong {

  color:
    currentColor;

  font-size:
    10px;
}

.stock-box span {

  color:
    #999;

  font-size:
    9px;
}

.stock-live {

  color:
    #218838 !important;

  font-size:
    7px !important;

  font-weight:
    900;

  letter-spacing:
    .7px;

  animation:
    stockLive
    1.8s
    ease-in-out
    infinite;
}

@keyframes stockLive {

  0%,
  100% {
    opacity:
      1;
  }

  50% {
    opacity:
      .5;
  }

}

/* =====================================
   QUANTITY
===================================== */

.quantity-section {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-bottom:
    13px;
}

.quantity-title {

  display:
    flex;

  flex-direction:
    column;

  gap:
    2px;
}

.quantity-title span {

  color:
    #444;

  font-size:
    11px;

  font-weight:
    800;
}

.quantity-title small {

  color:
    #aaa;

  font-size:
    8px;
}

.quantity-box {

  display:
    flex;

  align-items:
    center;

  height:
    38px;

  overflow:
    hidden;

  border:
    1px solid #e3e3e3;

  border-radius:
    9px;

  background:
    #fff;
}

.quantity-box button {

  width:
    37px;

  height:
    100%;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    none;

  background:
    #f7f7f7;

  color:
    #555;

  cursor:
    pointer;

  transition:
    all .2s ease;
}

.quantity-box button:hover:not(:disabled) {

  background:
    var(--red);

  color:
    #fff;
}

.quantity-box button:disabled {

  color:
    #ccc;

  cursor:
    not-allowed;
}

.quantity-box strong {

  width:
    42px;

  text-align:
    center;

  color:
    #222;

  font-size:
    13px;
}

/* =====================================
   TOTAL
===================================== */

.details-total {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-bottom:
    15px;

  padding:
    12px 0;

  border-top:
    1px solid #eee;

  border-bottom:
    1px solid #eee;
}

.details-total > div {

  display:
    flex;

  flex-direction:
    column;

  gap:
    2px;
}

.details-total span {

  color:
    #444;

  font-size:
    11px;

  font-weight:
    800;
}

.details-total small {

  color:
    #aaa;

  font-size:
    8px;
}

.details-total > strong {

  color:
    var(--red);

  font-size:
    21px;
}

/* =====================================
   ACTIONS
===================================== */

.details-actions {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    9px;

  margin-bottom:
    9px;
}

.details-actions button {

  position:
    relative;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    7px;

  min-height:
    47px;

  padding:
    11px 13px;

  border:
    none;

  border-radius:
    10px;

  font-size:
    11px;

  font-weight:
    900;

  cursor:
    pointer;

  overflow:
    hidden;

  transition:
    all .3s
    cubic-bezier(.2,.8,.2,1);
}

.details-cart-btn {

  background:
    linear-gradient(
      135deg,
      #e63946,
      #c92f3b
    );

  color:
    #fff;

  box-shadow:
    0 8px 22px
    rgba(230,57,70,.19);
}

.details-cart-btn:hover:not(:disabled) {

  transform:
    translateY(-3px);

  box-shadow:
    0 12px 28px
    rgba(230,57,70,.28);
}

.details-cart-btn:disabled {

  background:
    #aaa;

  box-shadow:
    none;

  cursor:
    not-allowed;
}

.details-checkout-btn {

  background:
    #202020;

  color:
    #fff;

  box-shadow:
    0 8px 20px
    rgba(0,0,0,.12);
}

.details-checkout-btn:hover:not(:disabled) {

  background:
    var(--red);

  transform:
    translateY(-3px);

  box-shadow:
    0 12px 28px
    rgba(230,57,70,.23);
}

.details-checkout-btn:disabled {

  background:
    #aaa;

  box-shadow:
    none;

  cursor:
    not-allowed;
}

.action-icon {

  width:
    24px;

  height:
    24px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    rgba(255,255,255,.13);
}

.action-arrow {

  margin-left:
    auto;

  font-size:
    9px;

  opacity:
    .65;

  transition:
    transform .25s ease;
}

.details-checkout-btn:hover
.action-arrow {

  transform:
    translateX(4px);

  opacity:
    1;
}

.cart-success {

  background:
    linear-gradient(
      135deg,
      #218838,
      #176b2b
    ) !important;

  animation:
    cartSuccess
    .45s
    ease;
}

@keyframes cartSuccess {

  0% {
    transform:
      scale(1);
  }

  50% {
    transform:
      scale(1.025);
  }

  100% {
    transform:
      scale(1);
  }

}

/* =====================================
   SECONDARY
===================================== */

.secondary-actions {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    9px;

  margin-bottom:
    10px;
}

.secondary-actions button {

  min-height:
    38px;

  border:
    1px solid #e7e7e7;

  border-radius:
    9px;

  background:
    #fff;

  color:
    #555;

  font-size:
    10px;

  font-weight:
    800;

  cursor:
    pointer;

  transition:
    all .25s ease;
}

.secondary-actions button:hover {

  border-color:
    var(--red);

  color:
    var(--red);

  background:
    var(--red-light);

  transform:
    translateY(-2px);
}

.secondary-actions i {
  margin-right:
    6px;
}

.secondary-actions
.wishlist-active {

  border-color:
    rgba(230,57,70,.25);

  background:
    var(--red-light);

  color:
    var(--red);

  animation:
    wishlistPop
    .4s
    ease;
}

@keyframes wishlistPop {

  0% {
    transform:
      scale(.95);
  }

  60% {
    transform:
      scale(1.03);
  }

  100% {
    transform:
      scale(1);
  }

}

/* =====================================
   PDF
===================================== */

.more-details-btn {

  width:
    100%;

  display:
    flex;

  align-items:
    center;

  gap:
    11px;

  padding:
    11px;

  border:
    1px solid
    rgba(230,57,70,.15);

  border-radius:
    12px;

  background:
    linear-gradient(
      135deg,
      #fff7f7,
      #fff
    );

  color:
    var(--red);

  text-align:
    left;

  cursor:
    pointer;

  transition:
    all .3s
    cubic-bezier(.2,.8,.2,1);
}

.more-details-btn:hover {

  transform:
    translateY(-3px);

  border-color:
    rgba(230,57,70,.3);

  background:
    var(--red);

  color:
    #fff;

  box-shadow:
    0 10px 25px
    rgba(230,57,70,.18);
}

.pdf-icon {

  width:
    38px;

  height:
    38px;

  min-width:
    38px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    9px;

  background:
    #ffe8ea;

  font-size:
    16px;

  transition:
    all .3s ease;
}

.more-details-btn:hover
.pdf-icon {

  background:
    rgba(255,255,255,.15);

  transform:
    rotate(-5deg);
}

.pdf-text {

  display:
    flex;

  flex-direction:
    column;

  gap:
    3px;

  flex: 1;
}

.pdf-text small {

  font-size:
    7px;

  font-weight:
    900;

  letter-spacing:
    1px;

  opacity:
    .6;
}

.pdf-text strong {

  font-size:
    11px;
}

.pdf-arrow {

  width:
    28px;

  height:
    28px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    rgba(230,57,70,.08);

  font-size:
    9px;

  transition:
    transform .3s ease;
}

.more-details-btn:hover
.pdf-arrow {

  background:
    rgba(255,255,255,.15);

  transform:
    translate(3px,-3px);
}

/* =====================================
   TRUST
===================================== */

.details-trust {

  display:
    grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap:
    5px;

  margin-top:
    13px;

  padding-top:
    13px;

  border-top:
    1px solid #eee;
}

.details-trust > div {

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  gap:
    4px;

  text-align:
    center;
}

.details-trust i {

  color:
    var(--red);

  font-size:
    13px;
}

.details-trust span {

  color:
    #999;

  font-size:
    7px;

  font-weight:
    800;
}

/* =====================================
   BOTTOM INFO STRIP
===================================== */

.product-info-strip {

  display:
    grid;

  grid-template-columns:
    1fr auto 1fr auto 1fr;

  align-items:
    center;

  gap:
    15px;

  margin-top:
    22px;

  padding:
    17px 20px;

  border:
    1px solid #e9e9e9;

  border-radius:
    17px;

  background:
    rgba(255,255,255,.75);

  backdrop-filter:
    blur(14px);

  box-shadow:
    0 12px 35px
    rgba(0,0,0,.035);

  animation:
    stripReveal
    .8s
    .3s
    ease
    both;
}

@keyframes stripReveal {

  from {
    opacity:
      0;

    transform:
      translateY(15px);
  }

  to {
    opacity:
      1;

    transform:
      translateY(0);
  }

}

.info-strip-item {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  padding:
    3px 8px;
}

.strip-icon {

  width:
    38px;

  height:
    38px;

  min-width:
    38px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    10px;

  background:
    var(--red-light);

  color:
    var(--red);

  transition:
    all .3s ease;
}

.info-strip-item:hover
.strip-icon {

  background:
    var(--red);

  color:
    #fff;

  transform:
    translateY(-3px);
}

.info-strip-item strong {

  display:
    block;

  color:
    #333;

  font-size:
    10px;
}

.info-strip-item span {

  display:
    block;

  margin-top:
    3px;

  color:
    #999;

  font-size:
    8px;
}

.strip-divider {

  width:
    1px;

  height:
    38px;

  background:
    #e8e8e8;
}

/* =====================================
   LOADING
===================================== */

.premium-loading {

  position:
    relative;

  z-index:
    2;

  min-height:
    650px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  text-align:
    center;
}

.loading-product-icon {

  position:
    relative;

  width:
    100px;

  height:
    100px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  margin-bottom:
    22px;

  color:
    var(--red);

  font-size:
    30px;
}

.loading-circle {

  position:
    absolute;

  inset:
    0;

  border:
    2px solid
    rgba(230,57,70,.12);

  border-top-color:
    var(--red);

  border-radius:
    50%;

  animation:
    loadingSpin
    1s
    linear
    infinite;
}

.loading-circle::after {

  content:
    "";

  position:
    absolute;

  inset:
    10px;

  border:
    1px dashed
    rgba(230,57,70,.2);

  border-radius:
    50%;

  animation:
    loadingSpin
    3s
    linear
    infinite reverse;
}

@keyframes loadingSpin {

  to {
    transform:
      rotate(360deg);
  }

}

.premium-loading > span,
.premium-error > span {

  color:
    var(--red);

  font-size:
    9px;

  font-weight:
    900;

  letter-spacing:
    2px;
}

.premium-loading h2 {

  margin:
    8px 0;

  color:
    #222;

  font-size:
    27px;
}

.premium-loading h2 b {

  color:
    var(--red);

  display:
    inline-block;

  width:
    25px;

  text-align:
    left;

  overflow:
    hidden;

  animation:
    loadingDots
    1.2s
    steps(4)
    infinite;
}

@keyframes loadingDots {

  0% {
    width:
      0;
  }

  100% {
    width:
      25px;
  }

}

.premium-loading p {

  margin:
    0;

  color:
    #999;

  font-size:
    12px;
}

.loading-line {

  width:
    190px;

  height:
    3px;

  margin-top:
    20px;

  overflow:
    hidden;

  border-radius:
    99px;

  background:
    #e9e9e9;
}

.loading-line span {

  display:
    block;

  width:
    45%;

  height:
    100%;

  background:
    var(--red);

  animation:
    progressMove
    1.4s
    ease-in-out
    infinite;
}

@keyframes progressMove {

  from {
    transform:
      translateX(-120%);
  }

  to {
    transform:
      translateX(400%);
  }

}

/* =====================================
   ERROR
===================================== */

.premium-error {

  position:
    relative;

  z-index:
    2;

  min-height:
    650px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  text-align:
    center;
}

.error-box-icon {

  width:
    95px;

  height:
    95px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  margin-bottom:
    20px;

  border-radius:
    50%;

  background:
    var(--red-light);

  color:
    var(--red);

  font-size:
    32px;

  animation:
    errorPulse
    2s
    infinite;
}

@keyframes errorPulse {

  0%,
  100% {
    box-shadow:
      0 0 0 0
      rgba(230,57,70,.12);
  }

  50% {
    box-shadow:
      0 0 0 15px
      rgba(230,57,70,0);
  }

}

.premium-error h2 {

  margin:
    8px 0;

  color:
    #222;

  font-size:
    29px;
}

.premium-error p {

  max-width:
    400px;

  margin:
    0 0 20px;

  color:
    #888;

  font-size:
    13px;
}

.premium-error button {

  display:
    inline-flex;

  align-items:
    center;

  gap:
    8px;

  padding:
    12px 19px;

  border:
    none;

  border-radius:
    10px;

  background:
    var(--red);

  color:
    #fff;

  font-size:
    11px;

  font-weight:
    800;

  cursor:
    pointer;

  transition:
    all .25s ease;
}

.premium-error button:hover {

  background:
    var(--red-dark);

  transform:
    translateY(-3px);

  box-shadow:
    0 10px 25px
    rgba(230,57,70,.2);
}

/* =====================================
   TABLET
===================================== */

@media (max-width: 950px) {

  .product-details-card {

    grid-template-columns:
      1fr;
  }

  .details-image {

    min-height:
      500px;
  }

  .details-image img {

    min-height:
      500px;
  }

  .details-info {

    padding:
      35px;
  }

}

/* =====================================
   MOBILE
===================================== */

@media (max-width: 650px) {

  .premium-details-page {

    padding:
      35px 12px 45px;
  }

  .details-topbar {

    align-items:
      flex-start;
  }

  .details-breadcrumb {

    display:
      none;
  }

  .product-details-card {

    border-radius:
      18px;
  }

  .details-image {

    min-height:
      360px;
  }

  .details-image img {

    min-height:
      360px;
  }

  .details-info {

    padding:
      25px 20px;
  }

  .details-info h1 {

    font-size:
      31px;

    letter-spacing:
      -1px;
  }

  .codes-grid {

    grid-template-columns:
      1fr;
  }

  .details-price-box {

    padding:
      13px;
  }

  .price-main strong {

    font-size:
      25px;
  }

  .details-actions {

    grid-template-columns:
      1fr;
  }

  .secondary-actions {

    grid-template-columns:
      1fr 1fr;
  }

  .product-info-strip {

    grid-template-columns:
      1fr;

    gap:
      5px;
  }

  .strip-divider {

    display:
      none;
  }

  .info-strip-item {

    padding:
      9px;
  }

}

/* =====================================
   SMALL MOBILE
===================================== */

@media (max-width: 420px) {

  .premium-details-page {

    padding:
      25px 9px 35px;
  }

  .back-products {

    font-size:
      11px;
  }

  .details-image {

    min-height:
      310px;
  }

  .details-image img {

    min-height:
      310px;
  }

  .image-category {

    left:
      12px;

    bottom:
      12px;
  }

  .zoom-hint {

    right:
      12px;

    bottom:
      12px;
  }

  .details-info {

    padding:
      22px 16px;
  }

  .details-info h1 {

    font-size:
      27px;
  }

  .details-trust {

    gap:
      2px;
  }

  .details-trust span {

    font-size:
      6px;
  }

}

/* =====================================
   REDUCED MOTION
===================================== */

@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {

    animation-duration:
      .01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      .01ms !important;
  }

}

`;

export default ProductDetails;