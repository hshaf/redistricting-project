import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { Container } from 'react-bootstrap';
import { DataPaneTabs } from "./DataPane";
import { AppDataContext } from '../context/AppDataContext';
import { AppDataDispatch } from "../context/AppDataContext";
import { AppStateActionType, AppStateContext, AppStateDispatch } from "../context/AppStateContext";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useContext } from 'react';

export default function EnsembleSelection(props) {
  // Contexts
  const appState = useContext(AppStateContext);
  const appStateDispatch = useContext(AppStateDispatch);

  const appData = useContext(AppDataContext);
  const dataAPI = useContext(AppDataDispatch);

  let ensembles = [];
  if (appState.selectedState !== null && appData.selectedStateEnsembles) {
    ensembles = appData.selectedStateEnsembles;
  }

  let ensembleData = ensembles.map((ensemble, idx) => {
    return {
      "INDEX": idx,
      "ENSEMBLE_ID": ensemble['id'],
      "NAME": ensemble["name"],
      "TOTAL_DISTRICT_PLAN_COUNT": ensemble["totalDistrictPlanCount"],
      "TOTAL_CLUSTER_COUNT": ensemble["totalClusterCount"],
      "AVG_OPTIMAL_TRANSPORT": ensemble["avgDistances"]["optimalTransport"],
      "AVG_HAMMING": ensemble["avgDistances"]["hamming"],
      "AVG_ENTROPY": ensemble["avgDistances"]["entropy"]
    }
  });

  // Get ensemble-cluster association data from state object
  let associationArray = [];
  if (appState.selectedState !== null || appData.stateData.size !== 0) {
    associationArray = appData.stateData.get(appState.selectedState)['ensembleClusterAssociation'];
  }
  
  let associationData = associationArray.map((ensembleCluster, idx) => {
    return {
      "INDEX": idx,
      "ENSEMBLE_SIZE": ensembleCluster[0],
      "CLUSTER_COUNT": ensembleCluster[1]
    }
  });

  /** 
   * Update the current selected ensemble ID.
   */
  let setSelectedEnsemble = (ensemblesArrayIdx, ensembleId) => {
    // Update selected ensemble ID in AppStateContext
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_ENSEMBLE,
      payload: ensemblesArrayIdx
    });

    dataAPI.getClustersForEnsemble(ensembleId);

    props.updateTab(DataPaneTabs.ENSEMBLE_INFO);
  }

  // Formatters for the ensemble selection table
  const ensembleIdxFormatter = (data, row) => {
    return <a href="#" onClick={() => setSelectedEnsemble(row.INDEX, row.ENSEMBLE_ID)}>{(row.INDEX + 1)}</a>
  }

  // Columns for ensemble selection table
  const ensembleSelectionColumns = [
    { dataField: "INDEX", text: "Ensemble ID", formatter: ensembleIdxFormatter },
    { dataField: "NAME", text: "Ensemble Name" },
    { dataField: "TOTAL_DISTRICT_PLAN_COUNT", text: "District Plan Count" },
    { dataField: "TOTAL_CLUSTER_COUNT", text: "Cluster Count" }
  ];

  // Columns for cluster-ensemble association table
  const associationColumns = [
    { dataField: "ENSEMBLE_SIZE", text: "Ensemble Size" },
    { dataField: "CLUSTER_COUNT", text: "Cluster Count" }
  ];

  // Ensemble selection pagination options
  const ensemblePaginationOptions = {
    sizePerPageList: [
      {text: '5', value: 5},
      {text: '10', value: 10},
      {text: '15', value: 15},
      {text: '20', value: 20},
      {text: 'All', value: ensembleData.length},
    ]
  }

  // Ensemble-cluster association pagination options
  const associationPaginationOptions = {
    sizePerPageList: [
      {text: '6', value: 6}
    ]
  }

  // Custom tooltip for ensemble-cluster association plot
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p style={{ paddingBottom: 0, paddingTop: 8, paddingRight: 8, paddingLeft: 8 }} 
          className="label">{`Cluster Count : ${payload[0].payload.CLUSTER_COUNT}`}</p>
          <p style={{ paddingBottom: 8, paddingTop: 0, paddingRight: 8, paddingLeft: 8 }} 
          className="label">{`Ensemble Size : ${payload[0].payload.ENSEMBLE_SIZE}`}</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Container style={{ height: '80vh' }}>
      <div id='ensemble-cluster-container' style={{ height: '43vh' }}>
        <div id='ensemble-cluster-plot' style={{width: '75%'}}>
          <h4 id='ensemble-cluster-plot-title' >Cluster Count vs. Ensemble Size</h4>
          <ResponsiveContainer width="100%" height={'90%'} >
            <LineChart 
              margin={{
                top: 20,
                right: 10,
                bottom: 10,
                left: 10,
              }}
              data={associationData}
            >
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey={"ENSEMBLE_SIZE"}
                name={"Ensemble Size"}
                label={{ value: "Ensemble Size", offset: -1, position: 'bottom' }} />
              <YAxis 
                type="number"
                name={"Cluster Count"}
                label={{ value: "Cluster Count", offset: -11, angle: -90, position: 'left' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="linear" dataKey="CLUSTER_COUNT" stroke="#268bc9" activeDot={{ r: 8 }} />
            </LineChart >
          </ResponsiveContainer>
        </div>
        <div id='ensemble-cluster-table' style={{width: '25%'}}>
          <BootstrapTable 
            keyField="INDEX"
            data={associationData}
            columns={associationColumns}
            pagination={paginationFactory(associationPaginationOptions)}
            striped={true}
          />
        </div>
      </div>
      <h4>Select Ensemble</h4>
      <BootstrapTable 
        keyField="INDEX"
        data={ensembleData}
        columns={ensembleSelectionColumns}
        pagination={paginationFactory(ensemblePaginationOptions)}
        striped={true}
      />
    </Container>
  );
}
