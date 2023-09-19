const { body, param } = require('express-validator')
const assemblyValidators = require('../middleware/assemblyValidators')

exports.sendMailValidation = [
	assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,
    assemblyValidators.validateDate,
	assemblyValidators.validateTime,
]
