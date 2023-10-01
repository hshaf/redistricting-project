import { Button, Container, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import React, { Component } from "react";
import CustomizedDot from "./CustomizeDot";

class EnsembleOverview extends Component {
  data01 = [
    { x: 100, y: 200, z: 10 },
    { x: 120, y: 100, z: 50 },
    { x: 170, y: 300, z: 50 },
    { x: 140, y: 250, z: 70 },
    { x: 150, y: 400, z: 10 },
    { x: 110, y: 280, z: 40 },
  ];

  render () {
    return (
      <Container style={{ height: '80vh' }}>
        <ResponsiveContainer width="100%" height={'50%'}>
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
            <Scatter name="Clusters" onClick={() => { console.log("Clicktest") }} data={this.data01} fill="#8884d8" shape={<CustomizedDot />} />
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ overflowY: 'auto', minHeight: '30%' }}>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th>ID</th>
                <th>General Cluster Data 1</th>
                <th>General Cluster Data 2</th>
                <th>General Cluster Data 3</th>
                <th>General Cluster Data 4</th>
              </tr>
            </thead>
            <tbody>
              {/* Some map function for the list of dummy data */}
              <tr>
                <td><Button variant="link">1</Button></td>
                <td>Info1</td>
                <td>Info2</td>
                <td>Info3</td>
                <td>Info4</td>
              </tr>
              <tr>
                <td><Button variant="link">2</Button></td>
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
}

export default EnsembleOverview;
