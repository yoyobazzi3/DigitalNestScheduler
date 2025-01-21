import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../assets/Logo.png';
import './InternSignup.css';

const InternSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    DepartmentID: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword, DepartmentID, location } = formData;

    // Frontend validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !DepartmentID || !location) {
      alert('All fields are required');
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

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3360/internSignUp', {
        firstName,
        lastName,
        email,
        password,
        DepartmentID,
        location,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to register');
    }
  };

  return (
    <div className='internSignupWrapper'>
      <div className="internWaves"/>
      <form onSubmit={handleSubmit} className="Intern-signup-form">
        <div className="internLogoSignUp">
          <h1>Bizznest Flow</h1>
          <img src={Logo} alt='Logo' className='internSignupLogo'/>
        </div>
        <h2 className='internSignupTitle'>Intern Signup</h2>
        <div className="internNameContainer">
          <input
            className='internFirstName'
            type="text"
            placeholder="Enter your first name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className='internLastName'
            type="text"
            placeholder="Enter your last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <input
          className='internEmail'
          type="email"
          placeholder="Enter your email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="internPasswordContainer">
          <input
            className='internPassword'
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className='internConfirmPassword'
            type="password"
            placeholder="Re-enter your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <select name="DepartmentID" value={formData.DepartmentID} onChange={handleChange}>
          <option value="">Select a department</option>
          <option value="0">Web Development</option>
          <option value="1">Design</option>
          <option value="2">Video</option>
        </select>
        <select name="location" value={formData.location} onChange={handleChange}>
          <option value="">Select a location</option>
          <option value="Salinas">Salinas</option>
          <option value="Gilroy">Gilroy</option>
          <option value="Watsonville">Watsonville</option>
          <option value="Stockton">Stockton</option>
          <option value="Modesto">Modesto</option>
        </select>
        <button className='internSignupBttn' type="submit" >Signup</button>
      </form>
      <div className='internCircle'/>
    </div>
  );
};

export default InternSignup;