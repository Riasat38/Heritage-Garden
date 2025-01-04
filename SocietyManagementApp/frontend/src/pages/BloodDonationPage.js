import React, { useState, useEffect } from 'react';
import './BloodDonationPage.css';
import axios from 'axios';

function BloodDonationPage() {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    lastBloodGiven: '',
  });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [updateData, setUpdateData] = useState({
    lastBloodGiven: '',
    available: false,
  });

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get('http://localhost:4069/society/homepage/getBloodDonor', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDonors(res.data);
      } catch (error) {
        console.error('Error fetching blood donors:', error);
      }
    };
    fetchDonors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateData({
      ...updateData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4069/society/homepage/blood-donation', {
        bloodGroup: formData.bloodGroup,
        lastBloodGiven: formData.lastBloodGiven,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDonors((prev) => [...prev, response.data.donorInfo]);
      setFormData({
        bloodGroup: '',
        lastBloodGiven: '',
      });
    } catch (error) {
      console.error('Error signing up as a blood donor:', error);
    }
  };

  const handleSelectDonor = (donor) => {
    setSelectedDonor(donor);
    setUpdateData({
      lastBloodGiven: donor.lastBloodGiven.split('T')[0], // Extract date part
      available: donor.available,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:4069/society/homepage/singleDonor', {
        lastBloodGiven: updateData.lastBloodGiven,
        available: updateData.available,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setDonors((prev) => prev.map((donor) =>
        donor._id === selectedDonor._id ? response.data : donor
      ));
      setSelectedDonor(null);
    } catch (error) {
      console.error('Error updating donor information:', error);
    }
  };

  return (
    <div className="blood-donation-page">
      <div className="content">
        <div className="top-section">
          <div className="donor-list">
            <h2>Available Blood Donors</h2>
            <ul>
              {donors.map((donor) => (
                <li key={donor._id}>
                  <p><strong>Name:</strong> {donor.donor.name}</p>
                  <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                  <p><strong>Contact:</strong> {donor.donor.contactno}</p>
                  <p><strong>Last Blood Given:</strong> {new Date(donor.lastBloodGiven).toLocaleDateString()}</p>
                  <button onClick={() => handleSelectDonor(donor)}>View Details</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="sign-up-form">
            <h2>Sign Up as Blood Donor</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Blood Group:</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Last Blood Given:</label>
                <input
                  type="date"
                  name="lastBloodGiven"
                  value={formData.lastBloodGiven}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Sign Up</button>
            </form>
          </div>
          {selectedDonor && (
            <div className="update-form">
              <h2>Update Donor Information</h2>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Last Blood Given:</label>
                  <input
                    type="date"
                    name="lastBloodGiven"
                    value={updateData.lastBloodGiven}
                    onChange={handleUpdateChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Available:</label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={updateData.available}
                    onChange={handleUpdateChange}
                  />
                </div>
                <button type="submit">Update</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BloodDonationPage;
