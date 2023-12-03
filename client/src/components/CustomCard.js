import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button } from 'react-bootstrap';
import { DataPaneTabs } from './DataPane';
import { useContext } from 'react';
import { AppStateDispatch } from '../context/AppStateContext';
import { AppStateActionType } from '../context/AppStateContext';
import { AppDataDispatch } from '../context/AppDataContext';

const listgroupvariant = "light";
export const customcardwidth = '25vh';

const customcardstyle = {
  maxWidth: customcardwidth,
  backgroundColor:'#45a7ed'
};

function CustomCard(props) {
  // Context
  const appStateDispatch = useContext(AppStateDispatch);
  const dataAPI = useContext(AppDataDispatch);

  /** 
   * Update the current selected ensemble ID.
   */
  let handleBtnOnClick = () => {
    // Update selected ensemble ID in AppStateContext
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_ENSEMBLE,
      payload: props.ensemblesArrayIdx
    });

    dataAPI.getClustersForEnsemble(props.ensembleId);

    props.updateTab(DataPaneTabs.ENSEMBLE_INFO);
  }

  return (
    <Card 
    className="text-center" 
    style={customcardstyle}
    text="light"
    border="dark"
    >
      <Card.Body>
        <Card.Title>{props.ensembleName}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item variant={listgroupvariant}>Cluster Count: {props.clusterCount}</ListGroup.Item>
        <ListGroup.Item variant={listgroupvariant}>District Count: {props.districtPlanCount}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Button onClick={handleBtnOnClick} variant="light">Select</Button>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;