import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Classes.css';

const Classes = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  const classesData = {
    quran: {
      title: 'Quran Class',
      description: 'Join our Quran classes to deepen your understanding and appreciation of the Holy Quran.',
      schedule: 'Mondays and Wednesdays, 5:00 PM - 6:00 PM',
      instructor: 'r. Sheikh Ahmed',
    },
    singing: {
      title: 'Singing Class',
      description: 'Unleash your vocal talents in our singing classes, suitable for all skill levels.',
      schedule: 'Tuesdays and Thursdays, 4:00 PM - 5:30 PM',
      instructor: 'Ms. Sangita Dutta',
    },
    drawing: {
      title: 'Drawing Class',
      description: 'Enhance your artistic skills with our drawing classes, taught by experienced artists.',
      schedule: 'Fridays, 3:00 PM - 4:30 PM',
      instructor: 'Ms. Ruma Khan',
    },
    dancing: {
      title: 'Dancing Class',
      description: 'Get moving and learn new dance styles in our fun and energetic dance classes.',
      schedule: 'Saturdays, 2:00 PM - 3:30 PM',
      instructor: 'Ms. Upoma Chowdhury',
    },
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <header className="classes-header">
          <h1>Enrichment Classes</h1>
          <p>
            For the next three months (starting from 15th January, 2025), society is offering the below-listed classes. All the classes will be held in Community Hall.
          </p>
        </header>

        <div className="classes-list">
          {Object.keys(classesData).map((classKey) => (
            <div
              key={classKey}
              className={`class-item ${selectedClass === classKey ? 'selected' : ''}`}
              onClick={() => setSelectedClass(selectedClass === classKey ? null : classKey)}
            >
              <label className="class-title">{classesData[classKey].title}</label>

              {selectedClass === classKey && (
                <div className="class-details">
                  <p>{classesData[classKey].description}</p>
                  <p><strong>Schedule:</strong> {classesData[classKey].schedule}</p>
                  <p><strong>Instructor:</strong> {classesData[classKey].instructor}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;


