import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CustomCard from './CustomCard';
import { Container } from 'react-bootstrap';
import { customcardwidth } from './CustomCard';

const customcolstyle = {
  maxWidth: customcardwidth
};

export default function EnsembleSelection(props) {
  return (
    <Container style={{ height: '80vh' }}>
      <div id='ensemble-grid-box-container' style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <Row xs={1} md={2} className="g-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Col style={customcolstyle} key={idx}>
              <CustomCard />
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}
