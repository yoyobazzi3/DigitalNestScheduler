import './App.css';
import React from 'react';
import HomePage from './pages/HomePage';
import NewProject from './components/NewProject/NewProject';
import Recommendations from './pages/recommendations';
import Interns from './pages/Interns';
import Signup from './pages/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/interns" element={<Interns />} />
        <Route path="/Signup" element={<Signup />} />


      </Routes>
    </Router>
  );
}

export default App;
