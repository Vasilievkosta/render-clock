const { body, param } = require('express-validator')

const userNameValidator = body('userName').isString().trim().isLength({min:3, max: 20})
	.withMessage('Title length should be from 3 to 20 symbols')

exports.createUserValidation = [
    userNameValidator,
    body('email').isEmail(),
    body('city_id').isInt(),
]

exports.getOneUserValidation = [
    param('email').isEmail(),
]

exports.updateUserValidation = [
	body('id').isInt(),
    userNameValidator,
    body('email').isEmail(),
    body('city_id').isInt(),
];

exports.patchUserValidation = [
	body('id').isInt(),
    userNameValidator,
]

exports.deleteUserValidation = [
    param('id').isInt(),
];
