import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia' as any, // Using stable API version
});

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ message: 'Invalid items data' }, { status: 400 });
    }

    // Fetch trusted prices from the database for each item in the cart
    const slugs = items.map((item: any) => item.slug);
    const products = await prisma.product.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true, price: true }
    });

    console.log(`Fetched ${products.length} products for Stripe intent.`);

    const priceMap = products.reduce((acc: any, p) => {
      acc[p.slug] = Number(p.price);
      return acc;
    }, {});

    const amountInSgd = items.reduce((total: number, item: any) => {
      const price = priceMap[item.slug];
      if (!price) {
        throw new Error(`Product not found or invalid: ${item.slug}`);
      }
      return total + price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountInSgd * 100), // convert dollars to cents
      currency: 'sgd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe Payment Intent Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
