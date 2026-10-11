import "../assets/css/hero.css";

function MarqueeSection() {
  const items = [
    {
      name: "Sensors",
      icon: "fa-microchip",
    },
    {
      name: "Pneumatics",
      icon: "fa-wind",
    },
    {
      name: "Linear Motion",
      icon: "fa-arrows-left-right",
    },
    {
      name: "Actuators",
      icon: "fa-gears",
    },
    {
      name: "Lubrication Systems",
      icon: "fa-droplet",
    },
    {
      name: "Bearings",
      icon: "fa-circle-notch",
    },
    {
      name: "PU / PVC Strips",
      icon: "fa-layer-group",
    },
    {
      name: "Fittings",
      icon: "fa-link",
    },
  ];

  const renderItems = (set: string) =>
    items.map((item, index) => (
      <div className="mqitem" key={`${set}-${index}`}>
        <span className="mq-icon">
          <i className={`fas ${item.icon}`}></i>
        </span>

        <span className="mq-name">{item.name}</span>

        <span className="mq-dot"></span>
      </div>
    ));

  return (
    <section className="mqsec">
      <div className="mq-top-line">
        <span></span>
        <small>INDUSTRIAL SOLUTIONS</small>
        <span></span>
      </div>

      <div className="mq-wrapper">
        <div className="mqtrack">
          {renderItems("first")}
          {renderItems("second")}
        </div>
      </div>

      <div className="mq-bottom-line">
        <span className="mq-status-dot"></span>

        <small>
          PRECISION • PERFORMANCE • RELIABILITY
        </small>

        <span className="mq-status">
          <i className="fas fa-circle"></i>
          LIVE
        </span>
      </div>
    </section>
  );
}

export default MarqueeSection;