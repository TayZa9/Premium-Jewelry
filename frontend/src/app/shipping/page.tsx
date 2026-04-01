import React from 'react';

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-serif tracking-widest text-foreground mb-12 text-center uppercase font-light">Shipping & Returns</h1>
        <div className="prose prose-lg mx-auto text-gray-500 font-light leading-relaxed tracking-wide space-y-12">
          <section>
            <h2 className="text-xl font-serif tracking-widest text-foreground uppercase">Shipping</h2>
            <p>AURA jewelry is complimentary shipped via secure courier for every order. All shipments are fully insured during transit.</p>
          </section>
          <section>
            <h2 className="text-xl font-serif tracking-widest text-foreground uppercase">Returns</h2>
            <p>Your satisfaction is paramount. Items in original condition may be returned or exchanged within 30 days of receipt.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
