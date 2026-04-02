import { assemblyValidators } from './assemblyValidators'

export const sendMailValidation = [
    assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,
    assemblyValidators.validateDate,
    assemblyValidators.validateTime,
]
