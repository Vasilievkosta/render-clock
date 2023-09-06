const db = require('../db')

class CityController {
    async getAll(req, res) {
        const cities = await db.query('SELECT * FROM cities')        
        res.json(cities.rows)
    }

    async create(req, res) {
        const { title } = req.body

        if (!title) {
            return res.status(400).json({ error: 'Invalid request data. Please provide required field.' })
        }

        const city = await db.query('INSERT INTO cities (title) values ($1) RETURNING *', [title])
        console.log('create', city.rows)
        if (!req.body) return res.sendStatus(400)
        res.json(city.rows)
    }

    async delete(req, res) {
        const id = req.params.id

        const users = await db.query('SELECT * FROM users WHERE city_id = $1', [id])
        const master_id = await db.query('SELECT * FROM master_cities WHERE city_id = $1', [id])

        if (users.rows.length > 0 || master_id.rows.length > 0) {
            // // Есть пользователи или мастера, связанные с городом
            console.log('Cannot delete city. Users or masters are associated with it.')
            res.status(400).json({ error: 'Cannot delete city. Users or masters are associated with it.' })
        } else {
            const city = await db.query('SELECT cities.title FROM cities WHERE id = $1', [id])
            await db.query('DELETE FROM cities WHERE id = $1', [id])
            console.log('delete', city.rows)
            res.status(200).send()
        }
    }

    async update(req, res) {
        const { cityId, newTitle } = req.body

        if (!cityId || !newTitle) {
            return res.status(400).json({ error: 'Invalid request data. Please provide all required fields.' })
        }

        try {
            // Сначала получаем город по city_id
            const city = await db.query('SELECT * FROM cities WHERE id = $1', [cityId])

            // Проверяем, существует ли город с таким id
            if (city.rows.length === 0) {
                return res.status(404).json({ error: 'Resource not found' })
            }

            // Обновляем название города
            const updatedCity = await db.query('UPDATE cities SET title = $1 WHERE id = $2 RETURNING *', [
                newTitle,
                cityId,
            ])

            // Отправляем обновленный город в ответе
            res.json(updatedCity.rows[0])
        } catch (error) {
            console.error('Error updating city:', error.message)
            res.status(500).json({ error: 'An error occurred while updating the city.' })
        }
    }
}

module.exports = new CityController()
