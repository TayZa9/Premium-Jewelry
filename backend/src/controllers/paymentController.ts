import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-03-25.dahlia',
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    
    // Trusted price map (in production, fetch this from the database)
    const TRUSTED_PRICES: Record<string, number> = {
      'emerald-cut-diamond-ring': 12500,
      'minimalist-gold-pendant': 2100,
      'classic-solitaire-ring': 8200,
      'vintage-pearl-necklace': 3400,
      'sapphire-halo-ring': 6800,
      'diamond-tennis-necklace': 24000,
    };

    const amount = items.reduce((total: number, item: any) => {
      const trustedPrice = TRUSTED_PRICES[item.slug] || 0;
      if (trustedPrice === 0) {
        throw new Error(`Invalid item slug: ${item.slug}`);
      }
      return total + trustedPrice * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert dollars to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
