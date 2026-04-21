const stripe = require('stripe')(process.env.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);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { plan, referralCode } = req.body;

    // Define pricing
    const prices = {
      'premium-monthly': { amount: 999, currency: 'usd', name: 'Premium Monthly' },
      'premium-weekly': { amount: 299, currency: 'usd', name: 'Premium Weekly (Referral)' }
    };

    const price = prices[plan];
    if (!price) {
      throw new Error('Invalid plan');
    }

    // Apply referral discount if valid
    let finalAmount = price.amount;
    if (referralCode && referralCode === 'SHARED2026') {
      finalAmount = Math.floor(finalAmount * 0.8); // 20% discount
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: price.currency,
      metadata: {
        plan: plan,
        referralCode: referralCode || '',
        userId: req.body.userId || 'anonymous'
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      currency: price.currency
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};