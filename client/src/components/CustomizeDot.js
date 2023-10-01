import React, { Component } from "react";
import { Dot } from 'recharts';

class CustomizedDot extends Component {
    render() {
        const { cx, cy } = this.props;
        var rad = 5;
        if (this.props.payload['z'] != null) { rad = this.props.payload['z'] }
        //console.log(this.props)
        return (
            <Dot style={{ opacity: 0.6 }}
                cx={cx} cy={cy}
                r={rad}
                stroke="black"
                strokeWidth={1}
                fill="#8884d8" />
        );
    }
}

export default CustomizedDot;
