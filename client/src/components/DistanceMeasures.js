import React, { Component } from "react";

class DistanceMeasures extends Component {
  render () {
    if (!this.props.selectedState) {
      return (
        <div></div>
      );
    }

    return (
      <h1>hello world</h1>
    );
  }
}

export default DistanceMeasures;
