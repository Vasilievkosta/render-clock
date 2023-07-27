const db = require('../db');

class UserController {

    async getAll(req, res) {
        const users = await db.query('SELECT users.id, users.userName, users.email, cities.title FROM users JOIN cities ON cities.id=users.city_id');
        console.log('get users');
        res.json(users.rows);
    }
	
	async getUser(req, res) {
		const email = req.params.email;
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
		if (existingUser.rows.length > 0) {		
		console.log('User already exists:', existingUser.rows[0]);		
		res.json(existingUser.rows[0]);
		
		} else {			
			console.log('User not found');
			res.json(null);
		}
	}    

    async create(req, res) {
        const { userName, email, city_id } = req.body;
        const users = await db.query('INSERT INTO users (userName, email, city_id) values ($1, $2, $3) RETURNING *', [userName, email, city_id]);
        console.log('create', users.rows);
        if (!req.body) return res.sendStatus(400);
        res.json(users.rows);
    }

    async delete(req, res) {
        const id = req.params.id;
		const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [id]);
		
        if (orders.rows.length > 0) {
			// Есть связанные заказы, нельзя удалить пользователя
			console.log('Cannot delete user. Orders are associated with the user.');
			res.status(400).json({ error: 'Cannot delete user. Orders are associated with the user.' });
			
			} else {				
			const deletedUser = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
			console.log('Deleted user:', deletedUser.rows[0]);
			res.status(200).send();
		}
    }
}

module.exports = new UserController();