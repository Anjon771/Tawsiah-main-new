import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MetroBio from '../assets/images/places/MetroBio.jpg';
import IceMountain from '../assets/images/places/IceMountain.jpg';
import MapBio from '../assets/images/places/MapBio.jpg';

export default function Bio() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isNextHovered, setIsNextHovered] = useState(false);
  const [isSkipHovered, setIsSkipHovered] = useState(false);

  const slides = [
    {
      title: 'Explore Saudi',
      description: 'Discover hidden gems and popular destinations across Saudi Arabia',
      image: MetroBio
    },
    {
      title: 'Discover Nature',
      description: 'Experience breathtaking landscapes from lush forests to stunning deserts',
      image: IceMountain
    },
    {
      title: 'Plan Your Trip',
      description: 'Get personalized recommendations and create unforgettable memories',
      image: MapBio
    }
  ];

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      navigate('/interests');
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    navigate('/interests');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-5)',
        background: 'var(--color-background)',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '2px solid var(--color-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                minHeight: '450px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: index === currentSlide ? 'var(--color-primary)' : 'var(--color-border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'background-color var(--transition-base)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <Row style={{ flex: 1 }}>
                <Col md={5} className="d-flex align-items-center">
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                    }}
                  />
                </Col>

                <Col md={7} className="d-flex flex-column justify-content-center">
                  <h2
                    style={{
                      color: 'var(--color-primary-dark)',
                      marginBottom: 'var(--space-3)',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    {slides[currentSlide].title}
                  </h2>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-md)',
                      lineHeight: 'var(--line-height-relaxed)',
                    }}
                  >
                    {slides[currentSlide].description}
                  </p>
                </Col>
              </Row>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'var(--space-5)',
                }}
              >
                <Button
                  variant="link"
                  onClick={handleSkip}
                  onMouseEnter={() => setIsSkipHovered(true)}
                  onMouseLeave={() => setIsSkipHovered(false)}
                  style={{
                    color: isSkipHovered ? 'var(--color-primary-dark)' : 'var(--color-primary)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-base)',
                    padding: '10px 20px',
                    transition: 'color var(--transition-fast)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  Skip
                </Button>

                <Button
                  onClick={handleNext}
                  onMouseEnter={() => setIsNextHovered(true)}
                  onMouseLeave={() => setIsNextHovered(false)}
                  style={{
                    backgroundColor: isNextHovered ? 'var(--color-primary-dark)' : 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: '#fff',
                    padding: '10px 40px',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background-color var(--transition-fast)',
                  }}
                >
                  {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
