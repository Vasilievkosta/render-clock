const Router = require('express');
const router = new Router();
const masterController = require('../controllers/masterController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, masterController.getAll);
router.post('/create', masterController.create);
router.delete('/delete/:id', masterController.delete);

module.exports = router;