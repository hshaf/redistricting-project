import React from "react";
import { Button, Container, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';

const data02 = [
    { x: 20, y: 60, z: 24 },
    { x: 40, y: 290, z: 22 },
    { x: 90, y: 90, z: 25 },
    { x: 98, y: 50, z: 21 },
    { x: 80, y: 80, z: 26 },
    { x: 10, y: 22, z: 23 },
];


class CustomizedDot extends React.Component {
    render() {
        const { cx, cy } = this.props;
        //console.log(this.props)
        return (
            <Dot style={{ opacity: 0.6 }}
                cx={cx} cy={cy}
                r={this.props.payload['z']}
                stroke="black"
                strokeWidth={1}
                fill="#d88478" />
        );
    }
};

export default function ClusterAnalysis() {

    return (
        <Container style={{ height: '80vh' }}>
            <ResponsiveContainer width="100%" height={350}>
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 10,
                        bottom: 10,
                        left: 15,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="stature" unit="cm" label={{ value: "Data1", offset: -8, position: 'insideBottomRight' }} />
                    <YAxis type="number" dataKey="y" name="weight" unit="kg" label={{ value: "Data2", offset: -2, angle: -90, position: 'insideBottomLeft' }} />
                    {/* <ZAxis type="number" dataKey="z" scale="linear" range={[0, 500]} name="score" unit="km" /> */}
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Clusters" onClick={() => { console.log("Clicktest") }} data={data02} fill="#d88478" shape={<CustomizedDot />} />
                </ScatterChart>
            </ResponsiveContainer>

        </Container>


    );
}