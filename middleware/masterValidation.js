const { body, param } = require('express-validator')
const assemblyValidators = require('../middleware/assemblyValidators')

exports.createMasterValidation = [
	assemblyValidators.validateName('newName'),
    assemblyValidators.validateArray('arr'),
    body('rating_id').isInt(),
]

exports.onWhenMasterValidation = [
    body('cityId').isInt(),
	assemblyValidators.validateDate,
	assemblyValidators.validateTime,
	assemblyValidators.validateDuration,
]

exports.deleteMasterValidation = [
    param('id').isInt(),
]

exports.updateMasterValidation = [
	body('masterId').isInt(),
   assemblyValidators.validateName('newName'),
    body('ratingId').isInt(),
    assemblyValidators.validateArray('arr'),
]




