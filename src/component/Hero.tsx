import { useEffect, useState } from "react";
import "../assets/css/hero.css";
import logo from "../assets/img/Gemini_Generated_Image_3nsnv43nsnv43nsn.png";

function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className={loaded ? "hero-loaded" : ""}>
      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div className="hero-grid"></div>

      <div className="hero-noise"></div>

      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>
      <div className="hero-glow hero-glow-3"></div>

      {/* Background giant text */}
      <div className="hero-bg-word">
        AUTOMATION
      </div>

      {/* Floating particles */}
      <div className="hero-particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* ==========================================
          DECORATIVE INDUSTRIAL LINES
      ========================================== */}

      <div className="tech-line tech-line-1"></div>
      <div className="tech-line tech-line-2"></div>
      <div className="tech-line tech-line-3"></div>

      {/* ==========================================
          MAIN CONTAINER
      ========================================== */}

      <div className="container hero-container">
        <div className="row align-items-center hero-row">
          
          {/* ======================================
              LEFT CONTENT
          ====================================== */}

          <div className="col-lg-6 hero-left">

            {/* Eyebrow */}
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>

              <span>
                INDUSTRIAL AUTOMATION
              </span>

              <span className="eyebrow-line"></span>

              <span className="eyebrow-live">
                LIVE
              </span>
            </div>

            {/* Badge */}
            <div className="hbadge">
              <div className="hbi">
                <i className="fas fa-star"></i>
              </div>

              <span>
                Trusted Industrial Automation Partner
              </span>

              <i className="fas fa-arrow-up-right-from-square badge-arrow"></i>
            </div>

            {/* Main Heading */}

            <h1 className="htitle">
              <span className="title-small">
                POWERING THE
              </span>

              <span className="title-main">
                <span>SMART</span>
                <br />
                AUTOMATION
              </span>

              <span className="title-outline">
                FUTURE
              </span>
            </h1>

            {/* Description */}

            <p className="hdesc">
              Reliable industrial automation products and components
              designed to improve efficiency, precision, and performance.
            </p>

            {/* CTA */}

            <div className="hero-actions">

              <a
                href="#menu"
                className="btn-red hero-main-btn"
              >
                <span className="btn-icon">
                  <i className="fas fa-cubes"></i>
                </span>

                <span>
                  Explore Products
                </span>

                <i className="fas fa-arrow-right btn-arrow"></i>

                <span className="btn-shine"></span>
              </a>

              {/* Watch Story */}

              <a
                href="https://www.youtube.com/watch?v=RXv_uIN6e-Y"
                target="_blank"
                rel="noreferrer"
                className="magnific_popup btn-play popup-youtube hero-video-btn"
              >
                <span className="pico">
                  <i className="fas fa-play"></i>
                </span>

                <span>
                  Watch Our Story
                </span>

                <small>
                  02:14
                </small>
              </a>

            </div>

            {/* ======================================
                STATS
            ====================================== */}

            <div className="hstats">

              <div className="hstat">
                <span className="snum">
                  5000
                  <em>+</em>
                </span>

                <small>
                  Happy Customers
                </small>
              </div>

              <div className="sdiv"></div>

              <div className="hstat">
                <span className="snum">
                  1500
                  <em>+</em>
                </span>

                <small>
                  Products
                </small>
              </div>

              <div className="sdiv"></div>

              <div className="hstat">
                <span className="snum">
                  7
                  <em>yr</em>
                </span>

                <small>
                  Experience
                </small>
              </div>

              <div className="sdiv"></div>

            </div>

            {/* Trust strip */}

            <div className="hero-trust">

              <div className="trust-avatars">
                <span>
                  <i className="fas fa-user"></i>
                </span>

                <span>
                  <i className="fas fa-user"></i>
                </span>

                <span>
                  <i className="fas fa-user"></i>
                </span>

                <span>
                  <i className="fas fa-plus"></i>
                </span>
              </div>

              <div className="trust-text">
                <div className="trust-stars">
                  ★★★★★
                </div>

                <span>
                  Trusted by businesses across industries
                </span>
              </div>

            </div>

          </div>

          {/* ======================================
              RIGHT VISUAL
          ====================================== */}

          <div className="col-lg-6 hero-right">

            <div className="hero-visual">

              {/* Main glowing orb */}

              <div className="visual-orbit orbit-1"></div>
              <div className="visual-orbit orbit-2"></div>
              <div className="visual-orbit orbit-3"></div>

              {/* Rotating technical ring */}

              <div className="tech-ring">
                <span className="ring-dot dot-1"></span>
                <span className="ring-dot dot-2"></span>
                <span className="ring-dot dot-3"></span>
              </div>

              {/* Main image */}

              <div className="hcircle">

                <div className="circle-inner-glow"></div>

                <img
                  src={logo}
                  alt="Industrial Automation"
                />

                <div className="image-shine"></div>

              </div>

              {/* ==================================
                  TOP CARD
              ================================== */}

              <div className="fcard fc1">

                <div className="fcoi r">
                  <i className="fas fa-fire"></i>
                </div>

                <div>
                  <span className="fc-label">
                    SPECIAL OFFER
                  </span>

                  <span className="fcnum">
                    Hot Deal
                  </span>

                  <span className="fcsm">
                    30% off today
                  </span>
                </div>

                <div className="card-arrow">
                  <i className="fas fa-arrow-up-right"></i>
                </div>

              </div>

              {/* ==================================
                  RATING CARD
              ================================== */}

              <div className="fcard fc2">

                <div className="fcoi y">
                  <i className="fas fa-star"></i>
                </div>

                <div>
                  <span className="fc-label">
                    CUSTOMER RATING
                  </span>

                  <span className="fcnum">
                    4.9/5
                  </span>

                  <span className="fcsm">
                    2k+ reviews
                  </span>
                </div>

              </div>

              {/* ==================================
                  DELIVERY CARD
              ================================== */}

              <div className="fcard fc3">

                <div className="fcoi g">
                  <i className="fas fa-bolt"></i>
                </div>

                <div>
                  <span className="fc-label">
                    DELIVERY
                  </span>

                  <span className="fcnum">
                    FAST
                  </span>

                  <span className="fcsm">
                    Quick dispatch
                  </span>
                </div>

              </div>

              {/* ==================================
                  FLOATING TECH TAG
              ================================== */}

              <div className="tech-tag tech-tag-1">
                <span></span>
                PLC
              </div>

              <div className="tech-tag tech-tag-2">
                <span></span>
                SENSOR
              </div>

              <div className="tech-tag tech-tag-3">
                <span></span>
                CONTROL
              </div>

              {/* Center badge */}

              <div className="center-badge">
                <div className="center-badge-icon">
                  <i className="fas fa-microchip"></i>
                </div>

                <span>
                  INDUSTRY
                </span>

                <strong>
                  4.0
                </strong>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ==========================================
          BOTTOM SCROLL INDICATOR
      ========================================== */}

      <a
        href="#menu"
        className="hero-scroll"
      >
        <span className="scroll-line"></span>

        <span>
          EXPLORE
        </span>

        <i className="fas fa-arrow-down"></i>
      </a>

      {/* ==========================================
          SIDE NUMBER
      ========================================== */}

      <div className="hero-side-number">
        01
        <span></span>
        04
      </div>

    </section>
  );
}

export default Hero;