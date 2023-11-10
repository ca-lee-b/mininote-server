### Tech stack

- Express (w/ Typescript)
- express-rate-limit for the auth router
- express-validator for body parsing
- Winston for logging
- bcrypt for hashing
- Postgresql + Prisma for the database
- Jest + Supertest for testing

### Deployment

For development:

- Clone repository
- Run `npm i`
- Configure `.env` file
- Run `npx migrate dev`
- Run `npm run dev`

For production:

- Same as development instructions, except:
- Run `npx prisma generate` rather than `npx migrate`
- Run `npm run build`
- `node build/index.js`

Hosted on railway.
