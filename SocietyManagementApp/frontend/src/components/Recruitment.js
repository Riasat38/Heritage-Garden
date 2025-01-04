import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './PostRecruitmentPage.css';
import { getUserFromStorage } from './utils.js';

const PostRecruitmentPage = () => {
  const [jobPosition, setJobPosition] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getUserFromStorage();

    try {
      await axios.post('http://localhost:4069/society/adminPanel/recruitments', {
        jobPosition,
        description,
        deadline
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Recruitment post created successfully!');
      setJobPosition('');
      setDescription('');
      setDeadline('');
    } catch (error) {
      console.error('Error creating recruitment post:', error);
      alert('Failed to create recruitment post.');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Post a Recruitment</h2>
        <form className="post-recruitment-form" onSubmit={handleSubmit}>
          <label>
            Job Position:
            <input type="text" value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </label>
          <label>
            Deadline:
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PostRecruitmentPage;
