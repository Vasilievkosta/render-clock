import { Router } from 'express'

import orderController from '../controllers/orderController'

import { authMiddleware } from '../middleware/authMiddleware'
import { validatorMiddleware } from '../middleware/validatorMiddleware'
import { orderValidation } from '../middleware/orderValidation'

const orderRouter = Router()

orderRouter.get('/', authMiddleware, orderController.getAll)

orderRouter.post(
    '/createAndSend',
    orderValidation.createAndSendOrderValidation,
    validatorMiddleware,
    orderController.createAndSend
)

orderRouter.put(
    '/update',
    authMiddleware,
    orderValidation.updateOrderValidation,
    validatorMiddleware,
    orderController.update
)

orderRouter.delete(
    '/delete/:id',
    authMiddleware,
    orderValidation.deleteOrderValidation,
    validatorMiddleware,
    orderController.delete
)

export default orderRouter
