

module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") {
		console.log(req.method);
		next();
	}
	
	try {
		// console.log('my token', req.cookies.token)
		
		if(!global.name) {
			
			res.status(401).json({ message: "Не авторизован!" });
			
		 } else {
			 
			next();
		 }		
		
	} catch (e) {
		res.status(401).json({ message: "Не авторизован" });
	}
};