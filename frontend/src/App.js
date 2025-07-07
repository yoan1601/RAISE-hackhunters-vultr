// src/App.js

import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MainApp from './MainApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<MainApp />} />
    </Routes>
  );
}

export default App;
