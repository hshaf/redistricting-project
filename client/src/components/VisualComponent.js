import "react-bootstrap"
import { Container, Tab, Tabs } from "react-bootstrap";

function VisualComponent() {
    return (


        <Container>

            <Tabs
                defaultActiveKey="home"
                id="VisualComponentTabs"
                className="mb-3"
                fill
            >
                <Tab eventKey="general" title="General Info">
                    Tab content for General selection info
                </Tab>
                <Tab eventKey="cluster" title="Cluster">
                    Tab content for Cluster Analysis
                </Tab>
                <Tab eventKey="other" title="Other">
                    Tab content for other
                </Tab>
            </Tabs>

        </Container>

    );
}

export default VisualComponent