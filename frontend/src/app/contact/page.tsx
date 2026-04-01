import React from 'react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif tracking-widest text-foreground mb-8 text-center uppercase font-light">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-gray-500 font-light tracking-wide mb-12 italic">
          Our dedicated concierges are available to assist with your inquiries.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm tracking-widest text-gray-600">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground uppercase">Phone</h3>
            <p>1-800-AURA-GEM</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground uppercase">Email</h3>
            <p>concierge@aura.com</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground uppercase">Visit</h3>
            <p>123 Fifth Avenue, New York, NY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
