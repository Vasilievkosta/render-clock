const db = require('../db')

function hours(h) {
    return parseInt(h, 10)
}

function findMasters(startOrder, durationOrder, startMaster, durationMaster) {
    let result =
        hours(startOrder) + durationOrder <= hours(startMaster) ||
        hours(startOrder) >= hours(startMaster) + durationMaster
    return !result
}

class MasterController {
    async getAll(req, res) {
        try {
            const masters = await db.query(
                'SELECT m.name AS master_name, c.title AS city_title FROM masters m JOIN master_cities mc ON m.id = mc.master_id JOIN cities c ON mc.city_id = c.id'
            )
            res.json(masters.rows)
        } catch (error) {
            console.error('Error fetching masters:', error.message)
            res.status(500).json({ error: 'An error occurred while fetching masters.' })
        }
    }

    async getRatings(req, res) {
        try {
            const ratings = await db.query('SELECT * FROM ratings')
            res.json(ratings.rows)
        } catch (error) {
            console.error('Error fetching ratings:', error.message)
            res.status(500).json({ error: 'An error occurred while fetching ratings.' })
        }
    }

    async getMasterOfCities(req, res) {
        try {
            const masters = await db.query(`
		SELECT m.id AS master_id, m.name AS master_name, 
			r.id AS rating_id, r.rating AS master_rating,
			json_agg(json_build_object('id', c.id, 'title', c.title)) AS cities
		FROM masters m
		JOIN master_cities mc ON m.id = mc.master_id
		JOIN cities c ON mc.city_id = c.id
		LEFT JOIN ratings r ON m.rating_id = r.id
		GROUP BY m.id, m.name, r.id, r.rating;
		`)
            if (masters.rows.length === 0) {
                return res.status(404).json({ error: 'Мастера не найдены' })
            }
            res.json(masters.rows)
        } catch (error) {
            console.error('Ошибка при получении мастеров:', error)
            res.status(500).json({ error: 'Произошла ошибка при получении мастеров' })
        }
    }

    async onDateAndTime(req, res) {
        const { cityId, date, time, duration } = req.body

        try {
            const masters = await db.query(
                'SELECT m.* FROM masters m JOIN master_cities mc ON mc.master_id = m.id JOIN cities c ON c.id = mc.city_id WHERE c.id = $1',
                [cityId]
            )

            const ordersByDate = await db.query(
                'SELECT o.id, o.date, o.time, o.duration, u.userName AS user_name, m.name AS master_name, c.title AS city_name FROM orders o JOIN users u ON o.user_id = u.id JOIN masters m ON o.master_id = m.id JOIN cities c ON u.city_id = c.id WHERE o.date = $1;',
                [date]
            )

            if (ordersByDate.rows.length === 0) {
                res.json(masters.rows)
            } else {
                let bizyMasters = ordersByDate.rows
                    .filter((o) => findMasters(time, duration, o.time, o.duration))
                    .map((b) => b.master_name)

                const filteredMasters = masters.rows.filter((obj) => !bizyMasters.includes(obj.name))
                res.json(filteredMasters)
            }
        } catch (error) {
            console.error('An error occurred while processing the request:', error)
            res.status(500).json({ error: 'An error occurred while processing the request.' })
        }
    }

    async create(req, res) {
        const { newName, arr, rating_id } = req.body

        try {
            const master = await db.query('INSERT INTO masters (name, rating_id) VALUES ($1, $2) RETURNING *', [
                newName,
                rating_id,
            ])
            const masterId = master.rows[0].id

            for (const cityId of arr) {
                await db.query('INSERT INTO master_cities (master_id, city_id) VALUES ($1, $2)', [masterId, cityId])
            }
            res.json(master.rows)
        } catch (error) {
            console.error('An error occurred while creating the master:', error)
            res.status(500).json({ error: 'An error occurred while creating the master.' })
        }
    }

    async delete(req, res) {
        const masterId = req.params.id

        try {
            const orders = await db.query('SELECT * FROM orders WHERE master_id = $1', [masterId])

            if (orders.rows.length > 0) {
                console.log('Cannot delete master. Orders are associated with the master.')
                res.status(400).json({ error: 'Cannot delete master. Orders are associated with the master.' })
            } else {
                await db.query('DELETE FROM master_cities WHERE master_id = $1', [masterId])

                let data = await db.query('DELETE FROM masters WHERE id = $1', [masterId])

                res.sendStatus(204)
            }
        } catch (error) {
            console.error('Error deleting master:', error)
            res.status(500).json({ error: 'An error occurred while deleting the master.' })
        }
    }

    async update(req, res) {
        const { masterId, newName, ratingId, arr } = req.body

        try {
            const master = await db.query('SELECT * FROM masters WHERE id = $1', [masterId])

            if (master.rows.length === 0) {
                return res.status(404).json({ error: 'Resource not found' })
            }

            await db.query('DELETE FROM master_cities WHERE master_id = $1', [masterId])

            for (const cityId of arr) {
                await db.query('INSERT INTO master_cities (master_id, city_id) VALUES ($1, $2)', [masterId, cityId])
            }

            const updatedMaster = await db.query(
                'UPDATE masters SET name = $1, rating_id = $2 WHERE id = $3 RETURNING *',
                [newName, ratingId, masterId]
            )

            res.json(updatedMaster.rows[0])
        } catch (error) {
            console.error('Error updating master:', error.message)
            res.status(500).json({ error: 'An error occurred while updating the master.' })
        }
    }
}

module.exports = new MasterController()
