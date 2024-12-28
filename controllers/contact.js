const Contact = require('../models/Contact');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const createContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    throw new BadRequestError('Name, email, and message are required');
  }

  // Create a new contact entry
  await Contact.create({ name, email, phone, message });

  res.status(StatusCodes.CREATED).json({
    message: 'Submitted successfully',
  });
};

module.exports = {
  createContact,
};
