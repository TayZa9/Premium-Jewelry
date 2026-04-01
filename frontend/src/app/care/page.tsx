import React from 'react';

export default function CarePage() {
  return (
    <div className="bg-white min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-serif tracking-widest text-foreground pb-12 text-center uppercase font-light">Jewelry Care</h1>
        <div className="prose prose-lg mx-auto text-gray-500 font-light leading-relaxed tracking-wide space-y-6">
          <p>Preserve the brilliance of your AURA jewelry by following these care rituals:</p>
          <ul className="list-disc pl-6 space-y-4">
             <li>Store each piece in its original AURA box to prevent scratches.</li>
             <li>Avoid contact with perfumes, oils, and abrasive materials.</li>
             <li>Bring your jewelry in for annual ultrasonic cleaning at any AURA boutique.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
