import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './Sidebar';

function Home() {
  const [userData, setUserData] = useState(null);
  const [jobList, setJobList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:4069/society/getUserData');
      const data = await response.json();
      setUserData(data);
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch job postings if the user is an admin
    const fetchJobList = async () => {
      if (userData && userData.admin) {
        const response = await fetch('http://localhost:4069/society/recruitments');
        const data = await response.json();
        setJobList(data.job_list);
      }
    };

    fetchJobList();
  }, [userData]);

  

  return (
    <div className="main-container">
      <Sidebar />
          {userData && userData.admin && (
            <div className="admin-panel">
              <h4>Admin Panel</h4>
              <ul className="admin-list">
                {jobList.map((job) => (
                  <li key={job.serial}>
                    <p><strong>Title:</strong> {job.title}</p>
                    <p><strong>Description:</strong> {job.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
      <main className="main-content">
        <h1>Ekhane Notice add hobe</h1>
        
        {/* Additional content can go here */}
      </main>
    </div>
  );
}

export default Home;













