const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/', userController.getAllUsers);                    
router.get('/:id', userController.getSingleUser);             
router.put('/:id', isAuthenticated, userController.updateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);

module.exports = router;