import "../assets/css/hero.css";
import logo from "../assets/img/Gemini_Generated_Image_3nsnv43nsnv43nsn.png";

function Hero() {
  return (
    <section id="hero">

      <div className="hs hs1"></div>
      <div className="hs hs2"></div>

     <div className="hbgtxt"></div>

      <div className="container">
        <div
          className="row align-items-center g-5"
          style={{ minHeight: "88vh" }}
        >

          {/* LEFT CONTENT */}
          <div className="col-lg-6">

            {/* Badge */}
            <div className="hbadge">
              <div className="hbi">
                <i className="fas fa-star"></i>
              </div>

              <span>
               Trusted Industrial Automation Partner
              </span>
            </div>

            {/* Heading */}
            <h1 className="htitle">
              Smart Automation<span className="hl">Solutions</span>
              <br />
              for Every Industry
            </h1>
            {/* Description */}
            <p className="hdesc">
            Reliable industrial automation products and components designed to improve efficiency, precision, and performance.
            </p>

            {/* Buttons */}
            <div className="d-flex flex-wrap gap-3 mb-2">

              <a href="#menu" className="btn-red">
                
                Explore Products
              </a>

              {/* Watch Story */}
              <a
                href="https://www.youtube.com/watch?v=RXv_uIN6e-Y"
                className="magnific_popup btn-play popup-youtube"
              >
                <div className="pico">
                  <i className="fas fa-play"></i>
                </div>

                <span>Watch Our Story</span>
              </a>

            </div>

            {/* Statistics */}
            <div className="hstats d-flex gap-3 flex-wrap mt-4">

              <div className="hstat">
                <span className="snum">
                  5000<em>+</em>
                </span>
                <small>Happy Customers</small>
              </div>

              <div className="sdiv"></div>

              <div className="hstat">
                <span className="snum">
                  1500<em>+</em>
                </span>
                <small>Products</small>
              </div>

              <div className="sdiv"></div>

              <div className="hstat">
                <span className="snum">
                  7<em>yr</em>
                </span>
                <small>Experience</small>
              </div>

              <div className="sdiv"></div>


            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-6">

            <div
              style={{
                position: "relative",
                textAlign: "center",
              }}
            >

              {/* Main Circle Image */}
              <div className="hcircle">
  <img
    src={logo}
    alt="logo"
  />
</div>

              {/* Hot Deal Card */}
              <div className="fcard fc1">

                <div className="fcoi r">
                  <i className="fas fa-fire"></i>
                </div>

                <div>
                  <span className="fcnum">
                    Hot Deal
                  </span>

                  <span className="fcsm">
                    30% off today
                  </span>
                </div>

              </div>

              {/* Rating Card */}
              <div className="fcard fc2">

                <div className="fcoi y">
                  <i className="fas fa-star"></i>
                </div>

                <div>
                  <span className="fcnum">
                    4.9/5
                  </span>

                  <span className="fcsm">
                    2k+ reviews
                  </span>
                </div>

              </div>

              {/* Delivery Card */}
              <div className="fcard fc3">

                <div className="fcoi g">
                  <i className="fas fa-clock"></i>
                </div>

                <div>
                  <span className="fcnum">
                     
                  </span>

                  <span className="fcsm">
                    Fast delivery
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Hero;