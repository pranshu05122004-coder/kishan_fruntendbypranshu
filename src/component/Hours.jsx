function Hours() {
  return (
    <section id="hours">

      <div className="hrsbg"></div>

      <div
        className="container"
        style={{ position: "relative", zIndex: 2 }}
      >

        {/* Heading */}
        <div className="text-center mb-5" data-aos="fade-up">

          <span
            className="slbl"
            style={{ color: "#a5d6bc" }}
          >
            Industrial Support
          </span>

          <h2
            className="stitle"
            style={{ color: "#fff" }}
          >
            We're Here{" "}
            <span style={{ color: "var(--secondary)" }}>
              To Help
            </span>
          </h2>

          <div className="sline"></div>

        </div>

        {/* Content */}
        <div className="row g-4 align-items-start">

          {/* Our Services */}
          <div
            className="col-lg-5"
            data-aos="fade-right"
          >
            <div className="hrscard">

              {/* Product Sourcing */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-boxes-stacked me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Product Sourcing
                </span>

                <span className="hrstime">
                  Industrial Components
                </span>
              </div>

              {/* Automation */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-microchip me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Automation Solutions
                </span>

                <span className="hrstime">
                  Sensors &amp; Controls
                </span>
              </div>

              {/* Technical Support */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-gears me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Technical Support
                </span>

                <span className="hrstime">
                  Application Assistance
                </span>
              </div>

              {/* Equivalent Products */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-arrows-rotate me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Equivalent Products
                </span>

                <span className="hrstime">
                  Size &amp; Specification
                </span>
              </div>

              {/* Product Supply */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-truck-fast me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Product Supply
                </span>

                <span className="hrstime">
                  Reliable Delivery
                </span>
              </div>

            </div>
          </div>

          {/* Enquiry CTA */}
          <div
            className="col-lg-3"
            data-aos="zoom-in"
          >
            <div className="hrscta">

              <i
                className="fas fa-headset fa-2x mb-3"
                style={{ color: "rgba(255,255,255,.8)" }}
              ></i>

              <h4>Need a Component?</h4>

              <p>
                Tell us your requirement and our team will help you find the
                right industrial solution.
              </p>

              <a href="#contact" className="btnw">
                Send Enquiry →
              </a>

            </div>
          </div>

          {/* Find Us */}
          <div
            className="col-lg-4"
            data-aos="fade-left"
          >
            <div className="hrscard">

              <h5
                style={{
                  color: "#fff",
                  marginBottom: "18px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: ".95rem",
                  fontWeight: 700,
                }}
              >
                <i
                  className="fas fa-map-marker-alt me-2"
                  style={{ color: "var(--secondary)" }}
                ></i>
                Contact Industrial Doctor
              </h5>

              {/* Address */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-location-dot me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Address
                </span>

                <span
                  className="hrstime"
                  style={{ fontSize: ".8rem" }}
                >
                  SBS Colony, Karawal Nagar,
                  <br />
                  Delhi - 110094
                </span>
              </div>

              {/* Phone */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-phone me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Call / WhatsApp
                </span>

                <span
                  className="hrstime"
                  style={{ fontSize: ".8rem" }}
                >
                  8076128812
                </span>
              </div>

              {/* Business */}
              <div className="hrsrow">
                <span className="hrsday">
                  <i
                    className="fas fa-industry me-2"
                    style={{ color: "var(--secondary)" }}
                  ></i>
                  Business
                </span>

                <span
                  className="hrstime"
                  style={{ fontSize: ".8rem" }}
                >
                  Industrial Automation
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hours;