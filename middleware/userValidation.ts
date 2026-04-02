import { body, param } from 'express-validator'
import { assemblyValidators } from './assemblyValidators'

const createUserValidation = [
    assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,
    body('city_id').isInt(),
]

const updateUserValidation = [
    body('id').isInt(),
    assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,
    body('city_id').isInt(),
]

const deleteUserValidation = [param('id').isInt()]

export const userValidation = {
    createUserValidation,
    updateUserValidation,
    deleteUserValidation,
}
