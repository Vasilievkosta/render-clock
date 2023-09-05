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
        const masters = await db.query(
            'SELECT m.name AS master_name, c.title AS city_title FROM masters m JOIN master_cities mc ON m.id = mc.master_id JOIN cities c ON mc.city_id = c.id'
        )
        console.table('get masters')
        res.json(masters.rows)
    }

    async getRatings(req, res) {
        const ratings = await db.query('SELECT * FROM ratings')
        res.json(ratings.rows)
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
                // Если мастерa не найдены, вернуть статус 404 и сообщение об ошибке
                return res.status(404).json({ error: 'Мастеры не найдены' })
            }

            res.json(masters.rows)
        } catch (error) {
            // Если произошла ошибка при запросе к базе данных, вернуть статус 500 и сообщение об ошибке
            console.error('Ошибка при получении мастеров:', error)
            res.status(500).json({ error: 'Произошла ошибка при получении мастеров' })
        }
    }

    async onDateAndTime(req, res) {
        const { cityId, date, time, duration } = req.body

        if (!cityId || !date || !time || !duration) {
            return res.status(400).json({ error: 'Invalid request data. Please provide all required fields.' })
        }
        // поиск всех мастеров в городе по cityId
        const masters = await db.query(
            'SELECT m.* FROM masters m JOIN master_cities mc ON mc.master_id = m.id JOIN cities c ON c.id = mc.city_id WHERE c.id = $1',
            [cityId]
        )

        console.log(cityId, date, time, duration)
        // все заказы на определенную дату
        const ordersByDate = await db.query(
            'SELECT o.id, o.date, o.time, o.duration, u.userName AS user_name, m.name AS master_name, c.title AS city_name FROM orders o JOIN users u ON o.user_id = u.id JOIN masters m ON o.master_id = m.id JOIN cities c ON u.city_id = c.id WHERE o.date = $1;',
            [date]
        )

        if (ordersByDate.rows.length === 0) {
            console.table('get masters of the city')
            res.json(masters.rows)
        } else {
            // заказы на определенную дату нужно проверить по времени
            // console.log(ordersByDate.rows)
            let bizyMasters = ordersByDate.rows
                .filter((o) => findMasters(time, duration, o.time, o.duration))
                .map((b) => b.master_name)            

            //исключаем из всех мастеров в городе занятых на данное время
            const filteredMasters = masters.rows.filter((obj) => !bizyMasters.includes(obj.name))
            res.json(filteredMasters)
        }
    }

    async create(req, res) {
        const { name, arr, rating_id } = req.body

        if (!name || !Array.isArray(arr) || !rating_id) {
            return res.status(400).json({ error: 'Invalid request data. Please provide all required fields.' })
        }
        try {
            const master = await db.query('INSERT INTO masters (name, rating_id) VALUES ($1, $2) RETURNING *', [
                name,
                rating_id,
            ])
            const masterId = master.rows[0].id

            for (const cityId of arr) {
                await db.query('INSERT INTO master_cities (master_id, city_id) VALUES ($1, $2)', [masterId, cityId])
            }
            res.json(master.rows)
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }

    async delete(req, res) {
        const masterId = req.params.id
        console.log('masterId', masterId)

        try {
            const orders = await db.query('SELECT * FROM orders WHERE master_id = $1', [masterId])

            if (orders.rows.length > 0) {
                console.log(orders.rows)
                // Есть связанные заказы, нельзя удалить мастера
                console.log('Cannot delete master. Orders are associated with the master.')
                res.status(400).json({ error: 'Cannot delete master. Orders are associated with the master.' })
            } else {
                // Удаляем связи мастера из промежуточной таблицы
                await db.query('DELETE FROM master_cities WHERE master_id = $1', [masterId])

                // Затем удаляем саму запись мастера
                let data = await db.query('DELETE FROM masters WHERE id = $1', [masterId])
                console.log(data)
                res.sendStatus(204)
            }
        } catch (error) {
            console.error(error)
            res.sendStatus(500)
        }
    }

    async update(req, res) {
        const { masterId, newName, ratingId, arr } = req.body

        if (!masterId || !newName || !ratingId || !Array.isArray(arr)) {
            return res.status(400).json({ error: 'Invalid request data. Please provide all required fields.' })
        }

        try {
            // Сначала получаем мастера по masterId
            const master = await db.query('SELECT * FROM masters WHERE id = $1', [masterId])

            // Проверяем, существует ли мастер с таким id
            if (master.rows.length === 0) {
                return res.status(404).json({ error: 'Resource not found' })
            }

            // Удаляем связи мастера из промежуточной таблицы
            await db.query('DELETE FROM master_cities WHERE master_id = $1', [masterId])

            // Создаем новые связи из массива arr id городов
            for (const cityId of arr) {
                await db.query('INSERT INTO master_cities (master_id, city_id) VALUES ($1, $2)', [masterId, cityId])
            }
            // Обновляем имя мастера и его рейтинг
            const updatedMaster = await db.query(
                'UPDATE masters SET name = $1, rating_id = $2 WHERE id = $3 RETURNING *',
                [newName, ratingId, masterId]
            )

            // Отправляем обновленного мастера в ответе
            res.json(updatedMaster.rows[0])
        } catch (error) {
            console.error('Error updating master:', error.message)
            res.status(500).json({ error: 'An error occurred while updating the master.' })
        }
    }
}

module.exports = new MasterController()
