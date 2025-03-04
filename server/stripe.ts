import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function processPayment(amount: number) {
  try {
    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);
    
    // Calculate fees
    const stripeFee = Math.round(amountInCents * 0.029 + 30); // 2.9% + $0.30
    const platformFee = Math.round(amountInCents * 0.10); // 10% platform fee
    const doerAmount = amountInCents - stripeFee - platformFee; // 90% minus fees

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      application_fee_amount: platformFee,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents,
      stripeFee,
      platformFee,
      doerAmount,
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    throw new Error('Payment processing failed');
  }
}
