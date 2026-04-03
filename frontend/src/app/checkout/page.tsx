"use client";

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?success=true`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'An unexpected error occurred.');
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
      <button 
        disabled={isLoading || !stripe || !elements} 
        className="w-full bg-foreground text-white py-4 text-sm tracking-widest hover:bg-black transition-colors disabled:opacity-50"
      >
        {isLoading ? 'PROCESSING...' : 'PAY NOW'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.push('/products');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    fetch(`${apiUrl}/api/payments/create-intent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ items })
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to initialize payment.');
        }
        return res.json();
      })
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
      })
      .catch(err => {
        console.error('Payment Error:', err);
        // We could set a global error state here to show the user.
        // For now, let's at least ensure we don't wait forever.
      });

  }, [items, router]);

  return (
    <div className="bg-[#1a1a1a] min-h-screen pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif tracking-widest text-foreground">CHECKOUT</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-background p-8 border border-white/10 shadow-sm rounded-sm">
            <h2 className="text-lg font-medium tracking-wide mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 border-b border-white/10 pb-6">
              {items.map(item => (
                <div key={item.sku} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-4">{item.quantity}x {item.name}</span>
                  <span className="font-serif italic text-primary flex-shrink-0">
                    {typeof item.price === 'string' ? item.price : `$${item.price.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium tracking-wide">Total</span>
              <span className="font-serif italic">${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-background p-8 border border-white/10 shadow-sm rounded-sm">
            <h2 className="text-lg font-medium tracking-wide mb-6">Payment Method</h2>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            ) : (
              <div className="text-center py-10 bg-[#1a1a1a] text-sm text-gray-400 rounded border border-dashed border-gray-300">
                <p>Waiting for secure Stripe payment intent...</p>
                <p className="mt-2 text-xs">(Requires valid STRIPE_SECRET_KEY in backend & Auth Token)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
