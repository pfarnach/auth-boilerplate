const jwt = require('jwt-simple');

const User = require('../models').User;
const config = require('../config');


function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp, exp: timestamp + 10000 }, config.JWT_SECRET)
}

exports.signup = (req, res, next) => {
	const { email: rawEmail, password } = req.body;
	const email = rawEmail.toLowerCase();

	// Enforce email and password params
	if (!email || !password) {
		res.status(422).send({ error: 'You must provide a valid email and password' });
	}

	// See if user with given email exists
	User.findOne({ where: { email }}).then(user => {
		// If a user with email already exists, return error
		if (user) {
			return res.status(422).send({ error: 'Email is in use' });
		}

		// If a user with an email does NOT exist, create and save user record
		User.create({
			email,
			password
		}).then(createdUser => {
			// Respond to request indicating the user was created
			res.send({ token: tokenForUser(createdUser) });
		}).catch(err => {
			res.status(400).send({ error: 'Invalid email or password' });
		})
	});
};

exports.signin = (req, res, next) => {
	// User has already been authenticated, now need to give them token
	const { user } = req;  // user put on req when comparePasswords successful
	res.send({ token: tokenForUser(user) });
};
