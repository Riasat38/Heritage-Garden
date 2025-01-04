import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    contactno: '',
    usertype: '',
    flatno: '',
    role: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (e) => {
    setFormData({
      ...formData,
      usertype: e.target.value,
      flatno: '',
      role: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4069/society/registerPage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          contactno: formData.contactno,
          usertype: formData.usertype,
          flatno: formData.usertype === 'resident' ? formData.flatno : undefined,
          role: formData.usertype === 'maintenance' ? formData.role : undefined,
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact No:</label>
          <input
            type="text"
            name="contactno"
            value={formData.contactno}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>User Type:</label>
          <select name="usertype" value={formData.usertype} onChange={handleUserTypeChange} required>
            <option value="">Select User Type</option>
            <option value="resident">Resident</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {formData.usertype === 'resident' && (
          <div className="form-group">
            <label>Flat No:</label>
            <input
              type="text"
              name="flatno"
              value={formData.flatno}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {formData.usertype === 'maintenance' && (
          <div className="form-group">
            <label>Maintenance Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Gatekeeper">Gatekeeper</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Caretaker">Caretaker</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
