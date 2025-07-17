const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser); // 🔄 was PUT
router.delete('/:id', userController.deleteUser);
router.patch('/:id/assign-roles', userController.assignRoles); // 🔄 was PUT
router.patch('/:id/remove-role', userController.removeRole);   // 🔄 was DELETE
router.get('/id/:username', getUserIdByUsername);


module.exports = router;
