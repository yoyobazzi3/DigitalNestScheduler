import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordAdmin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3360/admin-forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error sending reset email:', error);
      setMessage('Failed to send reset email.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPasswordAdmin;