const db = require('../db');

function hours(h) {
	return parseInt(h, 10);
}

function findMasters(startOrder, durationOrder, startMaster, durationMaster) {
	let result = hours(startOrder) + durationOrder <= hours(startMaster) || hours(startOrder) >= hours(startMaster) + durationMaster;
	return !result;
}

class MasterController {

    async getAll(req, res) {
        const masters = await db.query('SELECT m.name AS master_name, c.title AS city_title FROM masters m JOIN master_cities mc ON m.id = mc.master_id JOIN cities c ON mc.city_id = c.id');
        console.table('get masters');		
        res.json(masters.rows);
    }	

	async onDateAndTime(req, res) {
		const { cityId, date, time, duration } = req.body;
		// поиск всех мастеров в городе по cityId
		const masters = await db.query('SELECT m.* FROM masters m JOIN master_cities mc ON mc.master_id = m.id JOIN cities c ON c.id = mc.city_id WHERE c.id = $1', [cityId]);		
		
		console.log(cityId, date, time, duration)
		// все заказы на определенную дату
		const ordersByDate = await db.query('SELECT o.id, o.date, o.time, o.duration, u.userName AS user_name, m.name AS master_name, c.title AS city_name FROM orders o JOIN users u ON o.user_id = u.id JOIN masters m ON o.master_id = m.id JOIN cities c ON u.city_id = c.id WHERE o.date = $1;', [date]);

		if (ordersByDate.rows.length === 0) {
			console.table('get masters of the city');		
			res.json(masters.rows);
		} else {
			// заказы на определенную дату нужно проверить по времени
			console.log(ordersByDate.rows);
			let bizyMasters = ordersByDate.rows
			.filter(o => findMasters(time, duration, o.time, o.duration))
			.map(b => b.master_name)
			console.log('bizyMasters', bizyMasters);
			
			//исключаем из всех мастеров в городе занятых на данное время
			const filteredMasters = masters.rows
			.filter(obj => !bizyMasters.includes(obj.name))
			console.log('filteredMasters', filteredMasters);
			res.json(filteredMasters);
		}		
		
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
			console.log(masterId)
			const orders = await db.query('SELECT * FROM orders WHERE master_id = $1', [masterId]);
			
			if (orders.rows.length > 0) {
				console.log(orders.rows)
			// Есть связанные заказы, нельзя удалить мастера
			console.log('Cannot delete master. Orders are associated with the master.');
			res.status(400).json({ error: 'Cannot delete master. Orders are associated with the master.' });
			
			} else {			
				// Удаляем связи мастера из промежуточной таблицы
				await db.query('DELETE FROM master_cities WHERE master_id = $1', [masterId]);

				// Затем удаляем саму запись мастера
				let data = await db.query('DELETE FROM masters WHERE id = $1', [masterId]);
				console.log(data)
				res.sendStatus(204);
			}
			
		} catch (error) {
			console.error(error);
			res.sendStatus(500);
		}    
    }
}

module.exports = new MasterController();

