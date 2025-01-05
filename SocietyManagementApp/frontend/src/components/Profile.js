import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Profile.css';
import { getUserFromStorage } from './utils.js';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getUserFromStorage();

    if (!token) {
      window.location.href = '/society/login';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4055/society/homepage', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePostRent = () => { 
    navigate('/post-rent'); 
  }; 
  
  const handlePostRecruitment = () => { 
    navigate('/post-recruitment'); 
  };
  
  const handlePostNotice = () => { 
    navigate('/post-notice');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Profile Page</h2>
        <div className="profile-info">
          <table>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>Username:</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>Email:</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Flat Number:</th>
                <td>{user.flatno || 'N/A'}</td>
              </tr>
              <tr>
                <th>Contact Number:</th>
                <td>{user.contactno}</td>
              </tr>
              <tr>
                <th>User Type:</th>
                <td>{user.usertype}</td>
              </tr>
              <tr>
                <th>Role:</th>
                <td>{user.role || 'N/A'}</td>
              </tr>
              <tr>
                <th>Joining Date:</th>
                <td>{user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {user.usertype === 'Admin' && ( 
          <> 
            <button className="post-rent-button" onClick={handlePostRent}>Post a Rent</button> 
            <button className="post-recruitment-button" onClick={handlePostRecruitment}>Post Recruitment</button> 
            <button className="post-notice-button" onClick={handlePostNotice}>Post Notice</button> 
          </>
        )}  
      </div>
    </div>
  );
};


export default ProfilePage;

