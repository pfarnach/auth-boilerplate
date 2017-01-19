const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const models = require('./models');
const router = require('./router');

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

// Routes
router(app);

// Init tables
models.sequelize.sync().then(() => {
	// Run server
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
});
