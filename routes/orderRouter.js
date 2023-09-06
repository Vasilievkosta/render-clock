const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, orderController.getAll)
router.post('/create', orderController.create)
router.post('/update', orderController.update)
router.delete('/delete/:id', orderController.delete)

module.exports = router
