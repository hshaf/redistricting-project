import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CustomCard from './CustomCard';
import { Container } from 'react-bootstrap';
import { customcardwidth } from './CustomCard';
import { AppDataContext } from '../context/AppDataContext';
import { AppStateContext } from '../context/AppStateContext';
import { useContext } from 'react';

const customcolstyle = {
  maxWidth: customcardwidth
};

export default function EnsembleSelection(props) {
  const appData = useContext(AppDataContext);
  const appState = useContext(AppStateContext);

  let ensembles = [];
  if (appState.selectedState !== "" && appData.selectedStateEnsembles) {
    ensembles = appData.selectedStateEnsembles;
  }

  return (
    <Container style={{ height: '80vh' }}>
      <div id='ensemble-grid-box-container' style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <Row xs={1} md={2} className="g-4">
          {Array.from(ensembles).map((_, idx) => (
            <Col style={customcolstyle} key={idx}>
              <CustomCard 
              ensembleName={ensembles[idx]['name']}
              clusterCount={ensembles[idx]['totalClusterCount']}
              districtPlanCount={ensembles[idx]['totalDistrictCount']}
              />
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}
