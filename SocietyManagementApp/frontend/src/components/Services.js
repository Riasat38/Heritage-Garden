import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Services.css';
import { getUserFromStorage } from './utils.js';

const MaintenancePage = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]); // Ensure requests is initialized as an array
  const [serviceType, setServiceType] = useState('Electric'); // Service type dropdown
  const [issueDescription, setIssueDescription] = useState(''); // Description textarea

  useEffect(() => {
    const token = getUserFromStorage();

    if (!token) {
      // Redirect to login if no user is found
      window.location.href = '/society/login';
      return;
    }

    setUser({ token }); // Setting the token in the user state

    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/homepage/services', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (Array.isArray(response.data.serviceRequests)) {
          setRequests(response.data.serviceRequests);
        } else {
          setRequests([]); // Handle non-array response
        }
        console.log('Maintenance requests fetched:', response.data.serviceRequests);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleCreateRequest = async () => {
    const token = user.token;
    const newRequest = { serviceType, description: issueDescription };

    try {
      const response = await axios.post(`http://localhost:4069/society/homepage/services/${serviceType}`, newRequest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Create request response:', response.data);
      setRequests([...requests, response.data.service]); // Update state to include new request
      setServiceType('Electric'); // Reset to default
      setIssueDescription('');
      console.log('Maintenance request created:', response.data.service);
    } catch (error) {
      console.error('Failed to create request:', error);
      alert(`Failed to create request: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleUpdateRequest = async (requestId) => {
    const updatedDescription = prompt('Update description:', requests.find(req => req._id === requestId).description);
    if (!updatedDescription) return;

    const token = user.token;

    try {
      const response = await axios.put(`http://localhost:4069/society/homepage/services/${requestId}`, { description: updatedDescription }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRequests(requests.map(request => request._id === requestId ? response.data.service : request));
      console.log('Maintenance request updated:', response.data.service);
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    const token = user.token;

    try {
      await axios.delete(`http://localhost:4069/society/homepage/services/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRequests(requests.filter(request => request._id !== requestId));
      console.log('Maintenance request deleted:', requestId);
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const handleResolveRequest = async (requestId) => {
    const token = user.token;

    try {
      const response = await axios.put(`http://localhost:4069/society/homepage/services/${requestId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setRequests(requests.map(request => request._id === requestId ? response.data.service : request));
      console.log('Maintenance request resolved:', response.data.service);
    } catch (error) {
      console.error('Failed to resolve request:', error);
    }
  };

  const renderRequests = () => (
    <div className="requests-list">
      {Array.isArray(requests) && requests.map(request => (
        <div key={request._id} className="request-item">
          <p><strong>Service Type:</strong> {request.serviceType}</p>
          <p><strong>Description:</strong> {request.description}</p>
          <p><strong>Posted by:</strong> {request.user?.name || 'N/A'}</p>
          <p><strong>Contact Number:</strong> {request.user?.contactno || 'N/A'}</p>
          <p><strong>Flat Number:</strong> {request.user?.flatno || 'N/A'}</p>
          <button onClick={() => handleUpdateRequest(request._id)}>Update</button>
          <button onClick={() => handleDeleteRequest(request._id)}>Delete</button>
          <button onClick={() => handleResolveRequest(request._id)}>Resolve</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>Maintenance Requests</h2>
        <div className="content-sections">
          <div className="create-request-section">
            <div className="create-request-form">
              <h3>Create a Maintenance Request</h3>
              <label>
                Service Type:
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                  <option value="Electric">Electric</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Others">Others</option>
                </select>
              </label>
              <label>
                Description:
                <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)}></textarea>
              </label>
              <button onClick={handleCreateRequest}>Submit Request</button>
            </div>
          </div>
          <div className="view-requests-section">
            {renderRequests()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;  



