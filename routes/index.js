const router = require('express').Router();

router.use('/api-docs', require('./swagger'));

module.exports = router;