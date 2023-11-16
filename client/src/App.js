import './App.css';
import HomeScreen from './components/HomeScreen';
import { AppStateProvider } from "./context/AppStateContext";
import { AppDataProvider } from "./context/AppDataContext";

export default function App() {
  // Render App
  return (
    <AppStateProvider>
      <AppDataProvider>
        <HomeScreen/>
      </AppDataProvider>
    </AppStateProvider>
  );
}
