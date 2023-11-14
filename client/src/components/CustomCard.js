import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button } from 'react-bootstrap';

const listgroupvariant = "primary";
export const customcardwidth = '15rem';

const customcardstyle = {
  maxWidth: customcardwidth
};

function CustomCard(props) {
  return (
    <Card 
    className="text-center" 
    style={customcardstyle}
    bg="secondary"
    text="light"
    // border="primary"
    >
      <Card.Body>
        <Card.Title>{props.ensembleName}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item variant={listgroupvariant}>Cluster Count: {props.clusterCount}</ListGroup.Item>
        <ListGroup.Item variant={listgroupvariant}>District Count: {props.districtPlanCount}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Button variant="primary">Select</Button>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;