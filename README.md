



This repository contains an Express project with several routers for user, product, orders, and cart management, payment callback.

## Installation

1. Clone this repository.
2. Navigate to the project directory.
3. Create .env file:
  ```sh
 KASHIER_BASE_URL="https://checkout.kashier.io"
 PAYMENT_API_KEY="your-payment-api-key"
 REDIRECT_URL="http://localhost:3000/api/callback"
 WEBHOOK_URL="http://localhost:3000/paymentWebhook"
 MODE="test" 
 MID="your-mid" 
 APP_URL="http://localhost:3000"
   ```
4. Install the project dependencies:
  ```sh
   npm install
   ```

## Running the Server

To run the Express server, execute the following command:
```sh
npm run dev
```
To run with docker *make sure you replace the environment variables with your own 
```sh
docker-compose up
```
The server will start and listen on port 3000. You can access it in your browser at http://localhost:3000.

## Routers

### User Router "/api/users"

- `POST /`: Create a new user (admin required).
- `POST /admin`: Create a new admin user (admin required).
- `POST /login`: User login.
- `GET /logout`: Logout (authenticated users only).
- `GET /`: Get all users (admin required).
- `GET /me`: Get user's own profile (authenticated users only).
- `DELETE /:id`: Delete a user (admin required).

### Product Router "/api/products"

- `GET /`: Get all products.
- `GET /:id`: Get a specific product.
- `POST /`: Create a new product (admin required).
- `PATCH /:id`: Update a product (admin required).
- `DELETE /:id`: Delete a product (admin required).

### Orders Router "/api/orders"

- `GET /`: Get a list of orders.
- `GET /:id`: Retrieve a specific order & Kashier payment host url.
- `POST /`: Create a new order.

### Cart Router "/api/cart"

- `GET /`: Get a list of cart items.
- `POST /`: Create a new cart item.

### PaymentCallback Router "/api/callback"
- `GET /`: validate signature, mark order as paid by adding the paidAt date, and delete cart items .

## Collections

### User Collection

- Stores user information.

### Product Collection

- Stores product information.

### Order Collection

- Stores order information.

### Cart Collection

- Temporarily stores cart item information before placing an order.

## User Types

- Admin: Has administrative privileges.
- Ordinary User: Regular user account.

## Notes

- For routes that require authentication, use a valid JWT token in the request headers.
- The project uses MongoDB as the database. Make sure you have a running MongoDB instance.
```

Remember to replace placeholders like `your-mid`, `your-payment-api-key`, and any other placeholders with actual values related to your project.
