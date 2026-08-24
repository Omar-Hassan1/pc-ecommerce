import { Request, Response, NextFunction } from 'express';
import { ContactMessage, NewsletterSubscriber } from '../models';
import { sendSuccess, sendError } from '../utils/response.handler';

export const submitContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

export const subscribeNewsletter = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

export const getContactMessages = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    return sendSuccess(res, messages);
  } catch (error) {
    next(error);
  }
};
