const db = require('../db');

class OrderController {

    async getAll(req, res) {
        const orders = await db.query('SELECT o.date, o.time, u.userName AS user_name, m.name AS master_name, c.title AS city_name FROM orders o JOIN users u ON o.user_id = u.id JOIN masters m ON o.master_id = m.id JOIN cities c ON u.city_id = c.id;');
        res.json(orders.rows);
    }

    async create(req, res) {
        const { date, time, user_id, master_id } = req.body;
        const orders = await db.query('INSERT INTO orders (date, time, user_id, master_id) values ($1, $2, $3, $4) RETURNING *', [date, time, user_id, master_id]);
        
        if (!req.body) return res.sendStatus(400);
        res.json(orders.rows);
    }

    async delete(req, res) {
        const id = req.params.id;
        const orders = await db.query('SELECT orders.date FROM orders WHERE id = $1', [id]);
        await db.query('DELETE FROM orders WHERE id = $1', [id]);
        console.log('delete');
        res.json(orders.rows);
    }

}

module.exports = new OrderController();


