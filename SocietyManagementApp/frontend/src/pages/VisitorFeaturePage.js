import React, { useState, useEffect } from 'react';
import VisitorForm from './VisitorForm';
import VisitorList from './VisitorList';
import GatekeeperRequestForm from './GatekeeperRequestForm';
import './VisitorFeaturePage.css';
import axios from 'axios';

function VisitorFeaturePage() {
  const [visitorRequests, setVisitorRequests] = useState([]);
  const [user, setUser] = useState({});

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/getUser', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data;
        setUser(data.user);
        console.log('User:', data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const testPost = async () => {
    console.log('test clicked');

    await axios.post('http://localhost:4069/testpost/testbody', { name: 'Test Name' })
  }

  // Fetch visitor requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/homepage/visitor', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setVisitorRequests(response.data);
        console.log('Visitor:', response.data);
      } catch (error) {
        console.error('Error fetching visitor requests:', error);
      }
    };
    fetchRequests();
  }, [user]);

  const handleResidentFormSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:4069/society/homepage/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setVisitorRequests((prev) => [...prev, data.data]);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error submitting visitor request:', error);
    }
  };

  const handleGatekeeperResolve = async (id) => {
    try {
      console.log('keeper resolve', id);
      const action = 'resolve';

      const response = await axios.post(`http://localhost:4069/society/homepage/visitor/${id}/${action}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Keeper Resolve Response: ', response.data);
      setVisitorRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, resolve_status: true } : req
        )
      );
    } catch (error) {
      console.error('Error resolving visitor request:', error);
    }
  };

  const handleGatekeeperFormSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:4069/society/homepage/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error posting visitor notification:', error);
    }
  };

  console.log('User:', user);
  console.log('Visitor requests:', visitorRequests);

  return (
    <div className="visitor-feature-page">
      {user.usertype === 'resident' ? (
        <>
          <div className="visitor-form-section">
            <VisitorForm onSubmit={handleResidentFormSubmit} />
          </div>
          <div className="visitor-list-section">
            <VisitorList
              requests={visitorRequests}
              userType={user.usertype}
            />
          </div>
        </>
      ) : (user.usertype === 'maintenance' && user.role === 'Gatekeeper') ? (
        <>
          <div className="visitor-list-section">
            <VisitorList
              requests={visitorRequests}
              userType={user.usertype}
              onResolve={handleGatekeeperResolve}
            />
          </div>
          <div className="gatekeeper-form-section">
            <GatekeeperRequestForm onSubmit={handleGatekeeperFormSubmit} />
          </div>
        </>
      ) : null}

      {/* <button onClick={testPost}>Test Post</button> */}
    </div>
  );
}

export default VisitorFeaturePage;