import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import testimonial1 from "../assets/img/1.jpg";
import testimonial2 from "../assets/img/1.jpg";
import testimonial3 from "../assets/img/1.jpg";
import testimonial4 from "../assets/img/1.jpg";
import testimonial5 from "../assets/img/1.jpg";
import testimonial6 from "../assets/img/1.jpg";

function Testimonials() {
  const testimonials = [
    {
      image: testimonial1,
      name: "Rajesh Mehta",
      role: "Production Manager",
      text: "Industrial Doctor helped us source the right automation components for our production requirements. The product quality and technical support have been excellent. Highly recommended for industrial automation solutions.",
    },
    {
      image: testimonial2,
      name: "Amit Patel",
      role: "Maintenance Head",
      text: "We regularly source sensors, bearings and pneumatic components through Industrial Doctor. Their product knowledge, response time and support have been very reliable.",
    },
    {
      image: testimonial3,
      name: "Sandeep Kumar",
      role: "Purchase Manager",
      text: "A reliable supplier for industrial automation components. They understood our requirements quickly and provided suitable products within the required timeline.",
    },
    {
      image: testimonial4,
      name: "Vikram Sharma",
      role: "Automation Engineer",
      text: "We needed suitable sensors and automation components for our machinery. Industrial Doctor provided the right solutions and helped us select the products according to our application.",
    },
    {
      image: testimonial5,
      name: "Manoj Verma",
      role: "Plant Maintenance Manager",
      text: "The quality of products and professional support from Industrial Doctor has been very good. Their range of sensors, pneumatic components and bearings makes sourcing much easier for our team.",
    },
    {
      image: testimonial6,
      name: "Ankit Gupta",
      role: "Industrial Procurement",
      text: "Industrial Doctor has been a dependable source for our industrial component requirements. Good product availability, quick communication and helpful assistance throughout the purchasing process.",
    },
  ];

  return (
    <section id="testimonials">
      <div className="container">

        {/* Heading */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="slbl">What Our Clients Say</span>

          <h2 className="stitle">
            Client <span>Feedback</span>
          </h2>

          <div className="sline"></div>
        </div>

        {/* Testimonials Slider */}
        <div data-aos="fade-up">
          <Swiper
            className="tesSwiper"
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 2,
              },
            }}
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>

                <div className="tescard">

                  <div className="tesq">"</div>

                  <div className="tess">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>

                  <p className="testxt">
                    {item.text}
                  </p>

                  <div className="tesauth">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div>
                      <div className="tesnm">
                        {item.name}
                      </div>

                      <div className="tesrl">
                        {item.role}
                      </div>
                    </div>

                  </div>

                </div>

              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}

export default Testimonials;