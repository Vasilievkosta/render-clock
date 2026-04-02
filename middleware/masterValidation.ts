import { body, param } from 'express-validator'
import { assemblyValidators } from './assemblyValidators'

export const createMasterValidation = [
    assemblyValidators.validateName('newName'),
    assemblyValidators.validateArray('arr'),
    body('rating_id').isInt(),
]

export const onWhenMasterValidation = [
    body('cityId').isInt(),
    assemblyValidators.validateDate,
    assemblyValidators.validateTime,
    assemblyValidators.validateDuration,
]

export const deleteMasterValidation = [param('id').isInt()]

export const updateMasterValidation = [
    body('masterId').isInt(),
    assemblyValidators.validateName('newName'),
    body('ratingId').isInt(),
    assemblyValidators.validateArray('arr'),
]
