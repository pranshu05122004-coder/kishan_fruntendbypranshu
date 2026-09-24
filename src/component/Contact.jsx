function Contact() {
  return (
    <section id="contact-section">
      <div className="container">

        {/* Heading */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="slbl">Let's Connect</span>

          <h2 className="stitle">
            Talk to <span>Our Team</span>
          </h2>

          <div className="sline"></div>

          <p
            className="sdesc mx-auto"
            style={{ maxWidth: "520px" }}
          >
            Have a product enquiry or need help finding the right industrial
            automation component? Our team is here to assist you.
          </p>
        </div>

        {/* Contact Content */}
        <div className="row g-4">

          {/* Contact Information */}
          <div
            className="col-lg-4"
            data-aos="fade-right"
          >
            <div className="ctdark">

              <h4>Let's Talk</h4>

              <p className="ctsub">
                Need a quotation, product information or technical assistance?
                Get in touch with our team and we'll be happy to help.
              </p>

              {/* Address */}
              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>

                <div className="ctinfo">
                  <strong>Address</strong>

                  <span>
                    SBS Colony, Karawal Nagar,
                    <br />
                    Delhi - 110094
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-phone-alt"></i>
                </div>

                <div className="ctinfo">
                  <strong>Phone</strong>

                  <span>8076128812</span>
                </div>
              </div>

              {/* Email */}
              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-envelope"></i>
                </div>

                <div className="ctinfo">
                  <strong>Email</strong>

                  <span>Contact us for enquiries</span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-clock"></i>
                </div>

                <div className="ctinfo">
                  <strong>Working Hours</strong>

                  <span>Mon - Sat: 9 AM - 7 PM</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="ctsocrow">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>

                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>

                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>

                <a href="#">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div
            className="col-lg-8"
            data-aos="fade-left"
          >
            <div className="fcard">

              <div className="row g-3">

                {/* Name */}
                <div className="col-sm-6">
                  <label className="flbl">
                    Your Name *
                  </label>

                  <input
                    type="text"
                    className="fctrl"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="col-sm-6">
                  <label className="flbl">
                    Email Address *
                  </label>

                  <input
                    type="email"
                    className="fctrl"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div className="col-sm-6">
                  <label className="flbl">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    className="fctrl"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Subject */}
                <div className="col-sm-6">
                  <label className="flbl">
                    Subject *
                  </label>

                  <select className="fctrl">
                    <option>Product Enquiry</option>
                    <option>Get a Quotation</option>
                    <option>Technical Support</option>
                    <option>Bulk Order</option>
                    <option>Product Availability</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="col-12">
                  <label className="flbl">
                    Message *
                  </label>

                  <textarea
                    className="fctrl"
                    rows="5"
                    placeholder="Tell us about your product or automation requirement..."
                  ></textarea>
                </div>

                {/* Button */}
                <div className="col-12">
                  <button
                    className="btn-red"
                    id="ctcBtn"
                    type="button"
                  >
                    <i className="fas fa-paper-plane"></i>
                    Send Enquiry
                  </button>
                </div>

              </div>

              {/* Success Message */}
              <div className="sucmsg" id="ctcOk">
                <i className="fas fa-check-circle"></i>

                <p>
                  Your enquiry has been received! Our team will get back to
                  you shortly.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Contact;