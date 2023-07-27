const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") {
		console.log(req.method);
		next();
	}
	
	try {		
		const authorizationHeader = req.headers.authorization;
		
		if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
			const token = authorizationHeader.split(' ')[1];
			
			// here you can check the token
			const decoderToken = jwt.verify(token, "SECRET_KEY")
			
			
			next();
		} else {
			res.status(401).send('Требуется авторизация');
		}		
		
	} catch (e) {
		console.log(e)
		res.status(403).json({ message: "Не авторизован" });
	}
};