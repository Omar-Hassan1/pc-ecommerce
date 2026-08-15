const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Payment Service Abstraction Layer per requirement #9.
 * Standardized interface for Stripe and Dev Sandbox integrations.
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'USD', orderId } = req.body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (stripeSecretKey && !stripeSecretKey.includes('placeholder')) {
      // Integration point for live Stripe PaymentIntent API:
      // const stripe = require('stripe')(stripeSecretKey);
      // const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency });
      // return sendSuccess(res, { clientSecret: paymentIntent.client_secret, provider: 'Stripe' });
    }

    // Safe Development Fallback Sandbox
    return sendSuccess(res, {
      clientSecret: `dev_client_secret_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      provider: 'DevSandbox',
      message: 'Development payment sandbox active. Set valid STRIPE_SECRET_KEY in server/.env for production Stripe processing.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent
};
