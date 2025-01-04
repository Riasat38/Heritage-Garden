import React, { useState } from 'react';
import './GatekeeperRequestForm.css';

function GatekeeperRequestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    description: '',
    delivery: '',
    deliveryType: '',
    guestname: '',
    guests: '',
    destination: '',
    contact: '',
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
    <form className="gatekeeper-request-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
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
          />
        </div>
      )}
      <div className="form-group">
        <label>Guest Name:</label>
        <input
          type="text"
          name="guestname"
          value={formData.guestname}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Guests:</label>
        <input
          type="number"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Destination:</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default GatekeeperRequestForm;
