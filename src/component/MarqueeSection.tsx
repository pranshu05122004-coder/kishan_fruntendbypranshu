import "../assets/css/hero.css";

function MarqueeSection() {
  const items = [
    "Sensors",
    "Pneumatics",
    "Linear Motion",
    "Actuators",
    "Lubrication Systems Bearings",
    "PU/PVC Strips & Fittings",
  ];

  return (
    <div className="mqsec">
      <div className="mqtrack">

        {/* First Set */}
        {items.map((item, index) => (
          <div className="mqitem" key={`first-${index}`}>
            <i className="fas fa-circle"></i>
            {item}
          </div>
        ))}

        {/* Duplicate Set for Continuous Marquee */}
        {items.map((item, index) => (
          <div className="mqitem" key={`second-${index}`}>
            <i className="fas fa-circle"></i>
            {item}
          </div>
        ))}

      </div>
    </div>
  );
}

export default MarqueeSection;