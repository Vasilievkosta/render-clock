const { body, param } = require('express-validator')
const assemblyValidators = require('../middleware/assemblyValidators')

exports.createUserValidation = [
    assemblyValidators.validateName('userName'),
	assemblyValidators.validateEmail,
    body('city_id').isInt(),
]

exports.getOneUserValidation = [
    param('email').isEmail(),
]

exports.updateUserValidation = [
	body('id').isInt(),
    assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,
    body('city_id').isInt(),
]

exports.patchUserValidation = [
	body('id').isInt(),
    assemblyValidators.validateName('userName'),
]

exports.deleteUserValidation = [
    param('id').isInt(),
]
