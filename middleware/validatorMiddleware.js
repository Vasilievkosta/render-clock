const {validationResult} = require('express-validator')

module.exports = function(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {		
		res.status(400).json({ error: errors.array() })		
	} else {
		next()
	}
}


	
			