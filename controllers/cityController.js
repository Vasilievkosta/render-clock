const db = require('../db');

class CityController {

    async getAll(req, res) {
        const cities = await db.query('SELECT * FROM city');
        console.log(cities.rows);
        res.json(cities.rows);
    }

    async create(req, res) {
        const { title } = req.body;
        const city = await db.query('INSERT INTO city (title) values ($1) RETURNING *', [title]);
        console.log(city.rows);
        if (!req.body) return res.sendStatus(400);
        res.json(city.rows);
    }
	
	async delete(req, res) {
        const id = req.params.id;
        const city = await db.query('SELECT city.title FROM city WHERE id = $1', [id]);
        await db.query('DELETE FROM city WHERE id = $1', [id]);
        console.log('delete', city.rows);
        res.json(city.rows);
    }

}

module.exports = new CityController();