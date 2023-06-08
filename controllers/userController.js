const db = require('../db');

class UserController {

    async getAll(req, res) {
        const users = await db.query('SELECT users.id, users.userName, users.email, users.date, users.time, cities.title FROM users JOIN cities ON cities.id=users.city_id');
        console.log('get users');
        res.json(users.rows);
    }

    async create(req, res) {
        const { userName, email, city_id, date, time } = req.body;
        const users = await db.query('INSERT INTO users (userName, email, city_id, date, time) values ($1, $2, $3, $4, $5) RETURNING *', [userName, email, city_id, date, time]);
        console.log('create', users.rows);
        if (!req.body) return res.sendStatus(400);
        res.json(users.rows);
    }

    async delete(req, res) {
        const id = req.params.id;
        const users = await db.query('SELECT users.userName FROM users WHERE id = $1', [id]);
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        console.log('delete', users.rows);
        res.json(users.rows);
    }

}

module.exports = new UserController();