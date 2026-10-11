import React, { useEffect, useRef, useState } from "react";

const Contact = () => {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [visible, setVisible] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.18 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // Mouse movement
  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMouse({ x, y });

    // Subtle magnetic tilt
    if (panelRef.current && window.innerWidth > 900) {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      panelRef.current.style.transform = `
        perspective(1400px)
        rotateX(${py * -2.5}deg)
        rotateY(${px * 2.5}deg)
        translateY(-4px)
      `;
    }
  };

  const handleMouseLeave = () => {
    if (panelRef.current) {
      panelRef.current.style.transform = `
        perspective(1400px)
        rotateX(0deg)
        rotateY(0deg)
        translateY(0)
      `;
    }
  };

  return (
    <section
      id="contact-section"
      ref={sectionRef}
      className={`premium-contact ${visible ? "contact-visible" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        "--mouse-x": `${mouse.x}%`,
        "--mouse-y": `${mouse.y}%`,
      }}
    >
      {/* Cursor light */}
      <div className="contact-cursor-light"></div>

      {/* Background atmosphere */}
      <div className="contact-orb contact-orb-one"></div>
      <div className="contact-orb contact-orb-two"></div>

      {/* Technical grid */}
      <div className="contact-grid-bg"></div>

      {/* Moving horizontal light */}
      <div className="contact-scan-line"></div>

      <div className="contact-container">

        {/* ================= HEADER ================= */}
        <div className="contact-heading-wrap">

          <div className="contact-eyebrow">
            <span className="eyebrow-line"></span>
            <span>CONTACT NODE 01</span>
            <span className="eyebrow-dot"></span>
          </div>

          <h2 className="contact-heading">
            <span className="heading-line">
              Let&apos;s <span className="heading-accent">Connect</span>
            </span>

            <span className="heading-line heading-second">
              Talk to Our Team
            </span>
          </h2>

          <p className="contact-description">
            Have a question, need a quotation, or looking for the right
            industrial solution? Our team is ready to help.
          </p>

        </div>

        {/* ================= MAIN ================= */}
        <div className="contact-grid">

          {/* ================= LEFT PANEL ================= */}
          <div
            ref={panelRef}
            className="contact-info-card"
          >

            {/* Glass shine */}
            <div className="card-shine"></div>

            {/* Circuit decoration */}
            <div className="circuit circuit-one">
              <span></span>
            </div>

            <div className="circuit circuit-two">
              <span></span>
            </div>

            <div className="circuit circuit-three">
              <span></span>
            </div>

            {/* Top status */}
            <div className="contact-status">
              <span className="status-light"></span>
              <span>LIVE CONNECTION</span>
            </div>

            <div className="contact-number">01</div>

            <div className="contact-info-content">

              <span className="contact-mini-label">
                INDUSTRIAL AUTOMATION
              </span>

              <h3 className="contact-info-title">
                Let&apos;s build
                <br />
                something <span>better.</span>
              </h3>

              <p className="contact-info-subtitle">
                Connect with our team for product enquiries,
                technical assistance and customised solutions.
              </p>

              {/* ================= CONTACT ITEMS ================= */}

              <div className="contact-items">

                {/* Address */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-location-dot"></i>
                  </div>

                  <div className="contact-item-info">
                    <span className="contact-item-title">
                      OUR LOCATION
                    </span>

                    <span className="contact-item-value">
                      SBS Colony, Karawal Nagar,
                      <br />
                      Delhi - 110094
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>

                  <div className="contact-item-info">
                    <span className="contact-item-title">
                      CALL US
                    </span>

                    <span className="contact-item-value">
                      8076128812
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>

                  <div className="contact-item-info">
                    <span className="contact-item-title">
                      EMAIL
                    </span>

                    <span className="contact-item-value">
                      Contact us for enquiries
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>

                  <div className="contact-item-info">
                    <span className="contact-item-title">
                      WORKING HOURS
                    </span>

                    <span className="contact-item-value">
                      Mon - Sat: 9 AM - 7 PM
                    </span>
                  </div>
                </div>

              </div>

              {/* ================= SOCIAL ================= */}

              <div className="contact-social-wrap">
                <span>FOLLOW OUR WORK</span>

                <div className="contact-socials">

                  <a href="#" className="contact-social">
                    <i className="fab fa-facebook-f"></i>
                  </a>

                  <a href="#" className="contact-social">
                    <i className="fab fa-instagram"></i>
                  </a>

                  <a href="#" className="contact-social">
                    <i className="fab fa-linkedin-in"></i>
                  </a>

                  <a href="#" className="contact-social">
                    <i className="fab fa-youtube"></i>
                  </a>

                </div>
              </div>

            </div>
          </div>

          {/* ================= FORM ================= */}
          <div className="contact-form-card">

            <div className="form-card-top">

              <div>
                <span className="form-code">
                  ENQUIRY / 002
                </span>

                <h3 className="form-top-title">
                  Start a conversation
                </h3>
              </div>

              <div className="form-live">
                <span></span>
                READY
              </div>

            </div>

            <p className="form-top-text">
              Tell us what you&apos;re looking for and our team
              will get back to you.
            </p>

            <form>

              {/* Name + Email */}
              <div className="form-row">

                <div className="contact-field">
                  <label>
                    YOUR NAME
                  </label>

                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Enter your name"
                    />
                    <span className="input-line"></span>
                  </div>
                </div>

                <div className="contact-field">
                  <label>
                    EMAIL ADDRESS
                  </label>

                  <div className="input-wrap">
                    <input
                      type="email"
                      placeholder="Enter your email"
                    />
                    <span className="input-line"></span>
                  </div>
                </div>

              </div>

              {/* Phone + Subject */}
              <div className="form-row">

                <div className="contact-field">
                  <label>
                    PHONE NUMBER
                  </label>

                  <div className="input-wrap">
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                    />
                    <span className="input-line"></span>
                  </div>
                </div>

                <div className="contact-field">
                  <label>
                    ENQUIRY TYPE
                  </label>

                  <div className="input-wrap">
                    <select defaultValue="">
                      <option value="" disabled>
                        Select enquiry
                      </option>

                      <option>
                        Product Enquiry
                      </option>

                      <option>
                        Get a Quotation
                      </option>

                      <option>
                        Technical Support
                      </option>

                      <option>
                        Bulk Order
                      </option>

                      <option>
                        Product Availability
                      </option>

                      <option>
                        Other
                      </option>
                    </select>

                    <span className="input-line"></span>
                  </div>
                </div>

              </div>

              {/* Message */}
              <div className="contact-field message-field">

                <label>
                  YOUR MESSAGE
                </label>

                <div className="input-wrap">
                  <textarea
                    rows="5"
                    placeholder="Tell us about your requirement..."
                  ></textarea>

                  <span className="input-line"></span>
                </div>

              </div>

              {/* Submit */}
              <button
                type="button"
                className="contact-submit"
              >
                <span className="button-text">
                  SEND ENQUIRY
                </span>

                <span className="button-arrow">
                  <i className="fas fa-arrow-right"></i>
                </span>

                <span className="button-energy"></span>
              </button>

            </form>

            {/* Bottom code */}
            <div className="form-footer">
              <span>
                SECURE COMMUNICATION
              </span>

              <span>
                ● ONLINE
              </span>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM SIGNATURE ================= */}

        <div className="contact-bottom-line">
          <span>PRECISION</span>

          <div className="signature-line">
            <span></span>
          </div>

          <span>ENGINEERED</span>
        </div>

      </div>

      <style>{`

        /* =====================================================
           MAIN SECTION
        ===================================================== */

        #contact-section.premium-contact {
          --red: #c62828;
          --dark-red: #8f1717;
          --text: #161616;
          --muted: #737373;

          position: relative;
          overflow: hidden;
          padding: 130px 0 90px;
          background:
            radial-gradient(
              circle at var(--mouse-x) var(--mouse-y),
              rgba(198,40,40,.075),
              transparent 27%
            ),
            #f8f8f6;

          color: var(--text);
        }

        /* =====================================================
           GRID
        ===================================================== */

        .contact-grid-bg {
          position: absolute;
          inset: 0;
          opacity: .34;
          pointer-events: none;

          background-image:
            linear-gradient(
              rgba(0,0,0,.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(0,0,0,.035) 1px,
              transparent 1px
            );

          background-size: 55px 55px;

          mask-image:
            linear-gradient(
              to bottom,
              transparent,
              black 20%,
              black 80%,
              transparent
            );
        }

        /* =====================================================
           CURSOR LIGHT
        ===================================================== */

        .contact-cursor-light {
          position: absolute;

          width: 420px;
          height: 420px;

          left: var(--mouse-x);
          top: var(--mouse-y);

          transform: translate(-50%, -50%);

          background:
            radial-gradient(
              circle,
              rgba(198,40,40,.07),
              transparent 65%
            );

          pointer-events: none;

          transition:
            left .15s ease-out,
            top .15s ease-out;
        }

        /* =====================================================
           BACKGROUND ORBS
        ===================================================== */

        .contact-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .contact-orb-one {
          width: 350px;
          height: 350px;

          top: -160px;
          right: -100px;

          border: 1px solid rgba(198,40,40,.09);

          animation:
            orbFloat 12s ease-in-out infinite;
        }

        .contact-orb-two {
          width: 220px;
          height: 220px;

          bottom: -100px;
          left: -80px;

          border: 1px solid rgba(0,0,0,.06);

          animation:
            orbFloatTwo 15s ease-in-out infinite;
        }

        @keyframes orbFloat {
          0%,100% {
            transform: translate(0,0) scale(1);
          }

          50% {
            transform: translate(-30px,25px) scale(1.08);
          }
        }

        @keyframes orbFloatTwo {
          0%,100% {
            transform: translate(0,0);
          }

          50% {
            transform: translate(25px,-20px);
          }
        }

        /* =====================================================
           SCAN LINE
        ===================================================== */

        .contact-scan-line {
          position: absolute;

          left: 0;
          width: 100%;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(198,40,40,.25),
              transparent
            );

          top: 0;

          animation:
            scanLine 9s linear infinite;

          pointer-events: none;
        }

        @keyframes scanLine {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          90% {
            opacity: 1;
          }

          100% {
            transform: translateY(900px);
            opacity: 0;
          }
        }

        /* =====================================================
           CONTAINER
        ===================================================== */

        .contact-container {
          position: relative;
          z-index: 2;

          width: min(1180px, 92%);
          margin: auto;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .contact-heading-wrap {
          max-width: 850px;
          margin-bottom: 65px;
        }

        .contact-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;

          margin-bottom: 22px;

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #777;
        }

        .eyebrow-line {
          width: 38px;
          height: 1px;
          background: var(--red);
        }

        .eyebrow-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--red);

          animation:
            statusPulse 2s infinite;
        }

        .contact-heading {
          margin: 0;

          font-size: clamp(48px, 6vw, 82px);
          line-height: .98;

          letter-spacing: -4px;
          font-weight: 700;
        }

        .heading-line {
          display: block;

          opacity: 0;
          transform:
            translateY(45px)
            scale(.97);

          filter: blur(12px);

          transition:
            opacity 1s cubic-bezier(.16,1,.3,1),
            transform 1.1s cubic-bezier(.16,1,.3,1),
            filter 1s ease;
        }

        .heading-second {
          transition-delay: .12s;
        }

        .contact-visible .heading-line {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);

          filter: blur(0);
        }

        .heading-accent {
          color: var(--red);
        }

        .contact-description {
          max-width: 620px;

          margin: 28px 0 0;

          color: #707070;

          font-size: 16px;
          line-height: 1.8;

          opacity: 0;
          transform: translateY(20px);

          transition:
            opacity .9s ease .35s,
            transform .9s cubic-bezier(.16,1,.3,1) .35s;
        }

        .contact-visible .contact-description {
          opacity: 1;
          transform: translateY(0);
        }

        /* =====================================================
           MAIN GRID
        ===================================================== */

        .contact-grid {
          display: grid;

          grid-template-columns:
            minmax(0, .88fr)
            minmax(0, 1.12fr);

          gap: 25px;

          align-items: stretch;
        }

        /* =====================================================
           LEFT CARD
        ===================================================== */

        .contact-info-card {
          position: relative;
          overflow: hidden;

          min-height: 650px;

          padding: 42px;

          border-radius: 30px;

          background:
            linear-gradient(
              145deg,
              #151515,
              #202020
            );

          color: white;

          box-shadow:
            0 35px 80px rgba(0,0,0,.15);

          transition:
            transform .25s ease,
            box-shadow .5s ease;

          transform-style: preserve-3d;
        }

        .contact-info-card:hover {
          box-shadow:
            0 45px 100px rgba(0,0,0,.2);
        }

        .card-shine {
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at var(--mouse-x) var(--mouse-y),
              rgba(255,255,255,.09),
              transparent 32%
            );

          pointer-events: none;
        }

        /* =====================================================
           CIRCUITS
        ===================================================== */

        .circuit {
          position: absolute;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.15),
              transparent
            );

          overflow: hidden;
          opacity: .7;
        }

        .circuit span {
          position: absolute;

          width: 55px;
          height: 2px;

          background:
            linear-gradient(
              90deg,
              transparent,
              var(--red),
              transparent
            );

          filter:
            drop-shadow(
              0 0 8px rgba(198,40,40,.8)
            );

          animation:
            circuitMove 4s linear infinite;
        }

        .circuit-one {
          width: 70%;
          top: 110px;
          right: -20%;
        }

        .circuit-two {
          width: 55%;
          bottom: 170px;
          left: -15%;
        }

        .circuit-three {
          width: 40%;
          bottom: 80px;
          right: -5%;
        }

        .circuit-two span {
          animation-delay: 1.4s;
        }

        .circuit-three span {
          animation-delay: 2.4s;
        }

        @keyframes circuitMove {
          from {
            transform: translateX(-80px);
          }

          to {
            transform: translateX(500px);
          }
        }

        /* =====================================================
           STATUS
        ===================================================== */

        .contact-status {
          position: absolute;

          top: 30px;
          right: 30px;

          display: flex;
          align-items: center;
          gap: 8px;

          padding: 8px 12px;

          border: 1px solid rgba(255,255,255,.09);
          border-radius: 100px;

          background: rgba(255,255,255,.035);

          font-size: 8px;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,.55);
        }

        .status-light {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #5cff87;

          box-shadow:
            0 0 0 4px rgba(92,255,135,.08),
            0 0 12px rgba(92,255,135,.6);

          animation:
            statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%,100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: .45;
            transform: scale(.75);
          }
        }

        .contact-number {
          position: absolute;

          right: 32px;
          bottom: 25px;

          font-size: 90px;
          line-height: 1;

          font-weight: 700;

          color: rgba(255,255,255,.035);

          user-select: none;
        }

        .contact-info-content {
          position: relative;
          z-index: 2;
        }

        .contact-mini-label {
          display: inline-block;

          margin-top: 55px;
          margin-bottom: 20px;

          color: rgba(255,255,255,.4);

          font-size: 9px;
          letter-spacing: 2.5px;
          font-weight: 700;
        }

        .contact-info-title {
          margin: 0;

          font-size: clamp(34px, 4vw, 48px);
          line-height: 1.05;

          letter-spacing: -2px;
        }

        .contact-info-title span {
          color: #e43b3b;
        }

        .contact-info-subtitle {
          max-width: 390px;

          margin: 22px 0 40px;

          color: rgba(255,255,255,.5);

          font-size: 13px;
          line-height: 1.75;
        }

        /* =====================================================
           CONTACT ITEMS
        ===================================================== */

        .contact-items {
          display: grid;
          gap: 19px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 15px;

          transition:
            transform .35s ease;
        }

        .contact-item:hover {
          transform: translateX(7px);
        }

        .contact-icon {
          display: grid;
          place-items: center;

          flex-shrink: 0;

          width: 38px;
          height: 38px;

          border-radius: 11px;

          background:
            rgba(255,255,255,.055);

          border: 1px solid rgba(255,255,255,.07);

          color: #e33b3b;

          font-size: 12px;

          transition:
            background .3s ease,
            transform .3s ease;
        }

        .contact-item:hover .contact-icon {
          background: rgba(198,40,40,.13);
          transform: scale(1.08);
        }

        .contact-item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-item-title {
          font-size: 8px;
          letter-spacing: 1.7px;

          color: rgba(255,255,255,.32);
        }

        .contact-item-value {
          font-size: 12px;
          line-height: 1.45;

          color: rgba(255,255,255,.78);
        }

        /* =====================================================
           SOCIAL
        ===================================================== */

        .contact-social-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 38px;
          padding-top: 24px;

          border-top: 1px solid rgba(255,255,255,.07);
        }

        .contact-social-wrap > span {
          font-size: 8px;
          letter-spacing: 1.5px;

          color: rgba(255,255,255,.3);
        }

        .contact-socials {
          display: flex;
          gap: 8px;
        }

        .contact-social {
          display: grid;
          place-items: center;

          width: 30px;
          height: 30px;

          border-radius: 50%;

          color: rgba(255,255,255,.5);
          background: rgba(255,255,255,.045);

          text-decoration: none;

          transition:
            color .3s ease,
            background .3s ease,
            transform .3s ease;
        }

        .contact-social:hover {
          color: white;
          background: var(--red);

          transform:
            translateY(-4px)
            rotate(-5deg);
        }

        /* =====================================================
           FORM CARD
        ===================================================== */

        .contact-form-card {
          position: relative;
          overflow: hidden;

          padding: 46px;

          border-radius: 30px;

          background:
            rgba(255,255,255,.72);

          border:
            1px solid rgba(0,0,0,.07);

          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);

          box-shadow:
            0 30px 80px rgba(0,0,0,.06);

          opacity: 0;
          transform:
            translateY(55px)
            scale(.98);

          transition:
            opacity 1s cubic-bezier(.16,1,.3,1) .2s,
            transform 1.1s cubic-bezier(.16,1,.3,1) .2s;
        }

        .contact-visible .contact-form-card {
          opacity: 1;

          transform:
            translateY(0)
            scale(1);
        }

        /* Form shine */
        .contact-form-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: -100%;

          width: 50%;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              var(--red),
              transparent
            );

          animation:
            formScanner 6s ease-in-out infinite;
        }

        @keyframes formScanner {
          0%, 20% {
            left: -50%;
          }

          70%, 100% {
            left: 110%;
          }
        }

        /* =====================================================
           FORM HEADER
        ===================================================== */

        .form-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 20px;
        }

        .form-code {
          display: block;

          margin-bottom: 13px;

          color: var(--red);

          font-size: 8px;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .form-top-title {
          margin: 0;

          font-size: 30px;
          line-height: 1.1;

          letter-spacing: -1.2px;
        }

        .form-live {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 7px 10px;

          border-radius: 100px;

          border: 1px solid rgba(0,0,0,.07);

          color: #777;

          font-size: 8px;
          letter-spacing: 1px;
        }

        .form-live span {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #30a956;

          animation:
            statusPulse 1.7s infinite;
        }

        .form-top-text {
          max-width: 480px;

          margin: 17px 0 38px;

          color: #7b7b7b;

          font-size: 13px;
          line-height: 1.7;
        }

        /* =====================================================
           FORM ROW
        ===================================================== */

        .form-row {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 24px;

          margin-bottom: 25px;
        }

        .contact-field {
          position: relative;
        }

        .contact-field label {
          display: block;

          margin-bottom: 9px;

          color: #8b8b8b;

          font-size: 8px;
          font-weight: 700;

          letter-spacing: 1.5px;
        }

        .input-wrap {
          position: relative;
        }

        .contact-field input,
        .contact-field select,
        .contact-field textarea {
          width: 100%;

          border: none;
          outline: none;

          border-bottom:
            1px solid #d9d9d9;

          background: transparent;

          padding: 11px 0;

          color: #1b1b1b;

          font-size: 13px;

          border-radius: 0;

          transition:
            border-color .3s ease;
        }

        .contact-field textarea {
          resize: vertical;
          min-height: 105px;
        }

        .contact-field input::placeholder,
        .contact-field textarea::placeholder {
          color: #aaa;
        }

        .contact-field select {
          color: #999;
          cursor: pointer;
        }

        .contact-field input:focus,
        .contact-field select:focus,
        .contact-field textarea:focus {
          border-color: transparent;
        }

        /* Animated red line */
        .input-line {
          position: absolute;

          left: 0;
          bottom: 0;

          width: 0;
          height: 1px;

          background: var(--red);

          transition:
            width .55s cubic-bezier(.16,1,.3,1);
        }

        .contact-field input:focus ~ .input-line,
        .contact-field select:focus ~ .input-line,
        .contact-field textarea:focus ~ .input-line {
          width: 100%;
        }

        .message-field {
          margin-top: 2px;
          margin-bottom: 30px;
        }

        /* =====================================================
           BUTTON
        ===================================================== */

        .contact-submit {
          position: relative;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: space-between;

          width: 100%;

          min-height: 58px;

          padding: 5px 6px 5px 22px;

          border: none;
          border-radius: 100px;

          background: #151515;

          color: white;

          cursor: pointer;

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.7px;

          transition:
            transform .35s ease,
            box-shadow .35s ease;
        }

        .contact-submit:hover {
          transform: translateY(-3px);

          box-shadow:
            0 15px 35px rgba(0,0,0,.18);
        }

        .button-text {
          position: relative;
          z-index: 3;
        }

        .button-arrow {
          position: relative;
          z-index: 3;

          display: grid;
          place-items: center;

          width: 47px;
          height: 47px;

          border-radius: 50%;

          background: var(--red);

          transition:
            transform .4s cubic-bezier(.16,1,.3,1);
        }

        .contact-submit:hover .button-arrow {
          transform:
            rotate(-45deg)
            scale(1.06);
        }

        .button-energy {
          position: absolute;

          top: 0;
          left: -100%;

          width: 80px;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.18),
              transparent
            );

          transform: skewX(-20deg);

          animation:
            buttonEnergy 4s ease-in-out infinite;
        }

        @keyframes buttonEnergy {
          0%, 35% {
            left: -100%;
          }

          65%, 100% {
            left: 120%;
          }
        }

        /* =====================================================
           FORM FOOTER
        ===================================================== */

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 20px;

          font-size: 7px;
          letter-spacing: 1.5px;

          color: #aaa;
        }

        .form-footer span:last-child {
          color: #48a15c;
        }

        /* =====================================================
           BOTTOM SIGNATURE
        ===================================================== */

        .contact-bottom-line {
          display: flex;
          align-items: center;
          gap: 20px;

          margin-top: 70px;

          color: #aaa;

          font-size: 8px;
          font-weight: 700;

          letter-spacing: 2px;
        }

        .signature-line {
          position: relative;

          flex: 1;

          height: 1px;

          background: #ddd;

          overflow: hidden;
        }

        .signature-line span {
          position: absolute;

          width: 80px;
          height: 1px;

          background: var(--red);

          animation:
            signatureMove 5s linear infinite;
        }

        @keyframes signatureMove {
          from {
            transform: translateX(-100px);
          }

          to {
            transform: translateX(100vw);
          }
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {

          #contact-section.premium-contact {
            padding: 90px 0 60px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-info-card {
            min-height: auto;
          }

          .contact-form-card {
            padding: 35px 25px;
          }

        }

        @media (max-width: 600px) {

          .contact-container {
            width: 90%;
          }

          .contact-heading {
            font-size: 47px;
            letter-spacing: -2.5px;
          }

          .contact-description {
            font-size: 14px;
          }

          .contact-info-card {
            padding: 30px 24px;
            border-radius: 24px;
          }

          .contact-form-card {
            border-radius: 24px;
            padding: 30px 22px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 22px;
            margin-bottom: 22px;
          }

          .form-card-top {
            align-items: flex-start;
          }

          .form-live {
            display: none;
          }

          .contact-info-title {
            font-size: 36px;
          }

          .contact-bottom-line {
            margin-top: 45px;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }

        }

      `}</style>
    </section>
  );
};

export default Contact;