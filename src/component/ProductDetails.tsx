import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

// =====================================
// PRODUCT VARIANT
// =====================================

interface ProductVariant {
  id: number;
  product_id: number;
  variant_name: string;
  variant_code?: string;
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

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  // =====================================
  // LOAD PRODUCT
  // =====================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5001/api/products/${id}`
        );

        const data = await response.json();

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

        console.log(
          "🆔 PRODUCT ID:",
          data.product?.id
        );

        // =====================================
        // PDF URL BASED ON PRODUCT ID
        // =====================================

        if (data.product?.id) {
          console.log(
            "📄 PDF:",
            `http://localhost:5001/pdf/${data.product.id}.pdf`
          );
        }

        setProduct(data.product);

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

    if (id) {
      loadProduct();
    }
  }, [id]);

  // =====================================
  // PRODUCT VALUES
  // =====================================

  const price = product
    ? Number(product.price)
    : 0;

  const oldPrice = product?.old_price
    ? Number(product.old_price)
    : null;

  const rating = product
    ? Number(product.rating)
    : 0;

  const isInStock = product
    ? Boolean(product.stock)
    : false;

  const totalPrice =
    price * quantity;

  // =====================================
  // PDF URL
  // =====================================

  /*
    Product ID ke according PDF open hoga.

    Product ID 1
    => /pdf/1.pdf

    Product ID 2
    => /pdf/2.pdf

    Product ID 3
    => /pdf/3.pdf
  */

  const pdfUrl = product
    ? `http://localhost:5001/pdf/${product.id}.pdf`
    : null;

  // =====================================
  // OPEN PDF
  // =====================================

  const handleMoreDetails = () => {
    if (!product || !pdfUrl) {
      alert(
        "Product PDF available nahi hai."
      );
      return;
    }

    console.log(
      "🆔 Product ID:",
      product.id
    );

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

    alert(
      `${product.name} x ${quantity} added to cart 🛒`
    );
  };

  // =====================================
  // WISHLIST
  // =====================================

  const handleWishlist = () => {
    if (!product) {
      return;
    }

    alert(
      `${product.name} added to wishlist ❤️`
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

    navigate(
      `/checkout?productId=${product.id}&quantity=${quantity}`
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <section className="product-details-page">

        <div className="details-loading">

          <i className="fas fa-spinner fa-spin"></i>

          <h2>
            Loading Product...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

        <style>{`

          .product-details-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 80px 20px;
          }

          .details-loading {
            min-height: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .details-loading i {
            color: #e63946;
            font-size: 42px;
            margin-bottom: 20px;
          }

          .details-loading h2 {
            color: #222;
            margin: 0 0 8px;
          }

          .details-loading p {
            color: #777;
            margin: 0;
          }

        `}</style>

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
      <section className="product-details-page">

        <div className="details-error">

          <i className="fas fa-box-open"></i>

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

        <style>{`

          .product-details-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 80px 20px;
          }

          .details-error {
            min-height: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .details-error > i {
            color: #e63946;
            font-size: 48px;
            margin-bottom: 18px;
          }

          .details-error h2 {
            color: #222;
            margin: 0 0 8px;
          }

          .details-error p {
            color: #777;
            margin-bottom: 20px;
          }

          .details-error button {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            background: #e63946;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
          }

          .details-error button:hover {
            background: #c92f3b;
          }

          .details-error button i {
            color: #fff;
            font-size: 14px;
            margin: 0 7px 0 0;
          }

        `}</style>

      </section>
    );
  }

  // =====================================
  // MAIN
  // =====================================

  return (
    <section className="product-details-page">

      <div className="product-details-container">

        {/* BACK */}

        <button
          type="button"
          className="back-products"
          onClick={() =>
            navigate("/products")
          }
        >
          <i className="fas fa-arrow-left"></i>
          Back to Products
        </button>

        {/* PRODUCT CARD */}

        <div className="product-details-card">

          {/* IMAGE */}

          <div className="details-image">

            <img
              src={product.image}
              alt={product.name}
            />

            {oldPrice && (
              <span className="details-sale">
                SALE
              </span>
            )}

          </div>

          {/* INFO */}

          <div className="details-info">

            {/* CATEGORY */}

            <span className="details-category">
              {product.category}
            </span>

            {/* NAME */}

            <h1>
              {product.name}
            </h1>

            {/* RATING */}

            <div className="details-rating">

              <span className="details-stars">
                ★★★★★
              </span>

              <span>
                {rating.toFixed(1)}
              </span>

            </div>

            {/* DESCRIPTION */}

            <p className="details-description">
              {product.description}
            </p>

            {/* PRICE */}

            <div className="details-price">

              <strong>
                ₹
                {price.toLocaleString(
                  "en-IN"
                )}
              </strong>

              {oldPrice && (
                <del>
                  ₹
                  {oldPrice.toLocaleString(
                    "en-IN"
                  )}
                </del>
              )}

            </div>

            {/* STOCK */}

            <div
              className={
                isInStock
                  ? "stock available"
                  : "stock unavailable"
              }
            >

              <i
                className={
                  isInStock
                    ? "fas fa-check-circle"
                    : "fas fa-times-circle"
                }
              ></i>

              {isInStock
                ? "In Stock"
                : "Out of Stock"}

            </div>

            {/* QUANTITY */}

            {isInStock && (
              <div className="quantity-section">

                <span>
                  Quantity
                </span>

                <div className="quantity-box">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
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
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* TOTAL */}

            {isInStock && (
              <div className="details-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>
            )}

            {/* ACTION BUTTONS */}

            <div className="details-actions">

              {/* ADD TO CART */}

              <button
                type="button"
                className="details-cart-btn"
                disabled={!isInStock}
                onClick={
                  handleAddToCart
                }
              >

                <i className="fas fa-shopping-cart"></i>

                {isInStock
                  ? "Add to Cart"
                  : "Out of Stock"}

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

                <i className="fas fa-bolt"></i>

                Buy Now / Checkout

              </button>

              {/* WISHLIST */}

              <button
                type="button"
                className="details-wishlist-btn"
                onClick={
                  handleWishlist
                }
              >

                <i className="far fa-heart"></i>

                Wishlist

              </button>

            </div>

            {/* =====================================
                PDF BUTTON
            ===================================== */}

            <button
              type="button"
              className="more-details-btn"
              onClick={
                handleMoreDetails
              }
            >

              <i className="fas fa-file-pdf"></i>

              More Details / PDF

              <i className="fas fa-arrow-up-right-from-square more-details-arrow"></i>

            </button>

          </div>

        </div>

      </div>

      {/* CSS */}

      <style>{`

        .product-details-page {
          min-height: 75vh;
          background: #f8f6f1;
          padding: 70px 20px;
        }

        .product-details-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .back-products {
          border: none;
          background: transparent;
          color: #555;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 25px;
        }

        .back-products:hover {
          color: #e63946;
        }

        .back-products i {
          margin-right: 8px;
        }

        .product-details-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #eee;

          box-shadow:
            0 12px 35px
            rgba(0, 0, 0, 0.08);
        }

        .details-image {
          position: relative;
          min-height: 520px;
          background: #f4f4f4;
        }

        .details-image img {
          width: 100%;
          height: 100%;
          min-height: 520px;
          object-fit: cover;
          display: block;
        }

        .details-sale {
          position: absolute;
          top: 20px;
          left: 20px;

          background: #e63946;
          color: #fff;

          padding: 7px 12px;

          border-radius: 5px;

          font-size: 12px;
          font-weight: 700;
        }

        .details-info {
          padding: 45px;
        }

        .details-category {
          color: #e63946;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .details-info h1 {
          color: #222;
          font-size: 36px;
          line-height: 1.2;
          margin: 10px 0 15px;
        }

        .details-rating {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #777;
          font-size: 14px;

          margin-bottom: 25px;
        }

        .details-stars {
          color: #f5a623;
          letter-spacing: 2px;
        }

        .details-description {
          color: #666;
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 25px;
        }

        .details-price {
          display: flex;
          align-items: center;
          gap: 12px;

          margin-bottom: 18px;
        }

        .details-price strong {
          color: #222;
          font-size: 30px;
        }

        .details-price del {
          color: #999;
          font-size: 15px;
        }

        .stock {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          font-size: 14px;
          font-weight: 700;

          margin-bottom: 25px;
        }

        .stock.available {
          color: #218838;
        }

        .stock.unavailable {
          color: #dc3545;
        }

        .quantity-section {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 18px;
        }

        .quantity-section > span {
          color: #555;
          font-weight: 700;
        }

        .quantity-box {
          display: flex;
          align-items: center;

          border: 1px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
        }

        .quantity-box button {
          width: 38px;
          height: 38px;

          border: none;

          background: #f5f5f5;
          color: #222;

          font-size: 20px;

          cursor: pointer;
        }

        .quantity-box button:hover {
          background: #e63946;
          color: #fff;
        }

        .quantity-box strong {
          width: 42px;

          text-align: center;

          color: #222;
        }

        .details-total {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 15px 0;

          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;

          margin-bottom: 20px;
        }

        .details-total span {
          color: #777;
        }

        .details-total strong {
          color: #222;
          font-size: 20px;
        }

        .details-actions {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;
        }

        .details-actions button {
          padding: 14px;

          border-radius: 6px;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          transition: 0.2s;
        }

        .details-cart-btn {
          border: 1px solid #e63946;
          background: #e63946;
          color: #fff;
        }

        .details-cart-btn:hover {
          background: #c92f3b;
        }

        .details-cart-btn:disabled {
          background: #aaa;
          border-color: #aaa;
          cursor: not-allowed;
        }

        .details-checkout-btn {
          border: 1px solid #222;
          background: #222;
          color: #fff;
        }

        .details-checkout-btn:hover {
          background: #e63946;
          border-color: #e63946;
        }

        .details-checkout-btn:disabled {
          background: #aaa;
          border-color: #aaa;
          cursor: not-allowed;
        }

        .details-wishlist-btn {
          border: 1px solid #ddd;
          background: #fff;
          color: #444;
        }

        .details-wishlist-btn:hover {
          border-color: #e63946;
          color: #e63946;
        }

        .details-actions i {
          margin-right: 7px;
        }

        /* =====================================
           PDF BUTTON
        ===================================== */

        .more-details-btn {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          margin-top: 14px;

          padding: 15px 18px;

          border: 2px solid #e63946;

          border-radius: 7px;

          background: #fff;

          color: #e63946;

          font-size: 15px;

          font-weight: 800;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .more-details-btn:hover {
          background: #e63946;

          color: #fff;

          transform: translateY(-1px);

          box-shadow:
            0 6px 15px
            rgba(230, 57, 70, 0.25);
        }

        .more-details-btn > i:first-child {
          margin-right: 2px;
        }

        .more-details-arrow {
          font-size: 12px;
          margin-left: 4px;
        }

        @media (max-width: 800px) {

          .product-details-card {
            grid-template-columns: 1fr;
          }

          .details-image {
            min-height: 350px;
          }

          .details-image img {
            min-height: 350px;
          }

          .details-info {
            padding: 30px 25px;
          }

          .details-info h1 {
            font-size: 30px;
          }

        }

        @media (max-width: 500px) {

          .product-details-page {
            padding: 45px 15px;
          }

          .details-actions {
            grid-template-columns: 1fr;
          }

          .more-details-btn {
            margin-top: 12px;
            padding: 14px;
          }

        }

      `}</style>

    </section>
  );
};

export default ProductDetails;