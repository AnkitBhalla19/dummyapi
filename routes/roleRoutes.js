const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.patch('/:id', roleController.updateRole); // 🔄 was PUT
router.delete('/:id', roleController.deleteRole);
router.patch('/:id/add-child', roleController.addChildRole);    // 🔄 was PUT
router.patch('/:id/remove-child', roleController.removeChildRole); // 🔄 was PUT
router.get('/id/:name', roleController.getRoleIdByName);

module.exports = router;
