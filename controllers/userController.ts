import { Request, Response } from 'express'
import db from '../db'

class UserController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await db.query(
                'SELECT users.id, users.userName, users.email, users.city_id, cities.title FROM users JOIN cities ON cities.id=users.city_id'
            )
            res.json(users.rows)
        } catch (error: any) {
            console.error('Error fetching users:', error.message)
            res.status(500).json({ error: 'An error occurred while fetching users.' })
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const id = req.params.id

        try {
            const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [id])

            if (orders.rows.length > 0) {
                console.log('Cannot delete user. Orders are associated with the user.')
                res.status(400).json({ error: 'Cannot delete user. Orders are associated with the user.' })
            } else {
                const deletedUser = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
                res.status(200).send()
            }
        } catch (error: unknown) {
            console.error('Error deleting user:', error)
            res.status(500).json({ error: 'An error occurred while deleting the user.' })
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id, userName, email, city_id } = req.body

        try {
            const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
            if (user.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' })
            }

            const updatedUser = await db.query(
                'UPDATE users SET userName = $1, email = $2, city_id = $3 WHERE id = $4 RETURNING *',
                [userName, email, city_id, id]
            )

            res.json(updatedUser.rows[0])
        } catch (error: unknown) {
            console.error('Error updating user:', error)
            res.status(500).json({ error: 'An error occurred while updating the user.' })
        }
    }
}

export default new UserController()
