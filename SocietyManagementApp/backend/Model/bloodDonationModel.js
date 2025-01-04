'use strict';

import mongoose from 'mongoose';

const bloodDonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    lastBloodGiven: {
      type: Date,
      required: true,
    },
    available: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

// Helper function to update availability
function updateAvailability(doc) {
  const currentDate = new Date();
  const lastDonationDate = new Date(doc.lastBloodGiven);
  const differenceInDays = Math.floor((currentDate - lastDonationDate) / (1000 * 60 * 60 * 24));
  doc.available = differenceInDays >= 90;
}

// Pre-save middleware to update `available` before saving
bloodDonationSchema.pre('save', function (next) {
  updateAvailability(this); // `this` refers to the current document
  next();
});

// Post middleware for queries to update `available` dynamically
bloodDonationSchema.post('find', function (docs) {
  docs.forEach(doc => updateAvailability(doc));
});

bloodDonationSchema.post('findOne', function (doc) {
  if (doc) updateAvailability(doc);
});

bloodDonationSchema.post('findById', function (doc) {
  if (doc) updateAvailability(doc);
});

export default mongoose.model('BloodDonation', bloodDonationSchema);
