# TypeScript User Authentication API

This project is a REST API for creating and managing user accounts. It uses TypeScript and Express for the server, Prisma to communicate with a PostgreSQL database, bcrypt to hash passwords, and JSON Web Tokens (JWT) to protect private routes. Users can register, log in, view all users, view their profile, and update their username or email.

## Instructions for Build and Use

Steps to build and run the software:

1. Install Node.js and make sure a PostgreSQL database is available.
2. Clone or download this repository, open a terminal in the project folder, and run `npm install`.
3. Create a `.env` file in the project root and add `DATABASE_URL` and `JWT_SECRET` values.
4. Run `npx prisma migrate dev` to create the database tables, then run `npx prisma generate` to generate the Prisma client.
5. Start the development server with `npm run dev`. The API will run at `http://localhost:3000`.

Example `.env` file:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_SECRET="replace-this-with-a-secure-secret"
```

Instructions for using the software:

1. Send a `POST` request to `/register` with `email`, `username`, and `password` in the JSON body to create an account.
2. Send a `POST` request to `/login` with `email` and `password` to receive an authentication token.
3. For protected routes, add the token to the request header as `Authorization: Bearer YOUR_TOKEN`.
4. Use `GET /users` to view users, `GET /profile` to view the current user's profile, and `PUT /profile` with a new `username` or `email` to update the profile.

## Development Environment

To recreate the development environment, you need the following software and libraries:

* Node.js and npm
* TypeScript 5.9.3
* Express 5.2.1
* Prisma and Prisma Client 6.19.3
* PostgreSQL
* bcrypt 6.0.0
* jsonwebtoken 9.0.3
* ts-node-dev 2.0.0

## Useful Websites to Learn More

I found these websites useful in developing this software:

* [Prisma Documentation](https://www.prisma.io/docs)
* [W3Schools TypeScript Getting Started](https://www.w3schools.com/typescript/typescript_getstarted.php)

## Future Work

The following items I plan to fix, improve, or add to this project in the future:

* [ ] Add stronger validation for email addresses, usernames, and passwords.
* [ ] Add automated tests for registration, login, authentication, and profile routes.
* [ ] Add features for changing passwords and deleting accounts.
