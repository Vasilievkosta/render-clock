import { body, param } from 'express-validator'
import { assemblyValidators } from './assemblyValidators'

export const createAndSendOrderValidation = [
    assemblyValidators.validateDate,
    assemblyValidators.validateTime,
    assemblyValidators.validateDuration,
    body('city_id').isInt(),
    body('master_id').isInt(),
    assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,
]

export const updateOrderValidation = [
    body('orderId').isInt(),
    assemblyValidators.validateDate,
    assemblyValidators.validateTime,
    assemblyValidators.validateDuration,
    body('user_id').isInt(),
    body('master_id').isInt(),
]

export const deleteOrderValidation = [param('id').isInt()]

export const orderValidation = {
    createAndSendOrderValidation,
    updateOrderValidation,
    deleteOrderValidation,
}
