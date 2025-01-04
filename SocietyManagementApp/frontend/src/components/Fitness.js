import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Fitness.css';

const Fitness = () => {
  const [selectedInfo, setSelectedInfo] = useState(null);

  const infoData = {
    gym: {
      title: 'Society Gym',
      description: 'Good for Personal training, group classes, weightlifting',
      details: [
        { trainer: 'John', expertise: 'Personal Training, Weightlifting', phone: '555-444' },
        { trainer: 'Sohel', expertise: 'Cardio, HIIT', phone: '555-999' },
      ],
    },
    yoga: {
      title: 'Yoga and Meditation Center',
      description: 'Good for Hatha yoga, Vinyasa yoga, meditation sessions.',
      details: [
        { instructor: 'Shotabdi', expertise: 'Hatha Yoga, Meditation', phone: '555-3434' },
        { instructor: 'Tahmina', expertise: 'Vinyasa Yoga, Mindfulness', phone: '555-5656' },
      ],
    },
    
    nutritionist: {
      title: 'Nutritionist',
      description: 'Follow proper diet, stay healthy!',
      details: [
        { name: 'Healthy Living Nutrition', address: 'xyz', phone: '555-4444', services: 'Diet plans, weight management, nutritional counseling' },
        { name: 'Nutrition Pro', address: 'pqr', phone: '555-5555', services: 'Sports nutrition, meal planning, dietary supplements' },
        { name: 'NutriCare', address: 'mno', phone: '555-6666', services: 'Holistic nutrition, detox programs, allergy consultations' },
      ],
    },
    counselor: {
      title: 'Counselor',
      description: 'Get help with mental health, stress, anxiety.',
      details: [
        { name: 'Dr. Yeasmin Ara', expertise: 'Mental Health, Stress Management', phone: '555-7777' },
        { name: 'Dr. Abdur Rahman', expertise: 'Therapy, Anxiety Relief', phone: '555-8888' },
        
      ],
    },
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <header className="fitness-header">
          <h1>Fitness and Mental Health Care</h1>
          <p>In our busy life we often neglect our physical and mental health. We are trying to provide you with the best fitness and mental health assistence. We have a gym, a yoga center, and a meditation center and a team of expert trainers who can help you to stay fit and healthy.</p>
          <p> We are associated with some clinics from where nutritionists and conselors will be available for for support. You can make an appointment by calling and visit them in person.</p>
          <p>Please feel free to contact us for any queries. The details are attached below.</p>
        </header>

        <div className="info-list">
          {Object.keys(infoData).map((infoKey) => (
            <div key={infoKey} className="info-item">
              <h3 className="info-title" onClick={() => setSelectedInfo(selectedInfo === infoKey ? null : infoKey)}>
                {infoData[infoKey].title}
              </h3>

              

              {selectedInfo === infoKey && (
                <div className="info-details">
                  <ul>
                    {infoData[infoKey].details.map((detail, index) => (
                      <li key={index}>
                        <strong>Name:</strong> {detail.name || detail.trainer || detail.instructor}<br />
                        {detail.address && <><strong>Address:</strong> {detail.address}<br /></>}
                        <strong>Phone:</strong> {detail.phone}<br />
                        {detail.services && <><strong>Services:</strong> {detail.services}<br /></>}
                        {detail.expertise && <><strong>Expertise:</strong> {detail.expertise}</>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fitness;
