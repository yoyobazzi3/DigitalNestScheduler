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
    <div className="Signup">
      <form onSubmit={handleSubmit} className="Signup-form">
        <h1>Signup</h1>
        <label>First Name</label>
        <input
          className="input"
          type="text"
          name="firstName"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label>Last Name</label>
        <input
          className="input"
          type="text"
          name="lastName"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        <label>Confirm Password</label>
        <input
          className="input"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <label>Admin Key</label>
        <input
          className="input"
          type="password"
          name="adminKey"
          placeholder="Enter the admin key"
          value={formData.adminKey}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Signup;