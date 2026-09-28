import { Container, Col, Card, Button } from "react-bootstrap";
import { GoStarFill } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

function PlaceCard({ place }) {



  if (!place) return "Loading...";

  return (
    <>
      <Container>
        <Col>
          <Card className="place-card" style={{ width: "300px", overflow: "hidden" }}>
            <Card.Img className="place-card" src={place.imageUrl || "https://placehold.co/400x300"} alt={place.name} style={{ height: "180px", objectFit: "cover" }} />
            <Card.Body className="place-card-body">
              <Card.Title className="mt-3 p-1 my-0 place-card-title" style={{ fontSize: "1rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{place.name}</Card.Title>
              <Card.Text className="p-1 place-card-description" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{place.description}</Card.Text>

              <Card.Text className="d-flex align-items-center gap-2">
                <div>
                  <FaLocationDot /> {place.city}
                </div>
                <div>
                  <GoStarFill color="gold"/> {place.rate}
                </div>
                <div>
                  {place.categorie}
                </div>
              </Card.Text>

              <Button as={Link} to={`/place/${place.id}`} variant="success" className="m-2" > View details </Button>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </>
  );
}

export default PlaceCard;