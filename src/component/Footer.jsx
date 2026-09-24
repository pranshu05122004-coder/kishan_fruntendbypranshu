function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer>
        <div className="container">
          <div className="row g-5">

            {/* About */}
            <div className="col-lg-4">
              <div className="fnm">
                Industrial <span>Doctor</span>
              </div>

              <p className="fdesc">
                Your trusted partner for industrial automation solutions,
                sensors, control systems and reliable industrial components.
                We help businesses improve efficiency, accuracy and
                performance.
              </p>

              <div className="fsoc">
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>

                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>

                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>

                <a href="#" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-sm-6 col-lg-2">
              <div className="ftit">Quick Links</div>

              <ul className="flinks ps-0">
                <li>
                  <a href="#hero">
                    <i className="fas fa-chevron-right"></i>
                    Home
                  </a>
                </li>

                <li>
                  <a href="#about">
                    <i className="fas fa-chevron-right"></i>
                    About Us
                  </a>
                </li>

                <li>
                  <a href="#products">
                    <i className="fas fa-chevron-right"></i>
                    Products
                  </a>
                </li>

                <li>
                  <a href="#blog">
                    <i className="fas fa-chevron-right"></i>
                    Blog
                  </a>
                </li>

                <li>
                  <a href="#reviews">
                    <i className="fas fa-chevron-right"></i>
                    Reviews
                  </a>
                </li>

                <li>
                  <a href="#contact-section">
                    <i className="fas fa-chevron-right"></i>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div className="col-sm-6 col-lg-2">
              <div className="ftit">Our Products</div>

              <ul className="flinks ps-0">
                <li>
                  <a href="#products">
                    <i className="fas fa-chevron-right"></i>
                    Sensors
                  </a>
                </li>

                <li>
                  <a href="#products">
                    <i className="fas fa-chevron-right"></i>
                    Automation
                  </a>
                </li>

                <li>
                  <a href="#products">
                    <i className="fas fa-chevron-right"></i>
                    Controllers
                  </a>
                </li>

                <li>
                  <a href="#products">
                    <i className="fas fa-chevron-right"></i>
                    Industrial Components
                  </a>
                </li>

                <li>
                  <a href="#products">
                    <i className="fas fa-chevron-right"></i>
                    Safety Products
                  </a>
                </li>

                <li>
                  <a href="#products">
                    <i className="fas fa-chevron-right"></i>
                    Automation Solutions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-lg-4">
              <div className="ftit">Get In Touch</div>

              <div className="fci">
                <div className="fciico">
                  <i className="fas fa-map-marker-alt"></i>
                </div>

                <div className="fciinfo">
                  <strong>Address</strong>
                  Mumbai, Maharashtra, India
                </div>
              </div>

              <div className="fci">
                <div className="fciico">
                  <i className="fas fa-phone-alt"></i>
                </div>

                <div className="fciinfo">
                  <strong>Phone</strong>
                  +91 XXXXX XXXXX
                </div>
              </div>

              <div className="fci">
                <div className="fciico">
                  <i className="fas fa-envelope"></i>
                </div>

                <div className="fciinfo">
                  <strong>Email</strong>
                  info@industrialdoctor.in
                </div>
              </div>

              <div className="fci">
                <div className="fciico">
                  <i className="fas fa-clock"></i>
                </div>

                <div className="fciinfo">
                  <strong>Business Hours</strong>
                  Mon - Sat: 09 AM - 07 PM
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="fbot">
          <div className="container">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

              <p>
                &copy; 2026{" "}
                <span>Industrial Doctor</span>. All Rights Reserved.
                <br />
                Industrial Automation Solutions
              </p>

              <div>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms &amp; Conditions</a>
                <a href="#">Cookies</a>
              </div>

            </div>
          </div>
        </div>
      </footer>

      {/* Back To Top */}
      <button id="btt" onClick={scrollToTop}>
        <i className="fas fa-chevron-up"></i>
      </button>
    </>
  );
}

export default Footer;