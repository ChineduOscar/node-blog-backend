const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
    },
    phone: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      minlength: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);
