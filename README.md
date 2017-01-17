# Auth boilerplate

### Overview
This is a boilerplate project that acts as a starting point for authentication in NodeJS/Express apps.  It uses Passport, bcrypt, Postgres/Sequelize, and JWTs.

### Use
Clone the repo and install the dependencies with either `yarn` or `npm install`.

Create a `config.js` file in the project root that looks like:
```
module.exports = {
    JWT_SECRET: 'your jwt secret string here',
	DB_URI: 'postgres://user:password@localhost:5432/db_name'
}
```
... with the appropriate values filled in.

Start up the server with `yarn run start` or `npm run start`.