const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', bookController.getAll);
router.post('/', isAuthenticated, bookController.createBook);
router.get('/:id', bookController.getSingle);
router.put('/:id', isAuthenticated, bookController.updateBook);
router.delete('/:id', isAuthenticated, bookController.deleteBook);

module.exports = router;