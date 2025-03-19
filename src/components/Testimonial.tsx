import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/Testimonial.css';

const testimonials = [
  {
    quote: "Quisque velit massa, imperdiet eget mattis non, dapibus quis eros. In consectetur sodales nisi vel suscipit. Maecenas orci dolor, convallis sit amet malesuada eu, elementum et diam. Cras commodo ex et molestie ornare. Cras semper ante id placerat elementum. Sed aliquet volutpat leo.",
    name: "Jeremy Chris",
    role: "Happy Client",
    image: "/images/client1.jpg"
  },
  {
    quote: "Quisque velit massa, imperdiet eget mattis non, dapibus quis eros. In consectetur sodales nisi vel suscipit. Maecenas orci dolor, convallis sit amet malesuada eu, elementum et diam. Cras commodo ex et molestie ornare. Cras semper ante id placerat elementum. Sed aliquet volutpat leo.",
    name: "Jeremy Chris",
    role: "Happy Client",
    image: "/images/client1.jpg"
  },
  {
    quote: "Quisque velit massa, imperdiet eget mattis non, dapibus quis eros. In consectetur sodales nisi vel suscipit. Maecenas orci dolor, convallis sit amet malesuada eu, elementum et diam. Cras commodo ex et molestie ornare. Cras semper ante id placerat elementum. Sed aliquet volutpat leo.",
    name: "Jeremy Chris",
    role: "Happy Client",
    image: "/images/client1.jpg"
  },
  // Ajoutez d'autres témoignages ici
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <span className="subtitle">Testimonials</span>
          <h2 className="title">What Our Clients Say</h2>
          <p className="description">
            Mauris sem quam, euismod ac nisi vel, sagittis volutpat ipsum. Nulla molestie, 
            lorem ut facilisis dignissim, ante tortor posuere urna.
          </p>
          <p className="description">
            Maecenas mattis interdum varius. Duis feugiat velit quis mi elementum suscipit.
          </p>
        </div>

        <div className="testimonial-slider">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              el: '.testimonial-pagination',
              bulletClass: 'testimonial-bullet',
              bulletActiveClass: 'testimonial-bullet-active'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-content">
                  <div className="testimonial-quote">
                    <div className="quote-mark">"</div>
                    <blockquote>{testimonial.quote}</blockquote>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h3>{testimonial.name}</h3>
                      <span className="author-role">{testimonial.role}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="testimonial-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
