import React from 'react';

export default function CareersPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif tracking-widest text-foreground mb-12 uppercase font-light">Join AURA</h1>
        <div className="prose prose-lg mx-auto text-gray-400 font-light leading-relaxed tracking-wide space-y-6">
          <p>We are always seeking exceptional talent to join our house of artisans, designers, and curators.</p>
          <p className="italic">Explore career opportunities at the intersection of heritage and innovation.</p>
          <button className="mt-8 border border-foreground px-12 py-4 text-sm tracking-widest hover:bg-foreground hover:text-white transition-colors">
             CURRENT OPPORTUNITIES
          </button>
        </div>
      </div>
    </div>
  );
}
