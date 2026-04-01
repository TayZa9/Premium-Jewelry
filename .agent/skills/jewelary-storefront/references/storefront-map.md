# Storefront Map

## Framework And Libraries

- Next.js `16.2.2`
- React `19.2.4`
- Tailwind CSS `4`
- Framer Motion
- Stripe Elements
- Lucide React

## App Shell

`frontend/src/app/layout.tsx`:
- loads Inter and Playfair Display with `next/font/google`
- wraps the app in `CartProvider`
- renders `Header`, `CartSlideOver`, page content, then `Footer`

`frontend/src/app/globals.css`:
- defines color variables for background, foreground, and gold tones
- maps them into Tailwind theme tokens
- switches to black-on-light text in dark mode media query

## Page Responsibilities

`app/page.tsx`
- home page
- composes `HeroSection` and `FeaturedProducts`

`app/products/page.tsx`
- collection landing page
- renders `ProductGrid`

`app/products/[slug]/page.tsx`
- product detail page
- fetches a mocked product object by slug
- renders `ProductImageGallery` and `ProductInfo`

`app/checkout/page.tsx`
- initializes Stripe Elements
- reads cart state
- posts cart items to backend payment-intent route

`app/dashboard/page.tsx`
- renders account shell
- uses local token presence loosely

## Component Notes

`Header.tsx`
- fixed header with transparent-to-blurred scroll treatment
- opens cart from global context

`CartSlideOver.tsx`
- modal slide-over
- quantity adjustments happen locally in cart context

`HeroSection.tsx`
- full-bleed hero image with motion-based text reveal

`FeaturedProducts.tsx`
- two-card merchandising section using local mock data

`ProductGrid.tsx`
- client-side category filtering over local mock data

`ProductImageGallery.tsx`
- hover zoom on desktop
- thumbnail selection for main image

`ProductInfo.tsx`
- add-to-cart entry point
- expects `name`, `price`, `description`, `material`, `gemstone`, `sku`

## Public Assets

Primary images live in `frontend/public/images/`:
- `hero.png`
- `necklace.png`
- `ring.png`
