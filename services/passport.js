const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models').User;
const config = require('../config');


// Local login strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, pw, done) => {
	// Verify this email and password
	User.findOne({ where: { email }}).then(user => {
		if (!user) {
			return done(null, false);
		}

		// Check if password entered matches hashed and salted password
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

// Setup Facebook strategy
const fbOptions = {
	clientID: config.auth.FB_APP_ID,
	clientSecret: config.auth.FB_SECRET_ID,
	callbackURL: 'http://localhost:3000' + config.auth.FB_CALLBACK_URL,
	profileFields: ['id', 'email', 'name'],
	scope: ['email']
};

const fbLogin = new FacebookStrategy(fbOptions, (accessToken, refreshToken, profile, done) => {
	User.findOne({ where: { fbID: profile.id }}).then(user => {
		console.log('\n\nUSER\n', user);
		if (user) {
			// Was previously authenticated
			done(null, user);
		} else {
			// If no user, create one -- but must grant email access
			if (!profile.emails || !profile.emails[0]) {
				return done(null, false, { error: 'Email access is required' });
			}

			User.create({
				fbID: profile.id,
				fbToken: accessToken,
				name: `${profile.name.givenName} ${profile.name.familyName}`,
				email: profile.emails[0].value,
				authMethod: 'FACEBOOK'
			}).then(createdUser => {
				done(null, createdUser);
			}).catch(err => {
				done(err);
			});
		}
	}).catch(err => {
		done(err);
	});
});

// Setup JWT strategy for veryifying token
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.token.JWT_SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	// Check if token expired
	if (payload.exp <= Date.now()) {
		return done(null, false, { error: 'Token expired' });
	}

	// See if user ID in the payload (decoded jwt) exists in our users table
	User.findById(payload.sub).then(user => {
		if (!user) {
			done(null, false);
		} else {
			done(null, user);
		}
	}).catch(err => {
		done(err);
	});
});

// Tell passport to use the strategies
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(fbLogin);
