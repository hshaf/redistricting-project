import React from "react";
import { Button, Container, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';

const data02 = [
    { x: 20, y: 60 },
    { x: 40, y: 290},
    { x: 90, y: 90 },
    { x: 98, y: 50 },
    { x: 80, y: 80 },
    { x: 10, y: 22 },
];


class CustomizedDot extends React.Component {
    render() {
        const { cx, cy } = this.props;
        var rad = 5;
        if(this.props.payload['z'] != null) {rad = this.props.payload['z']}
        //console.log(this.props)
        return (
            <Dot style={{ opacity: 0.6 }}
                cx={cx} cy={cy}
                r={rad}
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
                    <Scatter name="District Plan" onClick={() => { console.log("Clicktest") }} data={data02} fill="#d88478" shape={<CustomizedDot />} />
                </ScatterChart>
            </ResponsiveContainer>


            <div style={{minHeight: '30%' }}>
                <Table striped style={{}}>
                    <thead>
                        <tr>
                            
                            <th>Specific Cluster Data 1</th>
                            <th>Specific Cluster Data 2</th>
                            <th>Specific Cluster Data 3</th>
                            <th>Specific Cluster Data 4</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Some map function for the list of dummy data */}
                        <tr>
                            
                            <td>Info1</td>
                            <td>Info2</td>
                            <td>Info3</td>
                            <td>Info4</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Container>


    );
}