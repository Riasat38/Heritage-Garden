import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Rent.css';
import { getUserFromStorage } from './utils.js';

const PostRentPage = () => {
  const [rentAmount, setRentAmount] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getUserFromStorage();

    try {
      await axios.post('http://localhost:4055/society/homepage/rent-post', {
        rent_amount: rentAmount,
        availablefrom: availableFrom,
        flat_no: flatNo,
        description
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Rent post created successfully!');
      setRentAmount('');
      setAvailableFrom('');
      setFlatNo('');
      setDescription('');
    } catch (error) {
      console.error('Error creating rent post:', error);
      alert('Failed to create rent post.');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Post a Rent</h2>
        <form className="post-rent-form" onSubmit={handleSubmit}>
          <label>
            Rent Amount:
            <input type="text" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} required />
          </label>
          <label>
            Available From:
            <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} required />
          </label>
          <label>
            Flat Number:
            <input type="text" value={flatNo} onChange={(e) => setFlatNo(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PostRentPage;
