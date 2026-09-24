import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import "../assets/css/vareint.css";

interface Variant {
  id: number;
  product_id: number;
  variant_name: string;
  variant_code?: string;
  price?: number | string;
  old_price?: number | string | null;
  image?: string | null;
  pdf_path?: string | null; // ✅ NEW
  stock?: number;
  status?: number;
}

const Variant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // FETCH PRODUCT + VARIANTS
  // =====================================

  useEffect(() => {
    const fetchVariants = async () => {
      if (!id) {
        setError("Product ID missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("🔥 Product ID:", id);

        const response = await fetch(
          `http://localhost:5001/api/products/${id}`
        );

        const data = await response.json();

        console.log("🔥 API RESPONSE:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Variants load failed"
          );
        }

        const productVariants =
          data.product?.variants || [];

        setVariants(productVariants);
      } catch (err) {
        console.error("❌ Variant Error:", err);

        setError(
          "Variants load nahi ho paaye."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [id]);

  // =====================================
  // GO TO PRODUCT DETAILS
  // =====================================

  const handleCheckout = (variant: Variant) => {
    console.log("🛒 Selected Variant:", variant);
    console.log("🆔 Product ID:", variant.product_id);
    console.log("🆔 Variant ID:", variant.id);

    navigate(
      `/product/${variant.product_id}?variantId=${variant.id}`,
      {
        state: {
          variant,
          productId: variant.product_id,
          variantId: variant.id,
          quantity: 1,
        },
      }
    );
  };

  // =====================================
  // VIEW PDF
  // =====================================

  const handleViewPdf = (variant: Variant) => {
    if (!variant.pdf_path) {
      alert("Is variant ka PDF available nahi hai.");
      return;
    }

    const pdfUrl = variant.pdf_path.startsWith("http")
      ? variant.pdf_path
      : `http://localhost:5001${variant.pdf_path}`;

    console.log("📄 Opening PDF:", pdfUrl);

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="variant-section">
        <h3>Loading Variants...</h3>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="variant-section">
        <h3>{error}</h3>
      </div>
    );
  }

  // =====================================
  // NO VARIANTS
  // =====================================

  if (variants.length === 0) {
    return (
      <div className="variant-section">
        <h3>No Variants Available</h3>
      </div>
    );
  }

  // =====================================
  // VARIANTS
  // =====================================

  return (
    <div className="variant-section">

      <div className="variant-section-header">
        <h3>Available Variants</h3>

        <span className="variant-total">
          {variants.length} Variants
        </span>
      </div>

      <div className="variant-grid">

        {variants.map((variant) => {
          const price =
            variant.price !== undefined
              ? Number(variant.price)
              : 0;

          const oldPrice =
            variant.old_price !== null &&
            variant.old_price !== undefined &&
            variant.old_price !== ""
              ? Number(variant.old_price)
              : null;

          const stock =
            Number(variant.stock || 0);

          const isInStock = stock > 0;

          return (
            <div
              key={variant.id}
              className="variant-card"
            >

              {/* ICON */}

              <div className="variant-card-icon">
                <i className="fas fa-layer-group"></i>
              </div>

              {/* CONTENT */}

              <div className="variant-card-content">

                <h4>
                  {variant.variant_name}
                </h4>

                {variant.variant_code && (
                  <p className="variant-code">
                    {variant.variant_code}
                  </p>
                )}

                {/* PRICE */}

                {variant.price !== undefined && (
                  <div className="variant-price">
                    ₹
                    {price.toLocaleString("en-IN")}
                  </div>
                )}

                {/* OLD PRICE */}

                {oldPrice !== null &&
                  oldPrice > price && (
                    <div className="variant-old-price">
                      ₹
                      {oldPrice.toLocaleString("en-IN")}
                    </div>
                  )}

                {/* STOCK */}

                <p className="variant-stock">
                  {isInStock
                    ? `Stock: ${stock}`
                    : "Out of Stock"}
                </p>

                {/* ACTIONS */}

                <div className="variant-actions">

                  {/* CHECKOUT */}

                  <button
                    type="button"
                    className="variant-checkout-btn"
                    disabled={!isInStock}
                    onClick={() =>
                      handleCheckout(variant)
                    }
                  >
                    <i className="fas fa-shopping-bag"></i>

                    {isInStock
                      ? "Checkout"
                      : "Out of Stock"}
                  </button>

                  {/* VIEW PDF */}

                  {variant.pdf_path && (
                    <button
                      type="button"
                      className="variant-pdf-btn"
                      onClick={() =>
                        handleViewPdf(variant)
                      }
                    >
                      <i className="fas fa-file-pdf"></i>
                      View PDF
                    </button>
                  )}

                </div>

              </div>

              {/* ARROW */}

              <div className="variant-arrow">
                →
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Variant;
