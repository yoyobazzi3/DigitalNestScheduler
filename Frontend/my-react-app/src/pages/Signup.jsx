import React, { useState } from 'react';
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
    csrfToken: '', // CSRF token for protection
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:3360/csrf-token', { withCredentials: true });
      setFormData((prev) => ({ ...prev, csrfToken: response.data.csrfToken }));
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, adminKey, csrfToken } = formData;

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

    if (!adminKey) {
      alert('Admin key is required to create an admin account');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3360/signup',
        { firstName, lastName, email, password, adminKey, csrfToken },
        { withCredentials: true }
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Failed to register');
    }
  };

  React.useEffect(() => {
    fetchCsrfToken(); // Fetch CSRF token when the component mounts
  }, []);

  return (
    <div className='SignupWrapper'>
      <div className='Waves'></div>
      <div className="Signup">
      <div className="Signup-container">
        <div className="tabs">
          <button className="tab active">Login</button>
          <button className="tab">Sign up</button>
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
            value={formData.email}
            onChange={handleChange}
          />
          <div className="passwordContainer">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <input
            type="password"
            name="adminKey"
            placeholder="Admin Key?"
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