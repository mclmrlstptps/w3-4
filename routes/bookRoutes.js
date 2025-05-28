const express = require('express');
const router = express.Router();
const bookController = require('../controllers/books')

router.get('/', bookController.getAll);
router.post('/', bookController.createBook);

router.get('/:id', bookController.getSingle);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;