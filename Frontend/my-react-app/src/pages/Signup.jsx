import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, adminKey } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!email.includes('@digitalnest.org')) {
      alert('Please enter a valid email (@digitalnest.org)');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3360/signup', {
        firstName,
        lastName,
        email,
        password,
        adminKey,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to register');
    }
  };

  const navigate = useNavigate();

  return (
    <div className='SignupWrapper'>
      <div className='Waves'></div>
      <div className="Signup">
      <div className="Signup-container">
        <div className="tabs">
          <button className="tab" onClick={()=>navigate('/login')}>Login</button>
          <button className="tab active">Sign up</button>
        </div>
        <form onSubmit={handleSubmit} className="Signup-form">
          <div className='nameContainer'>
            <input
              className='firstName'
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
            className='lastName'
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>   
          <input
            type="email"
            name="email"
            placeholder="Email"
            className='emailInput'
            value={formData.email}
            onChange={handleChange}
          />
          <div className="passwordContainer">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className='passwordInput'
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              className='confirmPasswordInput'
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <input
            type="password"
            name="adminKey"
            placeholder="Admin Key?"
            className='adminKeyInput'
            value={formData.adminKey}
            onChange={handleChange}
          />
          <button type="submit">Sign up</button>
        </form>
        </div>
      </div>
      <div className='Circle'></div>
    </div> 
  );
};

export default Signup;
