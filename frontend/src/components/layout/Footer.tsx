import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Newsletter */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif mb-6 tracking-widest">AURA</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Discover the epitome of elegance. Subscribe to our newsletter to receive exclusive offers and the latest news.
            </p>
            <form className="flex max-w-sm">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent border-b border-gray-600 py-2 w-full focus:outline-none focus:border-primary text-sm transition-colors"
                required
              />
              <button type="submit" className="ml-4 text-sm font-medium tracking-wider hover:text-primary transition-colors">
                SUBSCRIBE
              </button>
            </form>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest mb-6">CUSTOMER CARE</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/care" className="hover:text-white transition-colors">Jewelry Care</Link></li>
            </ul>
          </div>

          {/* The Company */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest mb-6">THE COMPANY</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/stores" className="hover:text-white transition-colors">Boutiques</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} AURA JEWELRY. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-400">
            <a href="#" className="hover:text-white transition-colors" aria-label="Mail"><Mail size={20} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Location"><MapPin size={20} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Phone"><Phone size={20} strokeWidth={1.5} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
