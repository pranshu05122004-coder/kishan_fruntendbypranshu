import aboutImage from "../assets/img/about.jpeg";
import aboutImage2 from "../assets/img/about2.jpg";
function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="row align-items-center g-5">

          <div className="col-lg-5" data-aos="fade-right">
            <div className="astack">

              <div className="aexp">
                <span className="anum">10+</span>
                <small>
                  Years of
                  <br />
                  Industry Experience
                </small>
              </div>

              <div className="amain">
  <img
    src={aboutImage}
    alt="Industrial Automation Components"
  />
</div>

              <div className="asm">
                <img
                  src={aboutImage2}
                  alt="Industrial Sensors and Automation Products"
                />
              </div>

            </div>
          </div>

          <div className="col-lg-7" data-aos="fade-left">

            <span className="slbl">About Industrial Doctor</span>

            <h2 className="stitle text-start">
              Smart Solutions for
              <br />
              <span>Modern Industry</span>
            </h2>

            <div className="sline lft"></div>

            <p className="sdesc mb-4">
              Industrial Doctor provides reliable industrial automation
              components and engineering solutions for businesses across
              manufacturing and industrial sectors. We offer a wide range of
              quality products to support automation, productivity and
              efficient industrial operations.
            </p>

            <div className="mb-4">

              <div className="fti">
                <div className="ftico r">
                  <i className="fas fa-microchip"></i>
                </div>
                <div>
                  <h6>Quality Industrial Components</h6>
                  <p>
                    A wide range of sensors, pneumatic components, linear
                    motion systems, actuators, bearings and other industrial
                    products.
                  </p>
                </div>
              </div>

              <div className="fti">
                <div className="ftico y">
                  <i className="fas fa-cogs"></i>
                </div>
                <div>
                  <h6>Application-Focused Solutions</h6>
                  <p>
                    Helping businesses identify suitable components and
                    solutions based on their specific industrial requirements.
                  </p>
                </div>
              </div>

              <div className="fti">
                <div className="ftico g">
                  <i className="fas fa-headset"></i>
                </div>
                <div>
                  <h6>Reliable Professional Support</h6>
                  <p>
                    Dedicated assistance for product enquiries, selection and
                    industrial component requirements.
                  </p>
                </div>
              </div>

            </div>

            <a href="#products" className="btn-red">
              <i className="fas fa-box-open"></i>
              Explore Our Products
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}

export default About;