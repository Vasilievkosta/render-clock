const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

const authMiddleware = require('../middleware/authMiddleware')
const validatorMiddleware = require('../middleware/validatorMiddleware')
const orderValidation = require('../middleware/orderValidation')

router.get('/', authMiddleware, orderController.getAll)

router.post('/createAndSend', orderValidation.createAndSendOrderValidation, validatorMiddleware, orderController.createAndSend)

router.put('/update',  authMiddleware, orderValidation.updateOrderValidation, validatorMiddleware,  orderController.update)

router.delete('/delete/:id', authMiddleware, orderValidation.deleteOrderValidation, validatorMiddleware, orderController.delete)


router.get('/timezone', orderController.getTimeZone)

module.exports = router
