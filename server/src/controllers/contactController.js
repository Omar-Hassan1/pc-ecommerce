const { ContactMessage, NewsletterSubscriber } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMsg = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message
    });

    return sendSuccess(res, contactMsg, 'Thank you for contacting NEXORA COMPUTERS. Our support team will respond shortly.', 201);
  } catch (error) {
    next(error);
  }
};

const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Email address is required', 400);
    }

    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email }
    });

    if (!created) {
      return sendSuccess(res, subscriber, 'You are already subscribed to NEXORA newsletter.');
    }

    return sendSuccess(res, subscriber, 'Successfully subscribed to NEXORA VIP newsletter!', 201);
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    return sendSuccess(res, messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  subscribeNewsletter,
  getContactMessages
};
