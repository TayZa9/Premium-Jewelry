import React from 'react';

export default function FAQPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-serif tracking-widest text-foreground mb-12 text-center uppercase font-light">FAQ</h1>
        <div className="space-y-12">
          <div className="border-b border-gray-100 pb-8">
             <h3 className="text-lg font-serif tracking-wider text-foreground mb-4 uppercase">How do I track my order?</h3>
             <p className="text-gray-500 font-light tracking-wide italic">You will receive a tracking number via email once your order has been dispatched.</p>
          </div>
          <div className="border-b border-gray-100 pb-8">
             <h3 className="text-lg font-serif tracking-wider text-foreground mb-4 uppercase">Are your diamonds ethically sourced?</h3>
             <p className="text-gray-500 font-light tracking-wide italic">Every AURA diamond is sourced through the Kimberley Process and meets the highest ethical standards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
