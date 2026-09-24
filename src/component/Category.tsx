import "../assets/css/Category.css";

import category1 from "../assets/img/cat1.jfif";
import category2 from "../assets/img/cat2.jfif";
import category3 from "../assets/img/cat3.jfif";
import category4 from "../assets/img/cat4.jfif";
import category5 from "../assets/img/cat5.jfif";
import category6 from "../assets/img/cat6.jfif";

function Category() {
  const categories = [
    {
      filter: "Sensors ",
      image: category1,
      name: "Sensors",
      count: "99++ items",
    },
    {
      filter: "Pneumatics",
      image: category2,
      name: "Pneumatics",
      count: "50++ items",
    },
    {
      filter: "Linear Motion",
      image: category3,
      name: "Linear Motion",
      count: "50++ items",
    },
    {
      filter: "Actuators",
      image: category4,
      name: "Actuators",
      count: "50++ items",
    },
    {
      filter: "Lubrication Systems",
      image: category5,
      name: "Lubrication Systems",
      count: "50++ items",
    },
    {
      filter: "Bearings",
      image: category6,
      name: "Bearings",
      count: "50++ items",
    },
  ];

  return (
    <section id="category">

      <div className="container">

        {/* Section Heading */}
        <div
          className="text-center mb-5"
          data-aos="fade-up"
        >
          <span className="slbl">
            What We Offer
          </span>

          <h2 className="stitle">
            Browse by <span>Category</span>
          </h2>

          <div className="sline"></div>

          <p
            className="sdesc mx-auto"
            style={{ maxWidth: "480px" }}
          >
            From sizzling burgers to exotic world cuisines -
            find your favourite in our menu
          </p>
        </div>

        {/* Categories */}
        <div className="row g-3 justify-content-center">

          {categories.map((category, index) => (

            <div
              className="col-6 col-sm-4 col-md-3 col-lg-2"
              data-aos="zoom-in"
              data-aos-delay={index * 70}
              key={category.filter}
            >

              <div
                className={`catcard ${
                  category.filter === "all" ? "active" : ""
                }`}
                data-filter={category.filter}
              >

                <img
                  className="catimg"
                  src={category.image}
                  alt={category.name}
                />

                <div className="catnm">
                  {category.name}
                </div>

                <div className="catct">
                  {category.count}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Category;