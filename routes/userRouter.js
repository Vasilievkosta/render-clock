const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, userController.getAll);
router.get('/:email', userController.getUser);
router.post('/create', userController.create);
router.delete('/delete/:id', userController.delete);
router.put('/update', userController.update);

module.exports = router;