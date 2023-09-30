const { body } = require('express-validator')

const validateTime = body('time')
	.custom((value, {req}) => {		
		const options = { hour12: false }		
		const nowTime = new Date().toLocaleTimeString(undefined, options).split(':')[0]
		
		const intValue = parseInt(value, 10)
		const intNowTime = parseInt(nowTime, 10)
		
		if (intValue > 23 || intValue < 0) {
			throw new Error('Значение должно быть в диапазоне от 0 до 23')
		}			
		
		if (typeof value !== 'string') {
			throw new Error('Значение должно быть string')
		}
		if (!/^(0|[1-9]\d*)$/.test(value)) {
			throw new Error('Time must be a string representing a non-negative integer.')
		}
		
		const inputDate = req.body.date		
		const serverDate = new Date().toISOString().split('T')[0]		
		
		if (inputDate === serverDate && intValue <= intNowTime + 3) { 
			throw new Error('Время не может быть прошедшим, если дата - сегодня.');
		}
		
		return true
    })

const validateEmail = body('email').isEmail().isLength({max: 50})
	.withMessage('Email length should be max 50 symbols')

const validateDate = body('date')
	.isISO8601()
	.withMessage('Неверный формат даты. Используйте формат "YYYY-MM-DD".')
	.custom((value) => {
		
		const deltaDate = new Date().setMinutes(180 + new Date().getMinutes())		
		
		const inputDate = new Date(value).toISOString().split('T')[0]
		const serverDate = new Date(deltaDate).toISOString().split('T')[0]
		
		
		if (inputDate < serverDate) {
			throw new Error('Дата не может быть в прошлом.');
		}
		return true
	})

const validateDuration = body('duration')
    .custom((value) => {
        if (Number.isInteger(value) && value >= 1 && value <= 3) {
            return true
        }
        throw new Error('Значение должно быть типом number от 1 до 3')
    })
	
const validateArray = function(fieldName) {
  return [
    body(fieldName)
      .isArray()
      .withMessage(`${fieldName} должен быть массивом`)	  
      .custom((value) => {
        if (!Array.isArray(value) || value.length < 1) {
          throw new Error(`${fieldName} не может быть пустым`)
        }

        for (const item of value) {
			if (!Number.isInteger(item)) {
				throw new Error('arr должен содержать только целые числа')
			}
		}
        return true
      }),
  ]
}

const validateName = function(fieldName) {
  return body(fieldName).isString().trim().isLength({ min: 3, max: 20 })
    .withMessage(`${fieldName} length should be from 3 to 20 symbols`)
}

const assemblyValidators = {
	validateTime,
	validateEmail,
	validateDate,
	validateDuration,
	validateArray,
	validateName,
}

module.exports = assemblyValidators

