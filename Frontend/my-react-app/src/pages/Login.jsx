import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token already exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, redirect to the dashboard or a protected route
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await axios.post('http://localhost:3360/login', {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      alert('Login successful!');
      console.log('JWT Token:', response.data.token);

      // Redirect to this route
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className='LoginWrapper'>
      <div className='LoginWaves'></div>
      <div className="Login">
        <div className="Login-container">
          <div className="tabs">
            <button className="tab active">Login</button>
            <button className="tab">Sign up</button>
          </div>
          <form onSubmit={handleSubmit} className="Login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className='emailInput'
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className='passwordInput'
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit">Log in</button>
          </form>
        </div>
      </div>
      <div className='LoginCircle'></div>
    </div>
  );
};

export default Login;
