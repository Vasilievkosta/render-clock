import { Request, Response } from 'express'
import db from '../db'
const { body, validationResult } = require('express-validator')

class CityController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const cities = await db.query('SELECT * FROM cities')
            res.json(cities.rows)
        } catch (error: unknown) {
            console.error('An error occurred while processing the request:', error)
            res.status(500).json({ error: 'An error occurred while processing the request.' })
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        const { newTitle } = req.body

        try {
            const city = await db.query('INSERT INTO cities (title) values ($1) RETURNING *', [newTitle])
            res.json(city.rows)
        } catch (error: unknown) {
            console.error('An error occurred while creating the city:', error)
            res.status(500).json({ error: 'An error occurred while creating the city.' })
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id

        try {
            const users = await db.query('SELECT * FROM users WHERE city_id = $1', [id])
            const master_id = await db.query('SELECT * FROM master_cities WHERE city_id = $1', [id])

            if (users.rows.length > 0 || master_id.rows.length > 0) {
                console.log('Cannot delete city. Users or masters are associated with it.')
                res.status(400).json({ error: 'Cannot delete city. Users or masters are associated with it.' })
            } else {
                const city = await db.query('SELECT cities.title FROM cities WHERE id = $1', [id])
                await db.query('DELETE FROM cities WHERE id = $1', [id])
                res.status(200).send()
            }
        } catch (error: unknown) {
            console.error('Error deleting city:', error)
            res.status(500).json({ error: 'An error occurred while deleting the city.' })
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { cityId, newTitle } = req.body

        try {
            const city = await db.query('SELECT * FROM cities WHERE id = $1', [cityId])

            if (city.rows.length === 0) {
                return res.status(404).json({ error: 'Resource not found' })
            }

            const updatedCity = await db.query('UPDATE cities SET title = $1 WHERE id = $2 RETURNING *', [
                newTitle,
                cityId,
            ])
            res.json(updatedCity.rows[0])
        } catch (error: any) {
            console.error('Error updating city:', error.message)
            res.status(500).json({ error: 'An error occurred while updating the city.' })
        }
    }
}

export default new CityController()
