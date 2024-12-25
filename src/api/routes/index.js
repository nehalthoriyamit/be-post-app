const express = require('express');

const apiRouter = express.Router();

// Auth routes
apiRouter.use('/auth', require('./auth'));

// Posts routes
apiRouter.use(require('./posts'));

module.exports = apiRouter;
