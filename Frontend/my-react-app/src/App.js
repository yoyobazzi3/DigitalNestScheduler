import './App.css';
import React from 'react';
import HomePage from './pages/HomePage';
import NewProject from './components/NewProject/NewProject';
import Recommendations from './pages/recommendations';
import Interns from './pages/Interns';
import Signup from './pages/Signup';
import ProjectInfoPage from './pages/ProjectInfoPage';
import InternSignup from './pages/InternSignup';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes'; // Import ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={ <ProtectedRoute> <HomePage /> </ProtectedRoute> } />
        <Route path="/new-project" element={ <ProtectedRoute> <NewProject /> </ProtectedRoute> }/>
        <Route path="/recommendations" element={ <ProtectedRoute> <Recommendations /> </ProtectedRoute> }/>
        <Route path="/interns" element={ <ProtectedRoute> <Interns /> </ProtectedRoute> }/>
        <Route path="/project/:projectID" element={ <ProtectedRoute> <ProjectInfoPage /> </ProtectedRoute> }/>
        <Route path="/intern-signup" element={ <ProtectedRoute> <InternSignup /> </ProtectedRoute> }/>
      </Routes>
    </Router>
  );
}

export default App;
