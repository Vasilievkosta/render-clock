import { Router } from 'express'

import masterController from '../controllers/masterController'

import { authMiddleware } from '../middleware/authMiddleware'
import { validatorMiddleware } from '../middleware/validatorMiddleware'
import * as masterValidation from '../middleware/masterValidation'

const masterRouter = Router()

masterRouter.get('/', authMiddleware, masterController.getAll)
masterRouter.get('/ofcities/', authMiddleware, masterController.getMasterOfCities)
masterRouter.get('/ratings', masterController.getRatings)

masterRouter.post(
    '/datetime',
    masterValidation.onWhenMasterValidation,
    validatorMiddleware,
    masterController.onDateAndTime
)

masterRouter.post(
    '/create',
    authMiddleware,
    masterValidation.createMasterValidation,
    validatorMiddleware,
    masterController.create
)

masterRouter.delete(
    '/delete/:id',
    authMiddleware,
    masterValidation.deleteMasterValidation,
    validatorMiddleware,
    masterController.delete
)

masterRouter.put(
    '/update',
    authMiddleware,
    masterValidation.updateMasterValidation,
    validatorMiddleware,
    masterController.update
)

export default masterRouter
