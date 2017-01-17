const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const models = require('./models');
const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

// Routes
router(app);

// Init tables
models.sequelize.sync().then(() => {
   // Init server
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
});
