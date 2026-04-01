# API Map

## Runtime

- Express `5.2.1`
- Prisma `5.22.0`
- Stripe `21.0.1`
- bcrypt
- jsonwebtoken
- dotenv
- cors

## Entry Point

`backend/src/index.ts`:
- loads env with `dotenv.config()`
- enables CORS
- enables JSON parsing
- mounts auth, category, product, and payment routers
- exposes `/api/health`

## Route Surface

`/api/auth`
- `POST /register`
- `POST /login`

`/api/categories`
- `GET /`
- `GET /:slug`

`/api/products`
- `GET /featured`
- `GET /`
- `GET /:slug`

`/api/payments`
- `POST /create-intent`

## Controller Behavior

`authController.ts`
- register: create user, hash password, return token
- login: verify password, return token

`categoryController.ts`
- list all categories
- fetch category by slug with included products

`productController.ts`
- list all products with category
- fetch product by slug with category
- fetch featured products with category, `take: 4`

`paymentController.ts`
- instantiate Stripe using `STRIPE_SECRET_KEY`
- calculate total from posted cart items
- create a PaymentIntent in USD

## Prisma Models

`User`
- `id`
- `email`
- `passwordHash`
- `role`
- timestamps

`Category`
- `id`
- `name`
- `slug`
- `description`
- `imageUrl`
- relation to `products`
- timestamps

`Product`
- `id`
- `name`
- `slug`
- `description`
- `price` as `Decimal`
- `sku`
- `stock`
- `categoryId`
- `images` as string array
- `material`
- `gemstone`
- `isFeatured`
- timestamps
