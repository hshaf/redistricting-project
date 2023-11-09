import React from "react";
import DisplayPane from "./DisplayPane";
import { AppStateProvider } from "../context/AppStateContext";

export default function HomeScreen(props) {
  return (
    <div id="homescreen">
      <AppStateProvider>
        <DisplayPane/>
      </AppStateProvider>
    </div>
  );
}
