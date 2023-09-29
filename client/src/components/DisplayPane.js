import VisualComponent from "./VisualComponent";
import CustomMap from './CustomMap';

function DisplayPane () {
  return (
    <div id="display-pane">
      <div id="visual-pane">
      <VisualComponent></VisualComponent>
      </div>
      
      <div id="map-pane">
      <CustomMap></CustomMap>
      </div>
    </div>
  );
}

export default DisplayPane;
