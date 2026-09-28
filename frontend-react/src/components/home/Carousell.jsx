import { Container, Col, Row, Image } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { useFeaturedPlaces } from "../../contexts/FeaturedPlacesContext";

// Import all carousel images
import pic2 from "../../assets/images/places/pic2.jpg";
import pic3 from "../../assets/images/places/pic3.jpg";
import pic4 from "../../assets/images/places/pic4.jpg";

function Carousell() {
  const { featuredPlaces } = useFeaturedPlaces();

  const carouselItems = featuredPlaces.length > 0
    ? featuredPlaces.map((place, index) => (
        <Carousel.Item key={place.id || index}>
          <Image
            src={place.imageUrl}
            alt={place.name || `carousel-${index}`}
            className="d-block w-100 carousel-image"
            style={{ height: "400px", objectFit: "cover" }}
          />
          {place.name && (
            <Carousel.Caption>
              <h2>{place.name}</h2>
              <p>{place.description || ''}</p>
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))
    : [ // Default static items if no data
        
        {
          id: 2,
          name: "grass",
          description: "where you can rest and breathe the pure air!",
          imageUrl: pic2
        },
        {
          id: 3,
          name: "peak",
          description: "just mountains, looks good with snow!",
          imageUrl: pic3
        },
        {
          id: 4,
          name: "Al-baha",
          description: "wadi AL-baha in AL-baha you can smell the place",
          imageUrl: pic4
        }
      ].map((place, index) => (
        <Carousel.Item key={index}>
          <Image
            src={place.imageUrl}
            alt={place.name || `carousel-${index}`}
            className="d-block w-100 carousel-image"
            style={{ height: "400px", objectFit: "cover" }}
          />
          {place.description && (
            <Carousel.Caption>
              <h2>{place.name}</h2>
              <p>{place.description}</p>
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ));

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col className="p-0">
          <Carousel
            className="w-100"
            style={{
              overflow: "hidden",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "block"
            }}
            interval={3000}
            fade
          >
            {carouselItems}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default Carousell;
