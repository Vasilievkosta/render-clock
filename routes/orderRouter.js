const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

const authMiddleware = require('../middleware/authMiddleware')
const validatorMiddleware = require('../middleware/validatorMiddleware')
const orderValidation = require('../middleware/orderValidation')

router.get('/admin', authMiddleware, orderController.getAll)

router.post('/create', orderValidation.createOrderValidation, validatorMiddleware, orderController.create)

router.put('/update',  orderValidation.updateOrderValidation, validatorMiddleware,  orderController.update)

router.delete('/delete/:id', orderValidation.deleteOrderValidation, validatorMiddleware, orderController.delete)

module.exports = router
