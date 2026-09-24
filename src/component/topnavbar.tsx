import "../assets/css/nav.css";

function TopBar() {
  return (
    <div id="topbar">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

          <div className="top-contact d-flex flex-wrap">
            <span>
              <i className="fas fa-phone-alt"></i>
              08048034811
            </span>

            <span>
              <i className="fas fa-envelope"></i>
              industrialdoctor.in
            </span>

            <span>
              <i className="fas fa-map-marker-alt"></i>
              Delhi, 110006
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">

          

            <div className="tsoc">

              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>

              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>


              <a href="#">
                <i className="fab fa-youtube"></i>
              </a>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default TopBar;