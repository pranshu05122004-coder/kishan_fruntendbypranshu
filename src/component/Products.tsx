import React, { useEffect, useMemo, useState } from "react";
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
// PRODUCTS
// =====================================

const Products: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hoveredProduct, setHoveredProduct] =
    useState<number | null>(null);

  const [likedProducts, setLikedProducts] =
    useState<number[]>([]);

  const [cartAnimation, setCartAnimation] =
    useState<number | null>(null);

  const [visibleProducts, setVisibleProducts] =
    useState<number[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

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
  // LOAD WISHLIST STATE
  // =====================================

  useEffect(() => {
    try {
      const savedWishlist =
        localStorage.getItem(
          "kishan_wishlist"
        );

      if (savedWishlist) {
        const parsed =
          JSON.parse(savedWishlist);

        if (Array.isArray(parsed)) {
          setLikedProducts(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Wishlist load error:",
        error
      );
    }
  }, []);

  // =====================================
  // SAVE WISHLIST
  // =====================================

  useEffect(() => {
    localStorage.setItem(
      "kishan_wishlist",
      JSON.stringify(likedProducts)
    );
  }, [likedProducts]);

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        )
      ),
    ];
  }, [products]);

  // =====================================
  // FILTER PRODUCTS
  // =====================================

  const filteredProducts =
    useMemo(() => {
      let result =
        selectedCategory === "All"
          ? products
          : products.filter(
              (product) =>
                product.category ===
                selectedCategory
            );

      if (searchTerm.trim()) {
        const search =
          searchTerm
            .toLowerCase()
            .trim();

        result = result.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(search) ||
            product.category
              .toLowerCase()
              .includes(search) ||
            product.description
              .toLowerCase()
              .includes(search)
        );
      }

      return result;
    }, [
      products,
      selectedCategory,
      searchTerm,
    ]);

  // =====================================
  // PRODUCT REVEAL
  // =====================================

  useEffect(() => {
    if (loading) return;

    setVisibleProducts([]);

    const timers: ReturnType<
      typeof setTimeout
    >[] = [];

    filteredProducts.forEach(
      (_, index) => {
        const timer =
          setTimeout(() => {
            setVisibleProducts(
              (previous) => [
                ...previous,
                index,
              ]
            );
          }, index * 80);

        timers.push(timer);
      }
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [
    filteredProducts,
    loading,
  ]);

  // =====================================
  // PRODUCT DETAILS
  // =====================================

  const handleProductClick = (
    id: number
  ) => {
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
    const alreadyLiked =
      likedProducts.includes(
        product.id
      );

    setLikedProducts((previous) =>
      alreadyLiked
        ? previous.filter(
            (id) =>
              id !== product.id
          )
        : [
            ...previous,
            product.id,
          ]
    );

    if (alreadyLiked) {
      alert(
        `${product.name} removed from wishlist`
      );
    } else {
      alert(
        `${product.name} added to wishlist ❤️`
      );
    }
  };

  // =====================================
  // CART
  // =====================================

  const handleAddToCart = (
    product: Product
  ) => {
    setCartAnimation(
      product.id
    );

    setTimeout(() => {
      setCartAnimation(null);
    }, 700);

    alert(
      `${product.name} added to cart 🛒`
    );
  };

  // =====================================
  // CLEAR SEARCH
  // =====================================

  const clearSearch = () => {
    setSearchTerm("");
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <section className="products-page premium-products-page">

        <div className="products-bg-orb orb-one"></div>
        <div className="products-bg-orb orb-two"></div>
        <div className="products-bg-orb orb-three"></div>

        <div className="products-container">

          <div className="products-loading">

            <div className="loading-icon-wrap">
              <div className="loading-ring"></div>

              <i className="fas fa-box-open"></i>
            </div>

            <h2>
              Loading Products
              <span className="loading-dots">
                ...
              </span>
            </h2>

            <p>
              Preparing our industrial
              product collection for you.
            </p>

            <div className="loading-progress">
              <span></span>
            </div>

          </div>

        </div>

        <style>{PRODUCTS_CSS}</style>
      </section>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <section className="products-page premium-products-page">

        <div className="products-bg-orb orb-one"></div>
        <div className="products-bg-orb orb-two"></div>

        <div className="products-container">

          <div className="products-error">

            <div className="error-icon-wrap">
              <i className="fas fa-exclamation-triangle"></i>
            </div>

            <span className="error-label">
              SOMETHING WENT WRONG
            </span>

            <h2>
              Products Couldn&apos;t Load
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="retry-btn"
              onClick={() =>
                window.location.reload()
              }
            >
              <i className="fas fa-redo"></i>
              Try Again
            </button>

          </div>

        </div>

        <style>{PRODUCTS_CSS}</style>
      </section>
    );
  }

  // =====================================
  // MAIN
  // =====================================

  return (
    <section className="products-page premium-products-page">

      {/* =================================
          BACKGROUND
      ================================= */}

      <div className="products-bg-grid"></div>

      <div className="products-bg-orb orb-one"></div>
      <div className="products-bg-orb orb-two"></div>
      <div className="products-bg-orb orb-three"></div>

      <div className="floating-shape shape-one"></div>
      <div className="floating-shape shape-two"></div>
      <div className="floating-shape shape-three"></div>

      {/* =================================
          CONTAINER
      ================================= */}

      <div className="products-container">

        {/* =================================
            HERO HEADER
        ================================= */}

        <div className="products-header">

          <div className="header-badge">
            <span className="badge-dot"></span>

            <span>
              INDUSTRIAL EXCELLENCE
            </span>

            <i className="fas fa-arrow-right"></i>
          </div>

          <h1>
            Explore Our
            <span>
              Products
            </span>
          </h1>

          <div className="products-title-line">
            <span></span>
            <i className="fas fa-cog"></i>
            <span></span>
          </div>

          <p>
            Discover reliable industrial
            automation products engineered
            for performance, precision and
            productivity.
          </p>

          {/* HEADER STATS */}

          <div className="products-stats">

            <div className="stat-item">

              <strong>
                {products.length}+
              </strong>

              <span>
                Products
              </span>

            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">

              <strong>
                {Math.max(
                  categories.length - 1,
                  0
                )}
              </strong>

              <span>
                Categories
              </span>

            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">

              <strong>
                100%
              </strong>

              <span>
                Quality
              </span>

            </div>

          </div>

        </div>

        {/* =================================
            TOOLBAR
        ================================= */}

        <div className="products-toolbar">

          {/* SEARCH */}

          <div className="products-search">

            <i className="fas fa-search"></i>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search products..."
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
              >
                <i className="fas fa-times"></i>
              </button>
            )}

          </div>

          {/* RESULT COUNT */}

          <div className="result-count">

            <span className="result-count-icon">
              <i className="fas fa-layer-group"></i>
            </span>

            <div>
              <strong>
                {filteredProducts.length}
              </strong>

              <span>
                {filteredProducts.length === 1
                  ? " Product"
                  : " Products"}
              </span>
            </div>

          </div>

        </div>

        {/* =================================
            CATEGORY FILTER
        ================================= */}

        <div className="category-section">

          <div className="category-heading">

            <span>
              <i className="fas fa-filter"></i>
              Browse Categories
            </span>

          </div>

          <div className="category-filter">

            {categories.map(
              (category, index) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory ===
                    category
                      ? "category-btn active"
                      : "category-btn"
                  }
                  onClick={() => {
                    setSelectedCategory(
                      category
                    );
                  }}
                >

                  <span className="category-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span>
                    {category}
                  </span>

                  {selectedCategory ===
                    category && (
                    <i className="fas fa-check"></i>
                  )}

                </button>
              )
            )}

          </div>

        </div>

        {/* =================================
            PRODUCT GRID
        ================================= */}

        {filteredProducts.length > 0 ? (

          <div className="products-grid">

            {filteredProducts.map(
              (product, index) => {

                const price =
                  Number(
                    product.price
                  );

                const oldPrice =
                  product.old_price !==
                    null &&
                  product.old_price !==
                    undefined &&
                  product.old_price !== ""
                    ? Number(
                        product.old_price
                      )
                    : null;

                const rating =
                  Number(
                    product.rating
                  );

                const isInStock =
                  Number(
                    product.stock
                  ) > 0 ||
                  product.stock === true;

                const variantCount =
                  Array.isArray(
                    product.variants
                  )
                    ? product
                        .variants
                        .length
                    : 0;

                const isLiked =
                  likedProducts.includes(
                    product.id
                  );

                const isHovered =
                  hoveredProduct ===
                  product.id;

                const isCartAnimating =
                  cartAnimation ===
                  product.id;

                const discount =
                  oldPrice !== null &&
                  oldPrice > price
                    ? Math.round(
                        ((oldPrice -
                          price) /
                          oldPrice) *
                          100
                      )
                    : 0;

                const isVisible =
                  visibleProducts.includes(
                    index
                  );

                return (
                  <article
                    className={`product-card ${
                      isVisible
                        ? "product-visible"
                        : ""
                    }`}
                    key={product.id}
                    style={{
                      "--card-index":
                        index,
                    } as React.CSSProperties}
                    onMouseEnter={() =>
                      setHoveredProduct(
                        product.id
                      )
                    }
                    onMouseLeave={() =>
                      setHoveredProduct(
                        null
                      )
                    }
                  >

                    {/* CARD GLOW */}

                    <div className="card-glow"></div>

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
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        loading="lazy"
                      />

                      <div className="image-shade"></div>

                      {/* IMAGE TOP */}

                      <div className="image-top">

                        {oldPrice !== null &&
                          oldPrice >
                            price && (
                            <span className="sale-badge">
                              <i className="fas fa-bolt"></i>
                              SALE
                              {discount >
                                0 &&
                                ` ${discount}% OFF`}
                            </span>
                          )}

                        {isInStock ? (
                          <span className="stock-badge in-stock">
                            <span></span>
                            In Stock
                          </span>
                        ) : (
                          <span className="stock-badge out-stock">
                            <span></span>
                            Out of Stock
                          </span>
                        )}

                      </div>

                      {/* WISHLIST */}

                      <button
                        type="button"
                        className={`wishlist-icon ${
                          isLiked
                            ? "liked"
                            : ""
                        }`}
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          handleWishlist(
                            product
                          );
                        }}
                        title={
                          isLiked
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        <i
                          className={
                            isLiked
                              ? "fas fa-heart"
                              : "far fa-heart"
                          }
                        ></i>
                      </button>

                      {/* VIEW */}

                      <div
                        className={`view-product ${
                          isHovered
                            ? "show"
                            : ""
                        }`}
                      >

                        <span>
                          <i className="fas fa-eye"></i>
                        </span>

                        <strong>
                          View Product
                        </strong>

                      </div>

                      {/* IMAGE CORNER */}

                      <div className="image-corner">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>

                    </div>

                    {/* INFO */}

                    <div className="product-info">

                      {/* CATEGORY */}

                      <div className="product-meta">

                        <span className="product-category">
                          <i className="fas fa-tag"></i>
                          {product.category}
                        </span>

                        <span className="product-number">
                          #
                          {String(
                            product.id
                          ).padStart(
                            4,
                            "0"
                          )}
                        </span>

                      </div>

                      {/* NAME */}

                      <h2
                        onClick={() =>
                          handleProductClick(
                            product.id
                          )
                        }
                      >
                        {product.name}

                        <span className="title-arrow">
                          <i className="fas fa-arrow-up-right-from-square"></i>
                        </span>
                      </h2>

                      {/* DESCRIPTION */}

                      <p className="product-description">
                        {product.description}
                      </p>

                      {/* RATING */}

                      <div className="product-rating">

                        <div className="rating-stars">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <i
                                key={star}
                                className={
                                  star <=
                                  Math.round(
                                    Number.isNaN(
                                      rating
                                    )
                                      ? 0
                                      : rating
                                  )
                                    ? "fas fa-star"
                                    : "far fa-star"
                                }
                              ></i>
                            )
                          )}

                        </div>

                        <span className="rating-number">
                          {Number.isNaN(
                            rating
                          )
                            ? "0.0"
                            : rating.toFixed(
                                1
                              )}
                        </span>

                        <span className="rating-divider">
                          |
                        </span>

                        <span className="rating-label">
                          Rated
                        </span>

                      </div>

                      {/* VARIANTS */}

                      {variantCount >
                        0 && (

                        <button
                          type="button"
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

                          <span className="variant-content">

                            <small>
                              AVAILABLE OPTIONS
                            </small>

                            <strong>
                              {variantCount}{" "}
                              {variantCount ===
                              1
                                ? "Variant"
                                : "Variants"}
                            </strong>

                          </span>

                          <span className="variant-arrow">
                            <i className="fas fa-arrow-right"></i>
                          </span>

                        </button>

                      )}

                      {/* BOTTOM */}

                      <div className="product-bottom">

                        {/* PRICE */}

                        <div className="product-price">

                          <span className="price-label">
                            Starting from
                          </span>

                          <div className="price-row">

                            <strong>
                              ₹
                              {price.toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                            {oldPrice !==
                              null &&
                              oldPrice >
                                price && (
                                <del>
                                  ₹
                                  {oldPrice.toLocaleString(
                                    "en-IN"
                                  )}
                                </del>
                              )}

                          </div>

                        </div>

                        {/* CART */}

                        <button
                          type="button"
                          className={`add-cart-btn ${
                            isCartAnimating
                              ? "cart-added"
                              : ""
                          }`}
                          disabled={
                            !isInStock
                          }
                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }
                        >

                          <span className="cart-icon">
                            <i
                              className={
                                isCartAnimating
                                  ? "fas fa-check"
                                  : "fas fa-shopping-cart"
                              }
                            ></i>
                          </span>

                          <span>
                            {isCartAnimating
                              ? "Added!"
                              : isInStock
                              ? "Add to Cart"
                              : "Out of Stock"}
                          </span>

                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        ) : (

          /* =================================
              NO PRODUCTS
          ================================= */

          <div className="no-products">

            <div className="empty-icon">

              <div className="empty-ring"></div>

              <i className="fas fa-box-open"></i>

            </div>

            <span>
              NOTHING HERE
            </span>

            <h2>
              No Products Found
            </h2>

            <p>
              We couldn&apos;t find any
              products matching your search.
            </p>

            {(searchTerm ||
              selectedCategory !==
                "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(
                    "All"
                  );
                }}
              >
                <i className="fas fa-rotate-left"></i>
                View All Products
              </button>
            )}

          </div>

        )}

        {/* =================================
            BOTTOM TRUST BAR
        ================================= */}

        <div className="products-trust">

          <div className="trust-item">

            <div className="trust-icon">
              <i className="fas fa-shield-halved"></i>
            </div>

            <div>
              <strong>
                Quality Assured
              </strong>

              <span>
                Reliable industrial products
              </span>
            </div>

          </div>

          <div className="trust-item">

            <div className="trust-icon">
              <i className="fas fa-truck-fast"></i>
            </div>

            <div>
              <strong>
                Fast Delivery
              </strong>

              <span>
                Quick & secure dispatch
              </span>
            </div>

          </div>

          <div className="trust-item">

            <div className="trust-icon">
              <i className="fas fa-headset"></i>
            </div>

            <div>
              <strong>
                Expert Support
              </strong>

              <span>
                Help when you need it
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* =================================
          CSS
      ================================= */}

      <style>{PRODUCTS_CSS}</style>

    </section>
  );
};

// =====================================
// PREMIUM PRODUCTS CSS
// =====================================

const PRODUCTS_CSS = `

/* =====================================
   ROOT
===================================== */

.premium-products-page {
  --red: #e63946;
  --red-dark: #c92f3b;
  --red-light: #fff1f2;
  --cream: #f8f6f1;
  --dark: #171717;
  --gray: #777;
  --border: #ececec;

  position: relative;
  min-height: 100vh;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(230,57,70,0.06),
      transparent 28%
    ),
    radial-gradient(
      circle at 90% 20%,
      rgba(230,57,70,0.05),
      transparent 25%
    ),
    #f8f6f1;

  padding: 85px 20px 70px;
}

/* =====================================
   BACKGROUND GRID
===================================== */

.products-bg-grid {
  position: absolute;
  inset: 0;

  opacity: 0.35;

  background-image:
    linear-gradient(
      rgba(230,57,70,0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(230,57,70,0.035) 1px,
      transparent 1px
    );

  background-size:
    45px 45px;

  pointer-events: none;

  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 80%
    );
}

/* =====================================
   BACKGROUND ORBS
===================================== */

.products-bg-orb {
  position: absolute;

  border-radius: 50%;

  filter: blur(1px);

  pointer-events: none;

  animation:
    orbFloat 8s
    ease-in-out
    infinite;
}

.orb-one {
  width: 260px;
  height: 260px;

  top: 100px;
  left: -130px;

  background:
    radial-gradient(
      circle,
      rgba(230,57,70,0.10),
      transparent 70%
    );
}

.orb-two {
  width: 340px;
  height: 340px;

  right: -170px;
  top: 500px;

  background:
    radial-gradient(
      circle,
      rgba(230,57,70,0.08),
      transparent 70%
    );

  animation-delay:
    -3s;
}

.orb-three {
  width: 180px;
  height: 180px;

  left: 45%;
  bottom: 100px;

  background:
    radial-gradient(
      circle,
      rgba(230,57,70,0.06),
      transparent 70%
    );

  animation-delay:
    -5s;
}

@keyframes orbFloat {

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

.floating-shape {
  position: absolute;

  border: 1px solid
    rgba(230,57,70,0.08);

  pointer-events: none;

  animation:
    shapeFloat
    12s
    ease-in-out
    infinite;
}

.shape-one {
  width: 80px;
  height: 80px;

  right: 8%;
  top: 120px;

  transform:
    rotate(45deg);
}

.shape-two {
  width: 45px;
  height: 45px;

  left: 8%;
  top: 550px;

  border-radius: 50%;

  animation-delay:
    -4s;
}

.shape-three {
  width: 60px;
  height: 60px;

  right: 15%;
  bottom: 150px;

  transform:
    rotate(30deg);

  animation-delay:
    -7s;
}

@keyframes shapeFloat {

  0%,
  100% {
    transform:
      translateY(0)
      rotate(0deg);
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

.products-container {
  position: relative;

  z-index: 2;

  width: 100%;
  max-width: 1240px;

  margin: 0 auto;
}

/* =====================================
   HEADER
===================================== */

.products-header {
  text-align: center;

  max-width: 850px;

  margin:
    0 auto 48px;

  animation:
    headerReveal
    0.8s
    ease
    both;
}

@keyframes headerReveal {

  from {
    opacity: 0;
    transform:
      translateY(30px);
  }

  to {
    opacity: 1;
    transform:
      translateY(0);
  }

}

/* =====================================
   HEADER BADGE
===================================== */

.header-badge {
  display: inline-flex;

  align-items: center;
  gap: 9px;

  padding:
    8px 15px;

  border:
    1px solid
    rgba(230,57,70,0.16);

  border-radius:
    999px;

  background:
    rgba(255,255,255,0.75);

  backdrop-filter:
    blur(12px);

  color:
    var(--red);

  font-size:
    11px;

  font-weight:
    800;

  letter-spacing:
    2px;

  box-shadow:
    0 8px 25px
    rgba(0,0,0,0.04);
}

.header-badge i {
  font-size:
    9px;

  animation:
    arrowMove
    1.5s
    ease-in-out
    infinite;
}

@keyframes arrowMove {

  0%,
  100% {
    transform:
      translateX(0);
  }

  50% {
    transform:
      translateX(4px);
  }

}

.badge-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    var(--red);

  box-shadow:
    0 0 0 4px
    rgba(230,57,70,0.10);

  animation:
    badgePulse
    1.7s
    ease-in-out
    infinite;
}

@keyframes badgePulse {

  0%,
  100% {
    box-shadow:
      0 0 0 3px
      rgba(230,57,70,0.08);
  }

  50% {
    box-shadow:
      0 0 0 7px
      rgba(230,57,70,0.03);
  }

}

/* =====================================
   TITLE
===================================== */

.products-header h1 {
  margin:
    18px 0 12px;

  color:
    var(--dark);

  font-size:
    clamp(38px, 5vw, 64px);

  line-height:
    1.05;

  font-weight:
    800;

  letter-spacing:
    -2px;
}

.products-header h1 span {
  display: inline-block;

  margin-left:
    13px;

  color:
    var(--red);

  position: relative;
}

.products-header h1 span::after {
  content: "";

  position: absolute;

  left: 0;
  right: 0;

  bottom: -7px;

  height: 3px;

  border-radius:
    20px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--red),
      transparent
    );

  animation:
    titleLine
    2s
    ease-in-out
    infinite;
}

@keyframes titleLine {

  0%,
  100% {
    opacity: 0.35;
    transform:
      scaleX(0.6);
  }

  50% {
    opacity: 1;
    transform:
      scaleX(1);
  }

}

/* =====================================
   TITLE LINE
===================================== */

.products-title-line {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  margin:
    24px auto 18px;
}

.products-title-line span {
  width: 45px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--red)
    );
}

.products-title-line span:last-child {
  background:
    linear-gradient(
      90deg,
      var(--red),
      transparent
    );
}

.products-title-line i {
  color:
    var(--red);

  font-size:
    13px;

  animation:
    gearSpin
    5s
    linear
    infinite;
}

@keyframes gearSpin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =====================================
   HEADER DESCRIPTION
===================================== */

.products-header > p {
  max-width:
    650px;

  margin:
    0 auto;

  color:
    #777;

  font-size:
    15px;

  line-height:
    1.8;
}

/* =====================================
   STATS
===================================== */

.products-stats {
  display: inline-flex;

  align-items: center;

  margin-top:
    30px;

  padding:
    14px 24px;

  border:
    1px solid #eee;

  border-radius:
    18px;

  background:
    rgba(255,255,255,0.72);

  backdrop-filter:
    blur(15px);

  box-shadow:
    0 12px 35px
    rgba(0,0,0,0.045);
}

.stat-item {
  display: flex;

  flex-direction: column;

  min-width:
    100px;
}

.stat-item strong {
  color:
    var(--dark);

  font-size:
    20px;

  line-height:
    1.2;
}

.stat-item span {
  margin-top:
    3px;

  color:
    #999;

  font-size:
    10px;

  font-weight:
    700;

  text-transform:
    uppercase;

  letter-spacing:
    1px;
}

.stat-divider {
  width: 1px;
  height: 35px;

  background:
    #e8e8e8;
}

/* =====================================
   TOOLBAR
===================================== */

.products-toolbar {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom:
    24px;

  padding:
    15px;

  border:
    1px solid #ededed;

  border-radius:
    18px;

  background:
    rgba(255,255,255,0.82);

  backdrop-filter:
    blur(15px);

  box-shadow:
    0 10px 35px
    rgba(0,0,0,0.035);
}

/* =====================================
   SEARCH
===================================== */

.products-search {
  position: relative;

  display: flex;

  align-items: center;

  width:
    min(100%, 450px);

  height:
    48px;
}

.products-search > i {
  position: absolute;

  left:
    17px;

  color:
    #aaa;

  font-size:
    14px;

  pointer-events:
    none;

  transition:
    color .25s ease;
}

.products-search:focus-within
> i {
  color:
    var(--red);
}

.products-search input {
  width: 100%;
  height: 100%;

  padding:
    0 45px;

  border:
    1px solid #e7e7e7;

  border-radius:
    13px;

  outline: none;

  background:
    #fafafa;

  color:
    #222;

  font-size:
    13px;

  transition:
    all .25s ease;
}

.products-search input:focus {
  background:
    #fff;

  border-color:
    rgba(230,57,70,0.4);

  box-shadow:
    0 0 0 4px
    rgba(230,57,70,0.06);
}

.products-search input::placeholder {
  color:
    #aaa;
}

.clear-search {
  position: absolute;

  right:
    12px;

  width:
    28px;

  height:
    28px;

  border:
    none;

  border-radius:
    50%;

  background:
    #eee;

  color:
    #777;

  cursor:
    pointer;

  transition:
    all .2s ease;
}

.clear-search:hover {
  background:
    var(--red);

  color:
    #fff;

  transform:
    rotate(90deg);
}

/* =====================================
   RESULT COUNT
===================================== */

.result-count {
  display: flex;

  align-items: center;

  gap: 10px;

  padding:
    5px 10px;
}

.result-count-icon {
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
    11px;

  background:
    var(--red-light);

  color:
    var(--red);
}

.result-count strong {
  color:
    #222;

  font-size:
    16px;
}

.result-count span {
  color:
    #999;

  font-size:
    12px;
}

/* =====================================
   CATEGORY SECTION
===================================== */

.category-section {
  margin-bottom:
    32px;
}

.category-heading {
  margin-bottom:
    12px;

  color:
    #888;

  font-size:
    11px;

  font-weight:
    800;

  text-transform:
    uppercase;

  letter-spacing:
    1.8px;
}

.category-heading i {
  margin-right:
    7px;

  color:
    var(--red);
}

.category-filter {
  display:
    flex;

  gap:
    9px;

  flex-wrap:
    wrap;
}

.category-btn {
  position:
    relative;

  display:
    inline-flex;

  align-items:
    center;

  gap:
    8px;

  padding:
    10px 14px;

  border:
    1px solid #e5e5e5;

  border-radius:
    11px;

  background:
    rgba(255,255,255,0.8);

  color:
    #666;

  font-size:
    12px;

  font-weight:
    700;

  cursor:
    pointer;

  overflow:
    hidden;

  transition:
    all .3s cubic-bezier(
      .2,
      .8,
      .2,
      1
    );
}

.category-btn::before {
  content:
    "";

  position:
    absolute;

  inset:
    0;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.45),
      transparent
    );

  transform:
    translateX(-110%);

  transition:
    transform .55s ease;
}

.category-btn:hover::before {
  transform:
    translateX(110%);
}

.category-btn:hover {
  transform:
    translateY(-3px);

  border-color:
    rgba(230,57,70,.25);

  color:
    var(--red);

  box-shadow:
    0 8px 20px
    rgba(230,57,70,.08);
}

.category-btn.active {
  color:
    #fff;

  background:
    linear-gradient(
      135deg,
      #e63946,
      #c92f3b
    );

  border-color:
    var(--red);

  box-shadow:
    0 9px 25px
    rgba(230,57,70,.22);
}

.category-number {
  font-size:
    9px;

  opacity:
    .55;

  font-family:
    monospace;
}

.category-btn.active
.category-number {
  opacity:
    .75;
}

/* =====================================
   PRODUCT GRID
===================================== */

.products-grid {
  display:
    grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap:
    24px;
}

/* =====================================
   PRODUCT CARD
===================================== */

.product-card {
  position:
    relative;

  overflow:
    hidden;

  border:
    1px solid
    rgba(0,0,0,.055);

  border-radius:
    20px;

  background:
    rgba(255,255,255,.92);

  box-shadow:
    0 8px 30px
    rgba(0,0,0,.055);

  opacity:
    0;

  transform:
    translateY(30px)
    scale(.97);

  transition:
    transform .45s
      cubic-bezier(.2,.8,.2,1),
    box-shadow .45s ease,
    border-color .45s ease,
    opacity .5s ease;

  transition-delay:
    calc(
      var(--card-index) * 30ms
    );

  isolation:
    isolate;
}

.product-card.product-visible {
  opacity:
    1;

  transform:
    translateY(0)
    scale(1);
}

.product-card:hover {
  transform:
    translateY(-10px);

  border-color:
    rgba(230,57,70,.15);

  box-shadow:
    0 25px 55px
    rgba(0,0,0,.11);
}

/* =====================================
   CARD GLOW
===================================== */

.card-glow {
  position:
    absolute;

  width:
    180px;

  height:
    180px;

  top:
    -100px;

  right:
    -100px;

  border-radius:
    50%;

  background:
    rgba(230,57,70,.08);

  filter:
    blur(25px);

  opacity:
    0;

  transition:
    opacity .45s ease;

  pointer-events:
    none;

  z-index:
    -1;
}

.product-card:hover
.card-glow {
  opacity:
    1;
}

/* =====================================
   IMAGE
===================================== */

.product-image {
  position:
    relative;

  height:
    255px;

  overflow:
    hidden;

  cursor:
    pointer;

  background:
    linear-gradient(
      135deg,
      #f5f5f5,
      #eeeeee
    );
}

.product-image img {
  width:
    100%;

  height:
    100%;

  display:
    block;

  object-fit:
    cover;

  transition:
    transform .75s
      cubic-bezier(.2,.8,.2,1),
    filter .5s ease;
}

.product-card:hover
.product-image img {
  transform:
    scale(1.10);

  filter:
    saturate(1.08);
}

/* =====================================
   IMAGE SHADE
===================================== */

.image-shade {
  position:
    absolute;

  inset:
    0;

  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,.03),
      transparent 45%,
      rgba(0,0,0,.45)
    );

  opacity:
    .65;

  transition:
    opacity .4s ease;

  pointer-events:
    none;
}

.product-card:hover
.image-shade {
  opacity:
    .85;
}

/* =====================================
   IMAGE TOP
===================================== */

.image-top {
  position:
    absolute;

  top:
    14px;

  left:
    14px;

  right:
    14px;

  display:
    flex;

  align-items:
    flex-start;

  justify-content:
    space-between;

  gap:
    10px;

  z-index:
    5;
}

/* =====================================
   SALE BADGE
===================================== */

.sale-badge {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    5px;

  padding:
    7px 10px;

  border-radius:
    8px;

  background:
    linear-gradient(
      135deg,
      #e63946,
      #b92734
    );

  color:
    #fff;

  font-size:
    10px;

  font-weight:
    800;

  letter-spacing:
    .5px;

  box-shadow:
    0 7px 18px
    rgba(230,57,70,.25);

  animation:
    salePulse
    2.2s
    ease-in-out
    infinite;
}

.sale-badge i {
  font-size:
    9px;
}

@keyframes salePulse {

  0%,
  100% {
    transform:
      scale(1);
  }

  50% {
    transform:
      scale(1.04);
  }

}

/* =====================================
   STOCK
===================================== */

.stock-badge {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    6px;

  padding:
    7px 10px;

  border-radius:
    8px;

  color:
    #fff;

  font-size:
    9px;

  font-weight:
    800;

  backdrop-filter:
    blur(8px);
}

.stock-badge span {
  width:
    6px;

  height:
    6px;

  border-radius:
    50%;

  background:
    currentColor;
}

.in-stock {
  background:
    rgba(21,128,61,.85);
}

.in-stock span {
  animation:
    stockPulse
    1.6s
    infinite;
}

.out-stock {
  background:
    rgba(90,90,90,.8);
}

@keyframes stockPulse {

  0%,
  100% {
    box-shadow:
      0 0 0 0
      rgba(255,255,255,.5);
  }

  50% {
    box-shadow:
      0 0 0 4px
      rgba(255,255,255,0);
  }

}

/* =====================================
   WISHLIST
===================================== */

.wishlist-icon {
  position:
    absolute;

  right:
    14px;

  bottom:
    14px;

  width:
    42px;

  height:
    42px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    none;

  border-radius:
    50%;

  background:
    rgba(255,255,255,.94);

  color:
    var(--red);

  cursor:
    pointer;

  box-shadow:
    0 8px 20px
    rgba(0,0,0,.15);

  z-index:
    6;

  transition:
    transform .3s ease,
    background .3s ease,
    color .3s ease;
}

.wishlist-icon:hover {
  transform:
    scale(1.13)
    rotate(-8deg);

  background:
    var(--red);

  color:
    #fff;
}

.wishlist-icon.liked {
  background:
    var(--red);

  color:
    #fff;

  animation:
    heartPop
    .45s
    ease;
}

.wishlist-icon.liked i {
  animation:
    heartBeat
    1.2s
    ease-in-out
    infinite;
}

@keyframes heartPop {

  0% {
    transform:
      scale(.6);
  }

  70% {
    transform:
      scale(1.18);
  }

  100% {
    transform:
      scale(1);
  }

}

@keyframes heartBeat {

  0%,
  100% {
    transform:
      scale(1);
  }

  50% {
    transform:
      scale(1.18);
  }

}

/* =====================================
   VIEW PRODUCT
===================================== */

.view-product {
  position:
    absolute;

  left:
    50%;

  top:
    50%;

  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  padding:
    10px 15px;

  border:
    1px solid
    rgba(255,255,255,.35);

  border-radius:
    999px;

  background:
    rgba(0,0,0,.58);

  backdrop-filter:
    blur(10px);

  color:
    #fff;

  transform:
    translate(-50%, -35%)
    scale(.8);

  opacity:
    0;

  pointer-events:
    none;

  transition:
    all .4s
    cubic-bezier(.2,.8,.2,1);

  z-index:
    4;
}

.view-product.show {
  opacity:
    1;

  transform:
    translate(-50%, -50%)
    scale(1);
}

.view-product span {
  width:
    25px;

  height:
    25px;

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

  font-size:
    10px;
}

.view-product strong {
  font-size:
    11px;

  letter-spacing:
    .4px;
}

/* =====================================
   IMAGE CORNER
===================================== */

.image-corner {
  position:
    absolute;

  left:
    0;

  bottom:
    0;

  display:
    flex;

  gap:
    4px;

  padding:
    12px;

  z-index:
    5;
}

.image-corner span {
  width:
    4px;

  height:
    4px;

  border-radius:
    50%;

  background:
    rgba(255,255,255,.7);

  animation:
    dotFloat
    1.8s
    ease-in-out
    infinite;
}

.image-corner span:nth-child(2) {
  animation-delay:
    .2s;
}

.image-corner span:nth-child(3) {
  animation-delay:
    .4s;
}

@keyframes dotFloat {

  0%,
  100% {
    transform:
      translateY(0);

    opacity:
      .45;
  }

  50% {
    transform:
      translateY(-5px);

    opacity:
      1;
  }

}

/* =====================================
   PRODUCT INFO
===================================== */

.product-info {
  padding:
    21px;
}

/* =====================================
   META
===================================== */

.product-meta {
  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    10px;

  margin-bottom:
    8px;
}

.product-category {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    5px;

  color:
    var(--red);

  font-size:
    10px;

  font-weight:
    800;

  letter-spacing:
    1px;

  text-transform:
    uppercase;
}

.product-category i {
  font-size:
    8px;
}

.product-number {
  color:
    #c4c4c4;

  font-size:
    9px;

  font-weight:
    700;

  font-family:
    monospace;
}

/* =====================================
   PRODUCT TITLE
===================================== */

.product-info h2 {
  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  margin:
    0 0 8px;

  color:
    #202020;

  font-size:
    20px;

  line-height:
    1.3;

  font-weight:
    800;

  cursor:
    pointer;

  transition:
    color .25s ease,
    transform .25s ease;
}

.product-info h2:hover {
  color:
    var(--red);

  transform:
    translateX(3px);
}

.title-arrow {
  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    24px;

  height:
    24px;

  border-radius:
    50%;

  background:
    var(--red-light);

  color:
    var(--red);

  font-size:
    9px;

  opacity:
    0;

  transform:
    translateX(-5px);

  transition:
    all .25s ease;
}

.product-info h2:hover
.title-arrow {
  opacity:
    1;

  transform:
    translateX(0);
}

/* =====================================
   DESCRIPTION
===================================== */

.product-description {
  display:
    -webkit-box;

  margin:
    0 0 12px;

  min-height:
    42px;

  overflow:
    hidden;

  color:
    #858585;

  font-size:
    12px;

  line-height:
    1.65;

  -webkit-line-clamp:
    2;

  -webkit-box-orient:
    vertical;
}

/* =====================================
   RATING
===================================== */

.product-rating {
  display:
    flex;

  align-items:
    center;

  gap:
    7px;

  margin-bottom:
    13px;
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

.rating-number {
  color:
    #555;

  font-size:
    11px;

  font-weight:
    800;
}

.rating-divider {
  color:
    #ddd;

  font-size:
    11px;
}

.rating-label {
  color:
    #aaa;

  font-size:
    10px;
}

/* =====================================
   VARIANT
===================================== */

.variant-badge {
  width:
    100%;

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  margin:
    2px 0 16px;

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
      #fff8f8,
      #fff
    );

  color:
    var(--red);

  cursor:
    pointer;

  text-align:
    left;

  transition:
    all .3s
    cubic-bezier(.2,.8,.2,1);
}

.variant-badge:hover {
  transform:
    translateY(-3px);

  border-color:
    rgba(230,57,70,.3);

  background:
    linear-gradient(
      135deg,
      var(--red),
      #c92f3b
    );

  color:
    #fff;

  box-shadow:
    0 10px 25px
    rgba(230,57,70,.2);
}

.variant-icon {
  width:
    34px;

  height:
    34px;

  min-width:
    34px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    10px;

  background:
    #ffe7e9;

  transition:
    all .3s ease;
}

.variant-badge:hover
.variant-icon {
  background:
    rgba(255,255,255,.18);

  transform:
    rotate(-8deg)
    scale(1.08);
}

.variant-content {
  display:
    flex;

  flex-direction:
    column;

  gap:
    1px;

  flex: 1;
}

.variant-content small {
  font-size:
    7px;

  font-weight:
    800;

  letter-spacing:
    1px;

  opacity:
    .65;
}

.variant-content strong {
  font-size:
    11px;
}

.variant-arrow {
  width:
    25px;

  height:
    25px;

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

  transition:
    transform .3s ease,
    background .3s ease;
}

.variant-badge:hover
.variant-arrow {
  background:
    rgba(255,255,255,.15);

  transform:
    translateX(4px);
}

/* =====================================
   PRODUCT BOTTOM
===================================== */

.product-bottom {
  display:
    flex;

  align-items:
    flex-end;

  justify-content:
    space-between;

  gap:
    12px;

  padding-top:
    15px;

  border-top:
    1px solid #eeeeee;
}

/* =====================================
   PRICE
===================================== */

.product-price {
  min-width:
    100px;
}

.price-label {
  display:
    block;

  margin-bottom:
    3px;

  color:
    #aaa;

  font-size:
    8px;

  font-weight:
    700;

  text-transform:
    uppercase;

  letter-spacing:
    .7px;
}

.price-row {
  display:
    flex;

  align-items:
    baseline;

  gap:
    7px;
}

.product-price strong {
  color:
    #1d1d1d;

  font-size:
    21px;

  line-height:
    1;
}

.product-price del {
  color:
    #aaa;

  font-size:
    10px;
}

/* =====================================
   ADD CART
===================================== */

.add-cart-btn {
  position:
    relative;

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    7px;

  min-width:
    125px;

  padding:
    11px 14px;

  overflow:
    hidden;

  border:
    none;

  border-radius:
    11px;

  background:
    linear-gradient(
      135deg,
      #e63946,
      #c92f3b
    );

  color:
    #fff;

  font-size:
    11px;

  font-weight:
    800;

  cursor:
    pointer;

  box-shadow:
    0 7px 20px
    rgba(230,57,70,.19);

  transition:
    transform .25s ease,
    box-shadow .25s ease,
    background .25s ease;
}

.add-cart-btn::before {
  content:
    "";

  position:
    absolute;

  top:
    0;

  left:
    -100%;

  width:
    70%;

  height:
    100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.3),
      transparent
    );

  transform:
    skewX(-20deg);

  transition:
    left .55s ease;
}

.add-cart-btn:hover::before {
  left:
    140%;
}

.add-cart-btn:hover {
  transform:
    translateY(-3px);

  box-shadow:
    0 12px 28px
    rgba(230,57,70,.28);
}

.add-cart-btn:active {
  transform:
    translateY(0)
    scale(.97);
}

.add-cart-btn:disabled {
  background:
    #aaa;

  box-shadow:
    none;

  cursor:
    not-allowed;

  transform:
    none;
}

.cart-icon {
  width:
    22px;

  height:
    22px;

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

.add-cart-btn.cart-added {
  background:
    linear-gradient(
      135deg,
      #168f52,
      #117442
    );

  box-shadow:
    0 10px 25px
    rgba(22,143,82,.25);

  animation:
    cartSuccess
    .5s
    ease;
}

@keyframes cartSuccess {

  0% {
    transform:
      scale(1);
  }

  50% {
    transform:
      scale(1.06);
  }

  100% {
    transform:
      scale(1);
  }

}

/* =====================================
   TRUST BAR
===================================== */

.products-trust {
  display:
    grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap:
    15px;

  margin-top:
    45px;

  padding:
    17px;

  border:
    1px solid #e9e9e9;

  border-radius:
    18px;

  background:
    rgba(255,255,255,.72);

  backdrop-filter:
    blur(15px);
}

.trust-item {
  display:
    flex;

  align-items:
    center;

  gap:
    12px;

  padding:
    5px 15px;
}

.trust-icon {
  width:
    42px;

  height:
    42px;

  min-width:
    42px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    12px;

  background:
    var(--red-light);

  color:
    var(--red);

  transition:
    all .3s ease;
}

.trust-item:hover
.trust-icon {
  background:
    var(--red);

  color:
    #fff;

  transform:
    translateY(-3px)
    rotate(-4deg);
}

.trust-item strong {
  display:
    block;

  color:
    #333;

  font-size:
    11px;
}

.trust-item span {
  display:
    block;

  margin-top:
    3px;

  color:
    #999;

  font-size:
    9px;
}

/* =====================================
   EMPTY
===================================== */

.no-products {
  min-height:
    420px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  padding:
    50px 20px;

  border:
    1px solid #eee;

  border-radius:
    22px;

  background:
    rgba(255,255,255,.85);

  box-shadow:
    0 15px 40px
    rgba(0,0,0,.05);

  text-align:
    center;

  animation:
    emptyReveal
    .5s
    ease
    both;
}

@keyframes emptyReveal {

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

.empty-icon {
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
    20px;

  border-radius:
    50%;

  background:
    var(--red-light);

  color:
    var(--red);

  font-size:
    35px;
}

.empty-ring {
  position:
    absolute;

  inset:
    -8px;

  border:
    1px dashed
    rgba(230,57,70,.3);

  border-radius:
    50%;

  animation:
    ringSpin
    8s
    linear
    infinite;
}

@keyframes ringSpin {
  to {
    transform:
      rotate(360deg);
  }
}

.no-products > span {
  color:
    var(--red);

  font-size:
    10px;

  font-weight:
    800;

  letter-spacing:
    2px;
}

.no-products h2 {
  margin:
    7px 0;

  color:
    #222;

  font-size:
    27px;
}

.no-products p {
  max-width:
    400px;

  margin:
    0 0 20px;

  color:
    #888;

  font-size:
    13px;
}

.no-products button {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    7px;

  padding:
    11px 18px;

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

.no-products button:hover {
  background:
    var(--red-dark);

  transform:
    translateY(-3px);

  box-shadow:
    0 10px 25px
    rgba(230,57,70,.2);
}

/* =====================================
   LOADING
===================================== */

.products-loading {
  min-height:
    600px;

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

.loading-icon-wrap {
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
    25px;

  color:
    var(--red);

  font-size:
    31px;
}

.loading-ring {
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

.loading-ring::after {
  content:
    "";

  position:
    absolute;

  inset:
    9px;

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

.products-loading h2 {
  margin:
    0 0 7px;

  color:
    #222;

  font-size:
    25px;
}

.products-loading p {
  margin:
    0;

  color:
    #999;

  font-size:
    13px;
}

.loading-dots {
  display:
    inline-block;

  width:
    22px;

  overflow:
    hidden;

  animation:
    dots
    1.2s
    steps(4)
    infinite;
}

@keyframes dots {

  0% {
    width:
      0;
  }

  50% {
    width:
      10px;
  }

  75% {
    width:
      16px;
  }

  100% {
    width:
      22px;
  }

}

.loading-progress {
  width:
    180px;

  height:
    3px;

  margin-top:
    22px;

  overflow:
    hidden;

  border-radius:
    999px;

  background:
    #eee;
}

.loading-progress span {
  display:
    block;

  width:
    45%;

  height:
    100%;

  border-radius:
    inherit;

  background:
    var(--red);

  animation:
    loadingProgress
    1.4s
    ease-in-out
    infinite;
}

@keyframes loadingProgress {

  0% {
    transform:
      translateX(-120%);
  }

  100% {
    transform:
      translateX(400%);
  }

}

/* =====================================
   ERROR
===================================== */

.products-error {
  min-height:
    600px;

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

  animation:
    errorReveal
    .5s
    ease
    both;
}

@keyframes errorReveal {

  from {
    opacity:
      0;

    transform:
      scale(.95);
  }

  to {
    opacity:
      1;

    transform:
      scale(1);
  }

}

.error-icon-wrap {
  width:
    85px;

  height:
    85px;

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
    28px;

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
      0 0 0 14px
      rgba(230,57,70,0);
  }

}

.error-label {
  color:
    var(--red);

  font-size:
    10px;

  font-weight:
    800;

  letter-spacing:
    2px;
}

.products-error h2 {
  margin:
    8px 0;

  color:
    #222;

  font-size:
    28px;
}

.products-error p {
  margin:
    0 0 20px;

  color:
    #888;

  font-size:
    13px;
}

.retry-btn {
  display:
    inline-flex;

  align-items:
    center;

  gap:
    8px;

  padding:
    11px 19px;

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

.retry-btn:hover {
  background:
    var(--red-dark);

  transform:
    translateY(-3px);

  box-shadow:
    0 10px 25px
    rgba(230,57,70,.2);
}

.retry-btn:hover i {
  animation:
    retrySpin
    .6s
    ease;
}

@keyframes retrySpin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =====================================
   TABLET
===================================== */

@media (max-width: 1050px) {

  .products-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

}

/* =====================================
   MOBILE
===================================== */

@media (max-width: 700px) {

  .premium-products-page {
    padding:
      55px 14px 45px;
  }

  .products-header {
    margin-bottom:
      30px;
  }

  .products-header h1 {
    font-size:
      38px;

    letter-spacing:
      -1.5px;
  }

  .products-header h1 span {
    margin-left:
      7px;
  }

  .products-header > p {
    font-size:
      13px;

    line-height:
      1.7;
  }

  .products-stats {
    width:
      100%;

    justify-content:
      space-around;

    padding:
      13px 7px;

    border-radius:
      15px;
  }

  .stat-item {
    min-width:
      75px;
  }

  .stat-item strong {
    font-size:
      17px;
  }

  .stat-item span {
    font-size:
      8px;
  }

  .products-toolbar {
    flex-direction:
      column;

    align-items:
      stretch;

    padding:
      10px;

    border-radius:
      14px;
  }

  .products-search {
    width:
      100%;
  }

  .result-count {
    justify-content:
      center;
  }

  .category-filter {
    overflow-x:
      auto;

    flex-wrap:
      nowrap;

    padding-bottom:
      7px;

    scrollbar-width:
      none;
  }

  .category-filter::-webkit-scrollbar {
    display:
      none;
  }

  .category-btn {
    flex:
      0 0 auto;
  }

  .products-grid {
    grid-template-columns:
      1fr;

    gap:
      18px;
  }

  .product-card {
    border-radius:
      18px;
  }

  .product-image {
    height:
      245px;
  }

  .products-trust {
    grid-template-columns:
      1fr;

    gap:
      5px;

    padding:
      12px;
  }

  .trust-item {
    padding:
      10px;
  }

}

/* =====================================
   SMALL MOBILE
===================================== */

@media (max-width: 420px) {

  .premium-products-page {
    padding:
      45px 10px 35px;
  }

  .products-header h1 {
    font-size:
      33px;
  }

  .header-badge {
    font-size:
      9px;

    letter-spacing:
      1.3px;
  }

  .products-stats {
    margin-top:
      22px;
  }

  .stat-divider {
    height:
      28px;
  }

  .product-info {
    padding:
      17px;
  }

  .product-image {
    height:
      225px;
  }

  .product-bottom {
    flex-direction:
      column;

    align-items:
      stretch;
  }

  .product-price {
    width:
      100%;
  }

  .add-cart-btn {
    width:
      100%;
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
 
export default Products;