const db = require('../db');

class MasterController {

    async getAll(req, res) {
        const masters = await db.query('SELECT master.id, master.name, city.title FROM master JOIN city ON city.id=master.city_id');
        console.table('get masters');
        res.json(masters.rows);
    }

    async create(req, res) {
        const { name, city_id } = req.body;
        const master = await db.query('INSERT INTO master (name, city_id) values ($1, $2) RETURNING *', [name, city_id]);
        console.log('create', master.rows);
        if (!req.body) return res.sendStatus(400);
        res.json(master.rows);
    }

    async delete(req, res) {
        const id = req.params.id;
        const master = await db.query('SELECT master.name FROM master WHERE id = $1', [id]);
        await db.query('DELETE FROM master WHERE id = $1', [id]);
        console.log('delete', master.rows);
        res.json(master.rows);
    }

}

module.exports = new MasterController();