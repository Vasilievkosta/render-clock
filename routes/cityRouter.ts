import { Router } from 'express'

import cityController from '../controllers/cityController'

import { authMiddleware } from '../middleware/authMiddleware'
import { validatorMiddleware } from '../middleware/validatorMiddleware'
import { cityValidation } from '../middleware/cityValidation'

const cityRouter = Router()

cityRouter.get('/', cityController.getAll)

cityRouter.post(
    '/create',
    authMiddleware,
    cityValidation.createCityValidation,
    validatorMiddleware,
    cityController.create
)

cityRouter.delete(
    '/delete/:id',
    authMiddleware,
    cityValidation.deleteCityValidation,
    validatorMiddleware,
    cityController.delete
)

cityRouter.put(
    '/update',
    authMiddleware,
    cityValidation.updateCityValidation,
    validatorMiddleware,
    cityController.update
)

export default cityRouter
