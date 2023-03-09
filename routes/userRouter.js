const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAll);
router.post('/create', userController.create);
router.delete('/delete/:id', userController.delete);

module.exports = router;