import './App.css';
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import NewProject from './components/NewProject/NewProject';
import Recommendations from './pages/recommendations';
import Interns from './pages/Interns';
import Signup from './pages/Signup';
import ProjectInfoPage from './pages/ProjectInfoPage';
import InternSignup from './pages/InternSignup';
import Login from './pages/LogIn';
import PrivateRoute from './components/Authentication/Authentication';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/intern-signup" element={<InternSignup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-project"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <NewProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Recommendations />
            </PrivateRoute>
          }
        />
        <Route
          path="/interns"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Interns />
            </PrivateRoute>
          }
        />
        <Route path="/project/:projectID" element={<ProjectInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
