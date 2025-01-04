import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Sidebar from './Sidebar';

const HomePage = () => {
  const [notices, setNotices] = useState([]);
  

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/homepage');
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    fetchNotices();
   
  }, []);

  return (
    <div className="homepage-container">
      <Sidebar />
      <main className="main-content">
        <h1>Notice and Announcement</h1>
      </main>
      
      {notices.length === 0 ? (
        <p>No notices has been posten yet..</p>
      ) : (
        notices.map((notice) => (
          <div key={notice.id} className="notice-item">
            <p><strong>Content:</strong> {notice.content}</p>
            <p><strong>Creator:</strong> {notice.creator}</p>
            <p><strong>Created At:</strong> {new Date(notice.createdAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
      
    </div>
  );
};

export default HomePage;














