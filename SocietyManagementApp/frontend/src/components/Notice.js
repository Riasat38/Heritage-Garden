import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './PostNoticePage.css';
import { getUserFromStorage } from './utils.js';

const PostNoticePage = () => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getUserFromStorage();

    try {
      await axios.post('http://localhost:4069/society/adminPanel/announcements', {
        content
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Notice post created successfully!');
      setContent('');
    } catch (error) {
      console.error('Error creating notice post:', error);
      alert('Failed to create notice post.');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Post a Notice</h2>
        <form className="post-notice-form" onSubmit={handleSubmit}>
          <label>
            Content:
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PostNoticePage;
