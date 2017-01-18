const passport = require('passport');

const config = require('./config');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const requireFbSignin = passport.authenticate('facebook', { session: false });


module.exports = (app) => {
	// Generic protected route
	app.get('/', requireAuth, (req, res) => {
		res.send({ status: 'You got this response because you are authenticated' });
	});

	// Local signup/signin
	app.post('/signup', Authentication.signup);
	app.post('/signin', requireSignin, Authentication.signin);

	// OAuth - Facebook
	app.get('/auth/facebook', requireFbSignin);
	app.get(config.auth.FB_CALLBACK_URL, requireFbSignin, Authentication.signin);
};
