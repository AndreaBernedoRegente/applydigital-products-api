#Challenge Apply Digital Products API

API to synchronize products from Contentful, store them in MongoDB, and expose public and private endpoints (NestJS + Mongoose).

---

## How to Run the App

### With Docker (recommended)

1. Create a `.env` file in the root with:

   ```
   CONTENTFUL_SPACE_ID=9xxxxxx
   CONTENTFUL_ACCESS_TOKEN=I-xxxxxxxx
   CONTENTFUL_ENVIRONMENT=master
   CONTENTFUL_CONTENT_TYPE=product
   MONGODB_URI=xxxxxx
   JWT_SECRET=xxxx
   ADMIN_USER=xxxxx
   ADMIN_PASS=xxxxx
   ```

2. Run:

   ```bash
   docker-compose up --build
   ```

3. The API will be available at `http://localhost:3000`

---

### Local Mode

1. Install dependencies:
   ```bash
   npm install
   ```
2. Make sure MongoDB is running locally (`mongodb://localhost:27018/applydigital_products`).
3. Create the `.env` file (see above).
4. Run:
   ```bash
   npm run start:dev
   ```

---

## Swagger / API Docs

- Access the interactive documentation at:  
  `http://localhost:3000/api/docs`

---

## Contentful Synchronization

- The app automatically synchronizes products from Contentful **every hour**.
- To force an initial sync, simply restart the app.

---

## Authentication

- For private endpoints (reports), log in at `/auth/login` with:
  - **Username:** admin
  - **Password:** admin123456
- Use the received JWT token as a `Bearer` in the headers.

---

## Testing

- Run tests and see coverage with:
  ```bash
  npm run test:cov
  ```

---

## 📝 Assumptions and Decisions

- Only one admin user exists (no registration).
- Products are only created/updated via synchronization.
- Soft delete ensures deleted products do not reappear.
- Reports match exactly what is requested in the challenge.

---

## Stack

- Node.js (LTS)
- NestJS
- MongoDB (Mongoose)
- Docker
- GitHub Actions

---

## Questions

If you have any questions, please contact the Apply Digital team.

---
