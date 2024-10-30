import React from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Accordion,
  Carousel,
} from "react-bootstrap"; // Importăm componentele necesare din react-bootstrap
import { useNavigate } from "react-router-dom"; // Importăm useNavigate pentru navigarea programatică

function HomePage() {
  let navigate = useNavigate(); // Inițializăm hook-ul useNavigate pentru navigarea programatică

  // Stilul pentru fundalul secțiunii de întâmpinare
  const backgroundStyle = {
    backgroundImage: "url('/imagine2.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Testimoniale ale angajaților
  const testimonials = [
    {
      id: 1,
      quote:
        "Accessing our exclusive corporate gym through the seamless booking portal has truly transformed my daily routine. The luxury of a well-equipped gym right in our office complex is a priceless perk.",
      author: "Samantha Smith, Marketing Analyst",
    },
    {
      id: 2,
      quote:
        "The company's dedicated fitness center is a sanctuary for me. The ability to reserve a workout space means no interruptions and a better focus on health. It's the perfect work-life balance!",
      author: "Mike Johnson, Lead Developer",
    },
    {
      id: 3,
      quote:
        "Our corporate gym and the easy reservation system have been a game-changer. It ensures I can fit exercise into my busy schedule, and I've never felt more energized at work.",
      author: "Emily Brown, HR Specialist",
    },
  ];

  return (
    <>
      {/* Secțiunea de întâmpinare */}
      <section style={backgroundStyle}>
        <Container className="home-page">
          <Row className="align-items-center text-center home-content">
            <Col>
              <h1 className="home-title">Welcome to our platform!</h1>
              <p className="home-text">
                Discover the best fitness centers and start your transformation.
              </p>
              <div className="home-buttons">
                <Button variant="primary" onClick={() => navigate("/signUp")}>
                  Register
                </Button>{" "}
                <Button
                  variant="outline-light"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Secțiunea "Who We Are" */}
      <section className="who-we-are-section">
        <Container>
          <Row>
            <Col md={6} className="text-container">
              <h2>Who We Are</h2>
              <p>
                Welcome to WellnessWork Hub, where we believe in making fitness
                fun and accessible for all our employees. Our meticulously
                designed gyms span various locations, each featuring a wide
                range of modern equipment and amenities that cater to every
                fitness level.
              </p>
              <p>
                From bustling class schedules filled with cutting-edge workouts
                to serene wellness areas for meditation and recovery, we've
                tailored our environments to bolster your fitness journey and
                enrich your day-to-day life.
              </p>
              <p>
                Join our WellnessWork Hub family today and unlock the door to a
                life where staying active and healthy isn't just easy—it's a
                joy. Embrace the full spectrum of wellness opportunities and
                discover the transformative power of a supportive, health-first
                community
              </p>
            </Col>
            <Col md={6} className="image-container">
              <img
                src="/imagine1.jpg"
                alt="Fitness"
                className="who-we-are-image"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Secțiunea "Meet Our Trainers" */}
      <section className="meet-our-trainers-section">
        <Container>
          <h2 className="text-center mb-4">Meet Our Trainers</h2>
          <Row>
            {/* Profilele antrenorilor */}
            <Col className="trainer-profile" xs={12} md={6} lg={3}>
              <div className="trainer-card">
                <img src="/imagine7.jpg" alt="Max" className="trainer-image" />
                <h3>Max</h3>
                <p>Strength Coach</p>
                <p>
                  Max will not only build your strength, he'll also empower you
                  with the confidence to push past your perceived limits.
                </p>
              </div>
            </Col>
            <Col className="trainer-profile" xs={12} md={6} lg={3}>
              <div className="trainer-card">
                <img
                  src="/imagine8.jpg"
                  alt="Stella"
                  className="trainer-image"
                />
                <h3>Stella</h3>
                <p>Wellness Wizard</p>
                <p>
                  Stella specializes in stress-reducing techniques and
                  mindfulness-based strength training.
                </p>
              </div>
            </Col>
            <Col className="trainer-profile" xs={12} md={6} lg={3}>
              <div className="trainer-card">
                <img src="/imagine9.jpg" alt="Liam" className="trainer-image" />
                <h3>Liam</h3>
                <p>Cardio King</p>
                <p>
                  Liam's high-energy cardio classes are legendary. He'll get
                  your heart racing and spirits soaring with his infectious
                  enthusiasm.
                </p>
              </div>
            </Col>
            <Col className="trainer-profile" xs={12} md={6} lg={3}>
              <div className="trainer-card">
                <img
                  src="/imagine10.jpg"
                  alt="Emma"
                  className="trainer-image"
                />
                <h3>Emma</h3>
                <p>Yoga Master</p>
                <p>
                  Emma's approach to yoga blends ancient practices with modern
                  techniques for a truly transformative experience.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Secțiunea "Frequently Asked Questions" */}
      <section className="faq-section">
        <Container>
          <Row>
            <Col>
              <h2>Frequently Asked Questions</h2>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>How do I choose a gym?</Accordion.Header>
                  <Accordion.Body>
                    Simply sign in, explore our gym options, and select the one
                    that suits you best based on location and facilities
                    available.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    Can I reserve multiple time slots?
                  </Accordion.Header>
                  <Accordion.Body>
                    You can reserve one time slot per gym visit to ensure fair
                    access for all employees and maintain gym capacity
                    regulations.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    What if my chosen time slot is full?
                  </Accordion.Header>
                  <Accordion.Body>
                    If your preferred time slot is unavailable due to capacity
                    constraints, we'll help you find an alternative slot that
                    fits your schedule.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    Are there personal trainers available?
                  </Accordion.Header>
                  <Accordion.Body>
                    Yes, we have experienced personal trainers at each gym
                    location ready to assist you in achieving your fitness goals
                    and providing guidance during your workouts.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    Can I bring a guest to the gym?
                  </Accordion.Header>
                  <Accordion.Body>
                    At WellnessWork Hub, we prioritize the safety and comfort of
                    our employees, so guest access to our gyms is currently
                    restricted to employees only. Let's focus on your fitness
                    journey together!
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Secțiunea "Testimonials" */}
      <section className="testimonials-section">
        <Container>
          <h2 className="text-center mb-4">What Our Employees Say</h2>
          <Row className="gx-5">
            {testimonials.map((testimonial) => (
              <Col xs={12} md={4} className="testimonial" key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="testimonial-text">{testimonial.quote}</p>
                  <p className="testimonial-author">{testimonial.author}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Secțiunea "Gallery" */}
      <section className="gallery-section">
        <Container>
          <h2 className="text-center mb-4">Gallery</h2>
          <Carousel>
            <Carousel.Item interval={3000}>
              <img
                className="d-block w-100"
                src="/imagine3.jpg"
                alt="First slide"
              />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <img
                className="d-block w-100"
                src="/imagine4.jpg"
                alt="Second slide"
              />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <img
                className="d-block w-100"
                src="/imagine5.jpg"
                alt="Third slide"
              />
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <img
                className="d-block w-100"
                src="/imagine6.jpg"
                alt="Fourth slide"
              />
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      {/* Secțiunea "Contact" */}
      <section className="contact-section">
        <Container>
          <Row>
            <Col className="text-center">
              <h2>Get in Touch</h2>
              <p>
                Have questions or want to learn more about our fitness hub?
                Reach out to us!
              </p>
              <div className="contact-details">
                <p>
                  <strong>Email:</strong> contact@wellnessworkhub.com
                </p>
                <p>
                  <strong>Phone:</strong> +123 456 7890
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default HomePage; // Exportăm componenta HomePage
