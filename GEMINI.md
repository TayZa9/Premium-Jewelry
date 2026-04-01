# Project Context: Luxury E-Commerce Website

## Overview
This repository contains the context and AI guidelines for building a high-end luxury jewelry e-commerce platform (similar to Cartier, Tiffany & Co.).

## Design System & Aesthetics
- **Theme:** Luxury, sophisticated, minimal.
- **Color Palette:** Black, Gold, White. Avoid generic primary colors. Use nuanced shades (e.g., deep charcoal for black, champagne/rose-gold accents for gold).
- **Typography:** Elegant Serif (for headings) and clean Sans-Serif (for body text).
- **UI/UX Interactions:** Smooth hover effects, micro-animations, glassmorphism where appropriate, parallax/smooth scrolling.
- **Imagery:** High-definition product imagery with zoom capabilities. Never use generic placeholders without premium and tasteful styling.

## Technical Architecture (Proposed)
- **Frontend:** Next.js (React) + Tailwind CSS (preferred for rapid, custom luxury UI integration).
- **Backend:** Node.js with Express (or Next.js Route Handlers if integrated).
- **Database:** PostgreSQL (ideal for robust e-commerce relationships) or MongoDB.
- **Authentication:** JWT / session-based secure auth.
- **Payments:** Stripe API integration.

## Core Rules for AI Agent (Gemini)
1. **Visual Excellence:** Every UI component generated must look premium, modern, and production-ready. Simple utility styling is insufficient; the user must be "WOWed."
2. **Attention to Detail:** Ensure mobile-first responsive design, fast loading metrics, and semantic HTML5 for SEO.
3. **Security First:** Implement proper password hashing, secure token transfer, and validate all inputs. 
4. **Iterative Polish:** Ensure features like shopping carts, wishlists, and product filtering behave seamlessly without page jank.
