const express = require('express');
const router = express();

const indexRouter = require('./index');

router.use('/', indexRouter);

module.exports = router;
