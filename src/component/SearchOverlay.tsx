import { useEffect, useRef, useState } from "react";
import "../assets/css/nav.css";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchOverlay({
  isOpen,
  onClose,
}: SearchOverlayProps) {

  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Overlay open hone par input focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        inputRef.current?.focus();
      }, 220);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Overlay close hone par
  const handleClose = () => {
    document.body.style.overflow = "";
    onClose();
  };

  // Backdrop par click
  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Trending search
  const handleTrendingClick = (text: string) => {
    setSearchText(text);
    inputRef.current?.focus();
  };

  // Search
  const handleSearch = () => {
    console.log("Search:", searchText);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="searchOv"
      className="open"
      onClick={handleBackdropClick}
    >

      {/* Close Button */}
      <button
        type="button"
        className="sovclose"
        id="searchClose"
        onClick={handleClose}
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="sovbox">

        <h4>What are you craving today?</h4>

        {/* Search Input */}
        <div className="sovinput">

          <input
            ref={inputRef}
            type="text"
            id="searchInput"
            placeholder="Search burgers, pizza, chicken..."
            autoComplete="off"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            type="button"
            onClick={handleSearch}
          >
            <i className="fas fa-search"></i>
          </button>

        </div>

        {/* Categories */}
        <div className="sovcats">

          <div className="sovcat active" data-cat="all">
            <img src="/img/menu/1.jpg" alt="All Items" />
            All Items
          </div>

          <div className="sovcat" data-cat="burgers">
            <img src="/img/menu/1.jpg" alt="Burgers" />
            Burgers
          </div>

          <div className="sovcat" data-cat="pizza">
            <img src="/img/menu/2.jpg" alt="Pizza" />
            Pizza
          </div>

          <div className="sovcat" data-cat="chicken">
            <img src="/img/menu/3.jpg" alt="Chicken" />
            Chicken
          </div>

          <div className="sovcat" data-cat="wraps">
            <img src="/img/menu/4.jpg" alt="Wraps" />
            Wraps
          </div>

          <div className="sovcat" data-cat="pasta">
            <img src="/img/menu/5.jpg" alt="Pasta" />
            Pasta
          </div>

          <div className="sovcat" data-cat="desserts">
            <img src="/img/menu/6.jpg" alt="Desserts" />
            Desserts
          </div>

        </div>

        {/* Trending Searches */}
        <div className="sovtrend">

          <p>
            <i
              className="fas fa-fire me-1"
              style={{ color: "var(--secondary)" }}
            ></i>
            Trending Searches
          </p>

          <span
            className="ttag"
            onClick={() => handleTrendingClick("Smash Burger")}
          >
            Smash Burger
          </span>

          <span
            className="ttag"
            onClick={() => handleTrendingClick("Nashville Chicken")}
          >
            Nashville Chicken
          </span>

          <span
            className="ttag"
            onClick={() => handleTrendingClick("Truffle Pizza")}
          >
            Truffle Pizza
          </span>

          <span
            className="ttag"
            onClick={() => handleTrendingClick("Lava Cake")}
          >
            Lava Cake
          </span>

          <span
            className="ttag"
            onClick={() => handleTrendingClick("Loaded Fries")}
          >
            Loaded Fries
          </span>

          <span
            className="ttag"
            onClick={() => handleTrendingClick("Mango Shake")}
          >
            Mango Shake
          </span>

        </div>

      </div>
    </div>
  );
}

export default SearchOverlay;