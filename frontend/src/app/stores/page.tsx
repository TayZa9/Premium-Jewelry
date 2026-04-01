import React from 'react';

export default function StoresPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-88px)] py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-serif tracking-widest text-foreground mb-12 uppercase font-light">Our Boutiques</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm tracking-widest text-gray-600">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground uppercase">NEW YORK</h3>
            <p>123 Fifth Avenue<br />New York City, NY</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground uppercase">PARIS</h3>
            <p>12 Place Vendôme<br />Paris, FR</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground uppercase">LONDON</h3>
            <p>150 New Bond Street<br />London, UK</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground uppercase">TOKYO</h3>
            <p>5-1-1 Ginza, Chuo City<br />Tokyo, JP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
