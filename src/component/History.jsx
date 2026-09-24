function History() {
  return (
    <section id="history">
      <div className="container">

        {/* Heading */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="slbl">Our Expertise</span>

          <h2 className="stitle">
            Complete <span>Industrial Solutions</span>
          </h2>

          <div className="sline"></div>

          <p
            className="sdesc mx-auto"
            style={{ maxWidth: "520px" }}
          >
            Reliable automation components and industrial solutions designed
            to support modern manufacturing and improve operational efficiency.
          </p>
        </div>

        {/* Timeline */}
        <div className="timeline" data-aos="fade-up">

          {/* 01 */}
          <div className="tli">

            <div className="tl-left">
              <div className="tlyear">01</div>
              <h5>Sensors &amp; Automation</h5>
              <p>
                Industrial sensors and automation components for accurate
                detection, monitoring and control across manufacturing
                applications.
              </p>
            </div>

            <div className="tl-center">
              <div className="tldot"></div>
            </div>

            <div className="tl-right">
              <div className="tlyear">01</div>
              <h5>Sensors &amp; Automation</h5>
              <p>
                Smart sensing and automation products from leading industrial
                brands to support reliable and efficient operations.
              </p>
            </div>

          </div>

          {/* 02 */}
          <div className="tli">

            <div className="tl-left">
              <div className="tlyear">02</div>
              <h5>Pneumatic Solutions</h5>
              <p>
                Pneumatic valves, cylinders, fittings and air-control
                components suitable for a wide range of industrial
                automation requirements.
              </p>
            </div>

            <div className="tl-center">
              <div className="tldot"></div>
            </div>

            <div className="tl-right">
              <div className="tlyear">02</div>
              <h5>Pneumatic Solutions</h5>
              <p>
                Quality pneumatic components sourced from established brands
                to help industries build dependable automation systems.
              </p>
            </div>

          </div>

          {/* 03 */}
          <div className="tli">

            <div className="tl-left">
              <div className="tlyear">03</div>
              <h5>Linear Motion &amp; Actuators</h5>
              <p>
                Linear motion products, actuators and motion-control
                components designed for precise and efficient industrial
                movement.
              </p>
            </div>

            <div className="tl-center">
              <div className="tldot"></div>
            </div>

            <div className="tl-right">
              <div className="tlyear">03</div>
              <h5>Linear Motion &amp; Actuators</h5>
              <p>
                Solutions covering linear motion systems and electric
                actuators for demanding industrial applications.
              </p>
            </div>

          </div>

          {/* 04 */}
          <div className="tli">

            <div className="tl-left">
              <div className="tlyear">04</div>
              <h5>Bearings &amp; Lubrication</h5>
              <p>
                Industrial bearings and lubrication systems that support
                smooth operation, equipment reliability and reduced
                maintenance requirements.
              </p>
            </div>

            <div className="tl-center">
              <div className="tldot"></div>
            </div>

            <div className="tl-right">
              <div className="tlyear">04</div>
              <h5>Bearings &amp; Lubrication</h5>
              <p>
                Bearing and lubrication solutions from established industrial
                brands for a wide range of machinery and applications.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default History;