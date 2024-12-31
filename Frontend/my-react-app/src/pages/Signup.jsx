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
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
        const response = await axios.post('http://localhost:5000/signup', {      
        firstName,
        lastName,
        email,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to register');
    }
  };

  return (
    <div className='Signup'>
      <form onSubmit={handleSubmit} className='Signup-form'>
        <h1>Signup</h1>
        <label>First Name</label>
        <input
          className='input'
          type='text'
          name='firstName'
          placeholder='Enter your first name'
          value={formData.firstName}
          onChange={handleChange}
        />
        <label>Last Name</label>
        <input
          className='input'
          type='text'
          name='lastName'
          placeholder='Enter your last name'
          value={formData.lastName}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          className='input'
          type='email'
          name='email'
          placeholder='Enter your email'
          value={formData.email}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          className='input'
          type='password'
          name='password'
          placeholder='Enter your password'
          value={formData.password}
          onChange={handleChange}
        />
        <label>Confirm Password</label>
        <input
          className='input'
          type='password'
          name='confirmPassword'
          placeholder='Re-enter your password'
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Signup;
