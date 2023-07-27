const db = require('../db');

class CityController {

    async getAll(req, res) {
        const cities = await db.query('SELECT * FROM cities');
        console.log('get cities');
        res.json(cities.rows);
    }

    async create(req, res) {
        const { title } = req.body;
        const city = await db.query('INSERT INTO cities (title) values ($1) RETURNING *', [title]);
        console.log('create', city.rows);
        if (!req.body) return res.sendStatus(400);
        res.json(city.rows);
    }

    async delete(req, res) {
        const id = req.params.id;
		
		const users = await db.query('SELECT * FROM users WHERE city_id = $1', [id]);
		const master_id = await db.query('SELECT * FROM master_cities WHERE city_id = $1', [id]);
		
		if (users.rows.length > 0 || master_id.rows.length > 0) {
		// // Есть пользователи или мастера, связанные с городом
		console.log('Cannot delete city. Users or masters are associated with it.');		
		res.status(400).json({ error: 'Cannot delete city. Users or masters are associated with it.' });
		} else {
			const city = await db.query('SELECT cities.title FROM cities WHERE id = $1', [id]);
			await db.query('DELETE FROM cities WHERE id = $1', [id]);
			console.log('delete', city.rows);
			res.status(200).send();
		}
    }

}

module.exports = new CityController();
		