import { useState } from "react";
import './App.css';
import HomeScreen from './components/HomeScreen';
import { AppStateProvider } from "./context/AppStateContext";

export default function App() {
  // Render App
  return (
    <AppStateProvider>
      <HomeScreen/>
    </AppStateProvider>
  );
}
