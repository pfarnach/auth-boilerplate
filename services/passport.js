const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models').User;
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


// Local login strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, pw, done) => {
	// Verify this email and password
	User.findOne({ where: { email }}).then(user => {
		if (!user) {
			return done(null, false);
		}

		user.comparePasswords(pw, (err, isMatch) => {
			if (err) {
				return done(err);
			} else if (!isMatch) {
				return done(null, false);
			}

			return done(null, user);
		});
	}).catch(err => {
		done(err);
	});

});

// Setup options for JWT strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.JWT_SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	// See if user ID in the payload (decoded jwt) exists in our users table
	User.findById(payload.sub).then((user) => {
		if (!user) {
			done(null, false);
		} else {
			done(null, user);
		}
	}).catch(err => {
		done(err, false);
	})
});

// Tell passport to use the strategies
passport.use(jwtLogin);
passport.use(localLogin);
