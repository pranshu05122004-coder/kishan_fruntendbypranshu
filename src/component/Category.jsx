import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Category.css";

function Category() {
  const categories = [
    {
      id: 1,
      title: "PLC & Automation",
      description:
        "PLC, controllers and complete industrial automation solutions.",
      icon: "fas fa-microchip",
    },
    {
      id: 2,
      title: "Sensors",
      description:
        "Industrial sensors for accurate detection, measurement and control.",
      icon: "fas fa-satellite-dish",
    },
    {
      id: 3,
      title: "Motors & Drives",
      description:
        "Industrial motors, VFDs and drive solutions for better performance.",
      icon: "fas fa-cogs",
    },
    {
      id: 4,
      title: "Control Panels",
      description:
        "Reliable electrical control panels designed for industrial applications.",
      icon: "fas fa-server",
    },
    {
      id: 5,
      title: "Industrial Switches",
      description:
        "Industrial switches and networking products for automation systems.",
      icon: "fas fa-network-wired",
    },
    {
      id: 6,
      title: "Power Supply",
      description:
        "Industrial power supplies and electrical products for automation.",
      icon: "fas fa-bolt",
    },
  ];

  return (
    <section className="category-page">

      {/* =====================================
          CATEGORY HERO
      ===================================== */}

      <div className="category-header">
        <div className="container">

          <span className="category-small-title">
            INDUSTRIAL DOCTOR
          </span>

          <h1>
            Explore Our <span>Categories</span>
          </h1>

          <p>
            Discover reliable industrial automation products
            and solutions designed for modern industries.
          </p>

        </div>
      </div>


      {/* =====================================
          CATEGORY CARDS
      ===================================== */}

      <div className="container category-container">

        <div className="category-grid">

          {categories.map((category) => (
            <div
              className="category-card"
              key={category.id}
            >

              {/* ICON */}

              <div className="category-icon">
                <i className={category.icon}></i>
              </div>


              {/* CONTENT */}

              <div className="category-content">

                <h3>
                  {category.title}
                </h3>

                <p>
                  {category.description}
                </p>

                <Link
                  to={`/products?category=${encodeURIComponent(
                    category.title
                  )}`}
                  className="category-btn"
                >
                  Explore Products
                  <i className="fas fa-arrow-right"></i>
                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Category;
