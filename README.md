# Kongres Backend API

Kongres is a smart attendance and engagement system built to help organizations, especially churches and ministries, manage event attendance, gather insights, and stay connected with their members. This repository contains the backend API built with **Express.js** and **Prisma ORM**.

## Features

- Church/organization account registration and authentication (JWT-based)
- Event creation with auto-generated unique links and QR codes
- Member attendance tracking via web or USSD input
- First-timer tracking and gender segmentation
- Admin dashboard-ready APIs for attendance analytics
- Member database auto-population from event records
- Scalable schema structure for future extensions like email, SMS, and AI features

## Tech Stack

- **Node.js**
- **Express.js**
- **Prisma ORM** with PostgreSQL
- **JWT Authentication**
- **Redis** (for future rate limiting or session caching)
- **QR Code Generator**
- **USSD Integration-ready**
- **Docker** (optional for deployment)

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Yarn or npm
- Redis (optional, but recommended for caching)

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/KingDavidJnr/kongres-backend.git
   cd kongres-backend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Set up your database connection string in `.env`:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/kongres"
   JWT_SECRET="your-secret"
   ```

5. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

## API Documentation

API documentation will be available soon via Swagger or Postman collection.

## Folder Structure

```
src/
│
├── controllers/
├── services/
├── routes/
├── middleware/
├── prisma/
├── utils/
└── index.js
```

## Roadmap

* [x] Church admin registration and login
* [x] Event creation with attendance tracking
* [x] QR code generation for service links
* [x] Public attendance form
* [ ] USSD-based attendance
* [ ] Member engagement analytics
* [ ] SMS and email integrations
* [ ] Admin dashboard (frontend)

## Contributing

This project is open source and welcomes contributions. Feel free to fork the repo, make changes, and open a pull request.

## License

[MIT](./LICENSE)

---

Built with ❤️ by [David Oduse](https://linkedin.com/in/david-oduse)

```
