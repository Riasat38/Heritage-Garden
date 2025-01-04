import React from 'react';
import './VisitorList.css';

function VisitorList({ requests, userType, onResolve }) {
  return (
    <div className="visitor-list">
      {requests.map((request) => (
        <div key={request._id} className="visitor-request">
          <p><strong>Delivery:</strong> {request.delivery ? 'Yes' : 'No'}</p>
          {request.delivery && (
            <p><strong>Delivery Type:</strong> {request.deliveryType}</p>
          )}
          <p><strong>Expected Arrival:</strong> {new Date(request.expectedArrival).toLocaleString()}</p>
          <p><strong>Description:</strong> {request.description}</p>
          {userType === 'maintenance' && (
            <button onClick={() => onResolve(request._id)}>Resolve</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default VisitorList;
