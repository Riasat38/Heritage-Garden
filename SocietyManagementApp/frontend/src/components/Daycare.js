
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Daycare.css';

const DayCare = () => {
  const [selectedInfo, setSelectedInfo] = useState(null);

  const infoData = {
    safety: {
      title: 'Safety Measures',
      details: 'Our day care center follows strict safety protocols, including secure entry systems, constant supervision, and regular safety drills.',
    },
    activities: {
      title: 'Educational Activities',
      details: 'Children will engage in a variety of educational activities, such as storytelling, arts and crafts, and basic math and science lessons.',
    },
    staff: {
      title: 'Qualified Staff',
      details: 'Our staff consists of highly qualified and experienced caregivers who are dedicated to providing a nurturing environment.',
    },
    facilities: {
      title: 'Facilities',
      details: 'Our facilities include outdoor play areas, nap rooms, and child-friendly restrooms, all designed to provide a comfortable and fun environment.',
    },
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <header className="daycare-header">
          <h1>Day Care Service</h1>
          <p>
            Our society is going to provide safe and engaging day care services for children, offering a secure environment with educational and recreational activities. As we are introducing it for the very first time, it is very obvious for you to be in a doubt if your baby is going to be safe or not. All the information is listed below for your convenience.
          </p>
        </header>

        <div className="info-list">
          {Object.keys(infoData).map((infoKey) => (
            <div
              key={infoKey}
              className={`info-item ${selectedInfo === infoKey ? 'selected' : ''}`}
              onClick={() => setSelectedInfo(selectedInfo === infoKey ? null : infoKey)}
            >
              <label className="info-title">{infoData[infoKey].title}</label>

              {selectedInfo === infoKey && (
                <div className="info-details">
                  <p>{infoData[infoKey].details}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayCare;



