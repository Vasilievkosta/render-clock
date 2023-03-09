const db = require('../db');

class UserController {

    async getAll(req, res) {
        const users = await db.query('SELECT users.id, users.userName, users.email, users.time, city.title FROM users JOIN city ON city.id=users.city_id');
        console.log(users.rows);
        res.json(users.rows);
    }

    async create(req, res) {
        const { userName, email, city_id, time } = req.body;
        const users = await db.query('INSERT INTO users (userName, email, city_id, time) values ($1, $2, $3, $4) RETURNING *', [userName, email, city_id, time]);
        console.log(users.rows);
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