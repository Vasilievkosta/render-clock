import { Router } from 'express'

import userController from '../controllers/userController'

import { authMiddleware } from '../middleware/authMiddleware'
import { validatorMiddleware } from '../middleware/validatorMiddleware'
import { userValidation } from '../middleware/userValidation'

const userRouter = Router()

userRouter.get('/', authMiddleware, userController.getAll)

userRouter.delete(
    '/delete/:id',
    authMiddleware,
    userValidation.deleteUserValidation,
    validatorMiddleware,
    userController.delete
)

userRouter.put(
    '/update',
    authMiddleware,
    userValidation.updateUserValidation,
    validatorMiddleware,
    userController.update
)

export default userRouter
