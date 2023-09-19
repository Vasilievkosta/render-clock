const { body, param } = require('express-validator')
const assemblyValidators = require('../middleware/assemblyValidators')

exports.createOrderValidation = [
	assemblyValidators.validateDate,
	assemblyValidators.validateTime,
	assemblyValidators.validateDuration,
	body('user_id').isInt(),
	body('master_id').isInt(),
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



