import { API_BASE } from "../config/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/nav.css";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  product_id: number;
  product_name: string;
  slug?: string;
  category?: string;
  description?: string;

  product_image?: string | null;
  product_price?: number | string | null;
  product_old_price?: number | string | null;

  variant_id?: number | null;
  variant_name?: string | null;
  variant_code?: string | null;
  part_number?: string | null;

  variant_price?: number | string | null;
  variant_old_price?: number | string | null;

  variant_image?: string | null;
  pdf_path?: string | null;
  variant_stock?: number | null;
}

function SearchOverlay({
  isOpen,
  onClose,
}: SearchOverlayProps) {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // =====================================================
  // OPEN / CLOSE
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    document.body.style.overflow = "";

    setSearchText("");
    setResults([]);
    setSearched(false);

    onClose();
  };

  // =====================================================
  // BACKDROP CLICK
  // =====================================================

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = async () => {
    const query = searchText.trim();

    if (!query) {
      setResults([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const response = await fetch(
        `${API_BASE}/products/search?q=${encodeURIComponent(
          query
        )}`
      );

      const data = await response.json();

      if (data.success) {
        setResults(data.results || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("❌ Search Error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESULT CLICK
  // =====================================================

  const handleResultClick = (
    result: SearchResult
  ) => {
    if (result.variant_id) {
      navigate(
        `/product/${result.product_id}?variantId=${result.variant_id}`
      );
    } else {
      navigate(`/product/${result.product_id}`);
    }

    handleClose();
  };

  // =====================================================
  // PDF
  // =====================================================

  const handlePdfClick = (
    e: React.MouseEvent,
    pdfPath: string
  ) => {
    e.stopPropagation();

    window.open(
      pdfPath,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // PRICE
  // =====================================================

  const getPrice = (
    result: SearchResult
  ) => {
    return (
      result.variant_price ??
      result.product_price ??
      0
    );
  };

  // =====================================================
  // OLD PRICE
  // =====================================================

  const getOldPrice = (
    result: SearchResult
  ) => {
    return (
      result.variant_old_price ??
      result.product_old_price ??
      null
    );
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const getImage = (
    result: SearchResult
  ) => {
    return (
      result.variant_image ||
      result.product_image ||
      "/img/placeholder.jpg"
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="searchOv"
      className="search-overlay"
      onClick={handleBackdropClick}
    >
      {/* =================================================
          SEARCH CONTAINER
      ================================================= */}

      <div className="search-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="search-header">

          <h4>
            Search Products
          </h4>

          <button
            type="button"
            className="search-close"
            onClick={handleClose}
            aria-label="Close search"
          >
            <i className="fas fa-times"></i>
          </button>

        </div>

        {/* =================================================
            SEARCH INPUT
        ================================================= */}

        <div className="search-input-wrapper">

          <i className="fas fa-search search-input-icon"></i>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search product, variant code or part number..."
            autoComplete="off"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);

              if (!e.target.value.trim()) {
                setResults([]);
                setSearched(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          {searchText && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setSearchText("");
                setResults([]);
                setSearched(false);
                inputRef.current?.focus();
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}

          <button
            type="button"
            className="search-submit"
            onClick={handleSearch}
          >
            <i className="fas fa-search"></i>
          </button>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="search-loading">

            <i className="fas fa-spinner fa-spin"></i>

            <span>
              Searching products...
            </span>

          </div>
        )}

        {/* =================================================
            RESULTS
        ================================================= */}

        {!loading &&
          searched &&
          results.length > 0 && (
            <div className="search-results">

              <div className="search-result-count">
                {results.length} result
                {results.length !== 1
                  ? "s"
                  : ""}
              </div>

              {results.map((result) => {

                const price =
                  getPrice(result);

                const oldPrice =
                  getOldPrice(result);

                const image =
                  getImage(result);

                return (
                  <div
                    key={`${result.product_id}-${result.variant_id || "product"}`}
                    className="search-result"
                    onClick={() =>
                      handleResultClick(result)
                    }
                  >

                    {/* IMAGE */}

                    <div className="search-result-image">

                      <img
                        src={image}
                        alt={
                          result.variant_name ||
                          result.product_name
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "/img/placeholder.jpg";
                        }}
                      />

                    </div>

                    {/* INFORMATION */}

                    <div className="search-result-info">

                      <h5>
                        {result.product_name}
                      </h5>

                      {result.variant_name && (
                        <div className="search-variant">
                          {result.variant_name}
                        </div>
                      )}

                      <div className="search-details">

                        {result.variant_code && (
                          <span>
                            <b>Code:</b>{" "}
                            {result.variant_code}
                          </span>
                        )}

                        {result.part_number && (
                          <span>
                            <b>Part:</b>{" "}
                            {result.part_number}
                          </span>
                        )}

                      </div>

                      <div className="search-bottom">

                        <div className="search-price">

                          ₹
                          {Number(
                            price
                          ).toLocaleString(
                            "en-IN"
                          )}

                          {oldPrice !== null &&
                            Number(oldPrice) >
                              Number(price) && (
                              <del>
                                ₹
                                {Number(
                                  oldPrice
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </del>
                            )}

                        </div>

                        {result.variant_stock !==
                          undefined && (
                          <span
                            className={
                              Number(
                                result.variant_stock
                              ) > 0
                                ? "search-in-stock"
                                : "search-out-stock"
                            }
                          >
                            {Number(
                              result.variant_stock
                            ) > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        )}

                      </div>

                    </div>

                    {/* ACTION */}

                    <div className="search-result-action">

                      {result.pdf_path && (
                        <button
                          type="button"
                          className="search-pdf"
                          title="View PDF"
                          onClick={(e) =>
                            handlePdfClick(
                              e,
                              result.pdf_path!
                            )
                          }
                        >
                          <i className="fas fa-file-pdf"></i>
                        </button>
                      )}

                      <i className="fas fa-chevron-right"></i>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        {/* =================================================
            NO RESULT
        ================================================= */}

        {!loading &&
          searched &&
          results.length === 0 && (
            <div className="search-empty">

              <div className="search-empty-icon">
                <i className="fas fa-search"></i>
              </div>

              <h5>
                No products found
              </h5>

              <p>
                Try searching by product name,
                variant code or part number.
              </p>

            </div>
          )}

      </div>
    </div>
  );
}

export default SearchOverlay;