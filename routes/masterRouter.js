const Router = require('express')
const router = new Router()
const masterController = require('../controllers/masterController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, masterController.getAll)
router.get('/ofcities', authMiddleware, masterController.getMasterOfCities)
router.get('/ratings', masterController.getRatings)
router.post('/datetime', masterController.onDateAndTime)
router.post('/create', masterController.create)
router.delete('/delete/:id', masterController.delete)
router.put('/update', masterController.update)

module.exports = router
