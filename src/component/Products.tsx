import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  stock?: number | boolean;
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
  price: number | string;
  old_price?: number | string | null;
  image: string;
  description: string;
  rating: number | string;
  stock: boolean | number;
  variants?: ProductVariant[];
}

// =====================================
// PRODUCTS COMPONENT
// =====================================

const Products: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // LOAD PRODUCTS
  // =====================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5001/api/products"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Products load failed."
          );
        }

        setProducts(
          Array.isArray(data.products)
            ? data.products
            : []
        );
      } catch (err) {
        console.error(
          "❌ Products Error:",
          err
        );

        setError(
          "Products load nahi ho pa rahe hain."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = [
    "All",
    ...Array.from(
      new Set(
        products.map(
          (product) => product.category
        )
      )
    ),
  ];

  // =====================================
  // FILTER PRODUCTS
  // =====================================

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category ===
            selectedCategory
        );

  // =====================================
  // PRODUCT DETAILS
  // =====================================

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  // =====================================
  // VARIANT DETAILS
  // =====================================

  const handleVariantClick = (
    productId: number
  ) => {
    navigate(
      `/product/${productId}/variants`
    );
  };

  // =====================================
  // WISHLIST
  // =====================================

  const handleWishlist = (
    product: Product
  ) => {
    alert(
      `${product.name} added to wishlist ❤️`
    );
  };

  // =====================================
  // CART
  // =====================================

  const handleAddToCart = (
    product: Product
  ) => {
    alert(
      `${product.name} added to cart 🛒`
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <section className="products-page">
        <div className="products-container">
          <div className="products-loading">

            <i className="fas fa-spinner fa-spin"></i>

            <h2>
              Loading Products...
            </h2>

            <p>
              Please wait.
            </p>

          </div>
        </div>

        <style>{`

          .products-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 80px 20px;
          }

          .products-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }

          .products-loading {
            min-height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .products-loading i {
            color: #e63946;
            font-size: 40px;
            margin-bottom: 20px;
          }

          .products-loading h2 {
            color: #222;
            margin-bottom: 8px;
          }

          .products-loading p {
            color: #777;
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
      <section className="products-page">
        <div className="products-container">

          <div className="products-error">

            <i className="fas fa-exclamation-circle"></i>

            <h2>
              Products Load Failed
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        </div>

        <style>{`

          .products-page {
            min-height: 75vh;
            background: #f8f6f1;
            padding: 80px 20px;
          }

          .products-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }

          .products-error {
            min-height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .products-error i {
            color: #e63946;
            font-size: 45px;
            margin-bottom: 15px;
          }

          .products-error h2 {
            color: #222;
            margin-bottom: 8px;
          }

          .products-error p {
            color: #777;
            margin-bottom: 20px;
          }

          .products-error button {
            padding: 11px 22px;
            border: none;
            border-radius: 6px;
            background: #e63946;
            color: #fff;
            font-weight: 700;
            cursor: pointer;
          }

        `}</style>
      </section>
    );
  }

  // =====================================
  // MAIN
  // =====================================

  return (
    <section className="products-page">

      <div className="products-container">

        {/* HEADER */}

        <div className="products-header">

          <span className="products-label">
            INDUSTRIAL PRODUCTS
          </span>

          <h1>
            Our <span>Products</span>
          </h1>

          <div className="products-line"></div>

          <p>
            Explore our range of industrial
            automation products and solutions.
          </p>

        </div>

        {/* CATEGORY FILTER */}

        <div className="category-filter">

          {categories.map(
            (category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}

        </div>

        {/* PRODUCT GRID */}

        {filteredProducts.length > 0 ? (

          <div className="products-grid">

            {filteredProducts.map(
              (product) => {

                const price =
                  Number(product.price);

                const oldPrice =
                  product.old_price !== null &&
                  product.old_price !== undefined &&
                  product.old_price !== ""
                    ? Number(product.old_price)
                    : null;

                const rating =
                  Number(product.rating);

                const isInStock =
                  Number(product.stock) > 0 ||
                  product.stock === true;

                const variantCount =
                  Array.isArray(
                    product.variants
                  )
                    ? product.variants.length
                    : 0;

                return (
                  <div
                    className="product-card"
                    key={product.id}
                  >

                    {/* IMAGE */}

                    <div
                      className="product-image"
                      onClick={() =>
                        handleProductClick(
                          product.id
                        )
                      }
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      {/* SALE */}

                      {oldPrice !== null &&
                        oldPrice > price && (
                          <span className="sale-badge">
                            SALE
                          </span>
                        )}

                      {/* WISHLIST */}

                      <button
                        type="button"
                        className="wishlist-icon"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleWishlist(
                            product
                          );
                        }}
                        title="Add to Wishlist"
                      >
                        <i className="far fa-heart"></i>
                      </button>

                    </div>

                    {/* INFO */}

                    <div className="product-info">

                      {/* CATEGORY */}

                      <span className="product-category">
                        {product.category}
                      </span>

                      {/* NAME */}

                      <h2
                        onClick={() =>
                          handleProductClick(
                            product.id
                          )
                        }
                      >
                        {product.name}
                      </h2>

                      {/* DESCRIPTION */}

                      <p className="product-description">
                        {product.description}
                      </p>

                      {/* RATING */}

                      <div className="product-rating">

                        <span className="stars">
                          ★★★★★
                        </span>

                        <span className="rating-number">
                          {Number.isNaN(
                            rating
                          )
                            ? "0.0"
                            : rating.toFixed(1)}
                        </span>

                      </div>

                      {/* VARIANTS */}

                      {variantCount > 0 && (

                        <div
                          className="variant-badge"
                          onClick={() =>
                            handleVariantClick(
                              product.id
                            )
                          }
                          title={`View ${variantCount} variants`}
                        >

                          <span className="variant-icon">
                            <i className="fas fa-layer-group"></i>
                          </span>

                          <span className="variant-text">
                            {variantCount}{" "}
                            {variantCount === 1
                              ? "Variant"
                              : "Variants"}
                          </span>

                          <span className="variant-arrow">
                            <i className="fas fa-arrow-right"></i>
                          </span>

                        </div>

                      )}

                      {/* BOTTOM */}

                      <div className="product-bottom">

                        {/* PRICE */}

                        <div className="product-price">

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

                        {/* CART */}

                        <button
                          type="button"
                          className="add-cart-btn"
                          disabled={!isInStock}
                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }
                        >

                          <i className="fas fa-shopping-cart"></i>

                          {isInStock
                            ? "Add"
                            : "Out of Stock"}

                        </button>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          /* NO PRODUCTS */

          <div className="no-products">

            <i className="fas fa-box-open"></i>

            <h2>
              No Products Found
            </h2>

            <p>
              No products available in this
              category.
            </p>

          </div>

        )}

      </div>

      {/* CSS */}

      <style>{`

        .products-page {
          min-height: 75vh;
          background: #f8f6f1;
          padding: 80px 20px;
        }

        .products-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .products-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .products-label {
          display: inline-block;
          color: #e63946;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        .products-header h1 {
          margin: 0;
          color: #222;
          font-size: 42px;
          font-weight: 700;
        }

        .products-header h1 span {
          color: #e63946;
        }

        .products-line {
          width: 60px;
          height: 3px;
          background: #e63946;
          margin: 18px auto;
        }

        .products-header p {
          margin: 0;
          color: #777;
          font-size: 15px;
        }

        .category-filter {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 40px;
        }

        .category-btn {
          padding: 10px 20px;
          border: 1px solid #ddd;
          border-radius: 25px;
          background: #fff;
          color: #555;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .category-btn:hover {
          transform: translateY(-2px);
        }

        .category-btn:hover,
        .category-btn.active {
          background: #e63946;
          color: #fff;
          border-color: #e63946;
        }

        .products-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 25px;
        }

        .product-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #eee;

          box-shadow:
            0 8px 25px
            rgba(0, 0, 0, 0.06);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);

          box-shadow:
            0 18px 40px
            rgba(0, 0, 0, 0.12);
        }

        .product-image {
          position: relative;
          height: 230px;
          overflow: hidden;
          cursor: pointer;
          background: #f5f5f5;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;

          transition:
            transform 0.5s ease;
        }

        .product-card:hover
        .product-image img {
          transform: scale(1.07);
        }

        .sale-badge {
          position: absolute;
          top: 15px;
          left: 15px;

          padding: 5px 10px;

          background: #e63946;
          color: #fff;

          border-radius: 4px;

          font-size: 11px;
          font-weight: 700;

          z-index: 2;
        }

        .wishlist-icon {
          position: absolute;
          top: 15px;
          right: 15px;

          width: 38px;
          height: 38px;

          border: none;
          border-radius: 50%;

          background: #fff;
          color: #e63946;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.12);

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;

          z-index: 3;
        }

        .wishlist-icon:hover {
          background: #e63946;
          color: #fff;

          transform:
            scale(1.12)
            rotate(-8deg);
        }

        .product-info {
          padding: 22px;
        }

        .product-category {
          color: #e63946;
          font-size: 12px;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .product-info h2 {
          margin: 7px 0 8px;

          color: #222;
          font-size: 21px;

          cursor: pointer;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .product-info h2:hover {
          color: #e63946;

          transform:
            translateX(3px);
        }

        .product-description {
          margin: 0 0 12px;

          color: #777;
          font-size: 13px;
          line-height: 1.6;

          min-height: 42px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 12px;
        }

        .stars {
          color: #f5a623;
          font-size: 14px;
          letter-spacing: 1px;
        }

        .rating-number {
          color: #777;
          font-size: 13px;
        }

        .variant-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin: 2px 0 15px;

          padding: 8px 12px;

          border-radius: 20px;

          background:
            linear-gradient(
              135deg,
              #fff5f5,
              #fff
            );

          border:
            1px solid #ffd4d7;

          color: #e63946;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 3px 10px
            rgba(230, 57, 70, 0.08);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease,
            color 0.25s ease;
        }

        .variant-badge:hover {
          background:
            linear-gradient(
              135deg,
              #e63946,
              #c92f3b
            );

          color: #fff;

          transform:
            translateY(-3px)
            scale(1.03);

          box-shadow:
            0 8px 20px
            rgba(230, 57, 70, 0.25);
        }

        .variant-icon {
          width: 22px;
          height: 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #ffe5e7;

          transition:
            transform 0.25s ease,
            background 0.25s ease;
        }

        .variant-badge:hover
        .variant-icon {
          background:
            rgba(255, 255, 255, 0.2);

          transform:
            rotate(12deg)
            scale(1.1);
        }

        .variant-text {
          white-space: nowrap;
        }

        .variant-arrow {
          display: flex;
          align-items: center;

          transition:
            transform 0.25s ease;
        }

        .variant-badge:hover
        .variant-arrow {
          transform:
            translateX(5px);
        }

        .product-card:hover
        .variant-badge {
          animation:
            variantFloat
            1.2s
            ease-in-out
            infinite
            alternate;
        }

        @keyframes variantFloat {
          from {
            transform:
              translateY(0);
          }

          to {
            transform:
              translateY(-3px);
          }
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 8px;

          padding-top: 15px;

          border-top:
            1px solid #eee;
        }

        .product-price {
          display: flex;
          flex-direction: column;
          gap: 2px;

          min-width: 75px;
        }

        .product-price strong {
          color: #222;
          font-size: 20px;
        }

        .product-price del {
          color: #999;
          font-size: 12px;
        }

        .add-cart-btn {
          padding: 10px 12px;

          border: none;
          border-radius: 6px;

          background: #e63946;
          color: #fff;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;
          white-space: nowrap;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .add-cart-btn:hover {
          background: #c92f3b;

          transform:
            translateY(-2px);
        }

        .add-cart-btn:disabled {
          background: #aaa;
          cursor: not-allowed;

          transform: none;
        }

        .add-cart-btn i {
          margin-right: 5px;
        }

        .no-products {
          text-align: center;

          padding: 70px 20px;

          background: #fff;

          border-radius: 12px;
        }

        .no-products i {
          color: #e63946;
          font-size: 45px;
        }

        .no-products h2 {
          color: #222;
          margin: 15px 0 8px;
        }

        .no-products p {
          color: #777;
          margin: 0;
        }

        @media (max-width: 900px) {

          .products-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .product-bottom {
            flex-wrap: wrap;
          }

          .product-price {
            width: 100%;
          }

        }

        @media (max-width: 600px) {

          .products-page {
            padding: 50px 15px;
          }

          .products-header h1 {
            font-size: 32px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .category-filter {
            justify-content: flex-start;

            overflow-x: auto;

            flex-wrap: nowrap;

            padding-bottom: 5px;
          }

          .category-btn {
            white-space: nowrap;
          }

          .product-bottom {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap: 8px;
          }

          .product-price {
            grid-column: 1 / -1;

            width: 100%;
          }

          .add-cart-btn {
            width: 100%;
          }

        }

      `}</style>

    </section>
  );
};

export default Products;