const { body, param } = require('express-validator')
const assemblyValidators = require('../middleware/assemblyValidators')

exports.createUserValidation = [
    assemblyValidators.validateName('userName'),
	assemblyValidators.validateEmail,
    body('city_id').isInt(),
]

exports.updateUserValidation = [
	body('id').isInt(),
    assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,
    body('city_id').isInt(),
]

exports.deleteUserValidation = [
    param('id').isInt(),
]
