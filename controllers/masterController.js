const db = require('../db');

class MasterController {

    async getAll(req, res) {
        const masters = await db.query('SELECT m.name AS master_name, c.title AS city_title FROM masters m JOIN master_cities mc ON m.id = mc.master_id JOIN cities c ON mc.city_id = c.id');
        console.table('get masters');		
        res.json(masters.rows);
    }

    async create(req, res) {
        const { name, arr } = req.body;
		try {
			const master = await db.query('INSERT INTO masters (name) VALUES ($1) RETURNING *', [name]);
			const masterId = master.rows[0].id;

			for (const cityId of arr) {
				await db.query('INSERT INTO master_cities (master_id, city_id) VALUES ($1, $2)', [masterId, cityId]);
			}
			res.json(master.rows);
			
		} catch (error) {
			console.error(error);
			res.sendStatus(500);
		}
    }

    async delete(req, res) {
        const masterName = req.params.name;
		console.log('masterName ',masterName)
		try {
			// Находим идентификатор мастера на основе имени
			const master = await db.query('SELECT id FROM masters WHERE name = $1', [masterName]);
			console.log('master ',master.rows.length)
			if (master.rows.length === 0) {
				return res.sendStatus(404);
			}

			const masterId = master.rows[0].id;
			console.log('masterId ', typeof masterId)
			// Удаляем связи мастера из промежуточной таблицы
			await db.query('DELETE FROM master_cities WHERE master_id = $1', [masterId]);

			// Затем удаляем саму запись мастера
			let data = await db.query('DELETE FROM masters WHERE id = $1', [masterId]);
			console.log(data)
			res.sendStatus(204);
			
		} catch (error) {
			console.error(error);
			res.sendStatus(500);
		}    
    }
}

module.exports = new MasterController();