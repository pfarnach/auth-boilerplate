# Auth boilerplate

### Overview
This is a boilerplate project that acts as a starting point for authentication in NodeJS/Express apps.  It uses Passport, bcrypt, Postgres/Sequelize, and JWTs. Currently it's set up to handle both local login (email/password) and a Facebook OAuth strategy.

### Use
Clone the repo and install the dependencies with either `yarn` or `npm install`.

Create a `config.js` file in the project root that looks like:
```
module.exports = {
	db: {
		URI: 'postgres://user:password@localhost:5432/db_name'
	},
	auth: {
		FB_APP_ID: 'FB APP ID here',
		FB_SECRET_ID: 'FB SECRET ID here',
		FB_CALLBACK_URL: '/auth/facebook/callback'
	},
	token: {
		JWT_SECRET: 'Your JWT secret here',
		DURATION: (token duration in milliseconds as a number)
	}
}
```
... with the appropriate values filled in.

Start up the server with `yarn run start` or `npm run start`.