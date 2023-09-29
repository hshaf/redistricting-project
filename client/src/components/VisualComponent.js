import "react-bootstrap"
import { Container, Tab, Tabs } from "react-bootstrap";
import EnsembleOverview from "./EnsembleOverview";
import ClusterAnalysis from "./ClusterAnalysis";
import DistanceMeasures from "./DistanceMeasures";





export default function VisualComponent() {
    return (


        <Container>

            <Tabs
                defaultActiveKey="home"
                id="VisualComponentTabs"
                className="mb-3"
                fill
            >
                <Tab eventKey="ensemble" title="Ensemble Info">
                    <EnsembleOverview />
                </Tab>
                <Tab eventKey="cluster" title="Cluster Analysis">
                    <ClusterAnalysis/>
                </Tab>
                <Tab eventKey="other" title="Distance Measures">
                    <DistanceMeasures/>
                </Tab>
            </Tabs>

        </Container>

    );
}