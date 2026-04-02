import { body, param } from 'express-validator'
import { assemblyValidators } from '../middleware/assemblyValidators'

const createCityValidation = [assemblyValidators.validateName('newTitle')]

const updateCityValidation = [body('cityId').isInt(), assemblyValidators.validateName('newTitle')]

const deleteCityValidation = [param('id').isInt()]

export const cityValidation = {
    createCityValidation,
    updateCityValidation,
    deleteCityValidation,
}
