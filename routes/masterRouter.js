const Router = require('express');
const router = new Router();
const masterController = require('../controllers/masterController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, masterController.getAll);
router.get('/ofcity/:id', masterController.ofTheCity);
router.post('/create', masterController.create);
router.delete('/delete/:name', masterController.delete);


router.post('/ofcitytest', masterController.ofTheCityTest);


module.exports = router;