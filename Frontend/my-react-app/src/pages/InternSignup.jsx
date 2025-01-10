import React, { useState } from 'react';
import axios from 'axios';

const InternSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    DepartmentID: '',
    location: '',
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

    const { firstName, lastName, email, password, confirmPassword, DepartmentID, location, csrfToken } = formData;

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
      const response = await axios.post(
        'http://localhost:3360/internSignup',
        { firstName, lastName, email, password, DepartmentID, location, csrfToken },
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
    <div>
      <h2>Intern Signup Page</h2>
      <form onSubmit={handleSubmit} className="Intern-signup-form">
        <label>First Name</label>
        <input
          type="text"
          placeholder="Enter your first name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label>Last Name</label>
        <input
          type="text"
          placeholder="Enter your last name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Re-enter your password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <label>Department</label>
        <select name="DepartmentID" value={formData.DepartmentID} onChange={handleChange}>
          <option value="">Select a department</option>
          <option value="0">Web Development</option>
          <option value="1">Design</option>
          <option value="2">Video</option>
        </select>
        <label>Location</label>
        <select name="location" value={formData.location} onChange={handleChange}>
          <option value="">Select a location</option>
          <option value="Salinas">Salinas</option>
          <option value="Gilroy">Gilroy</option>
          <option value="Watsonville">Watsonville</option>
          <option value="Stockton">Stockton</option>
          <option value="Modesto">Modesto</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InternSignup;