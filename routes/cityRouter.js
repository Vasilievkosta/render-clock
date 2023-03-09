const Router = require('express');
const router = new Router();
const cityController = require('../controllers/cityController');

router.get('/', cityController.getAll);
router.post('/create', cityController.create);
router.delete('/delete/:id', cityController.delete);

module.exports = router;