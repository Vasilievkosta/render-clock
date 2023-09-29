const { body, param } = require('express-validator')
const assemblyValidators = require('../middleware/assemblyValidators')

exports.createAndSendOrderValidation = [
	assemblyValidators.validateDate,
	assemblyValidators.validateTime,
	assemblyValidators.validateDuration,
	body('user_id').isInt(),
	body('master_id').isInt(),	
	assemblyValidators.validateName('userName'),
    assemblyValidators.validateEmail,	
]

exports.updateOrderValidation = [
	body('orderId').isInt(),
	assemblyValidators.validateDate,
	assemblyValidators.validateTime,
	assemblyValidators.validateDuration,
	body('user_id').isInt(),
	body('master_id').isInt(),
]

exports.deleteOrderValidation = [
    param('id').isInt(),
]



