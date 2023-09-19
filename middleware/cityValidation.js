const { body, param } = require('express-validator')
const assemblyValidators = require('../middleware/assemblyValidators')

exports.createCityValidation = [
    assemblyValidators.validateName('newTitle'),
]

exports.updateCityValidation = [
	body('cityId').isInt(),
    assemblyValidators.validateName('newTitle'),
];

exports.deleteCityValidation = [
    param('id').isInt(),
];
