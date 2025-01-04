import React, { useState } from 'react';
import './VisitorForm.css';

function VisitorForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    delivery: false,
    deliveryType: '',
    expectedArrival: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="visitor-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Delivery:</label>
        <input
          type="checkbox"
          name="delivery"
          checked={formData.delivery}
          onChange={(e) => setFormData({ ...formData, delivery: e.target.checked })}
        />
      </div>
      {formData.delivery && (
        <div className="form-group">
          <label>Delivery Type:</label>
          <input
            type="text"
            name="deliveryType"
            value={formData.deliveryType}
            onChange={handleChange}
            required
          />
        </div>
      )}
      <div className="form-group">
        <label>Expected Arrival:</label>
        <input
          type="datetime-local"
          name="expectedArrival"
          value={formData.expectedArrival}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default VisitorForm;
