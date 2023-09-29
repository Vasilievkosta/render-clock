const db = require('../db')

class UserController {
    async getAll(req, res) {
        try {
            const users = await db.query(
                'SELECT users.id, users.userName, users.email, users.city_id, cities.title FROM users JOIN cities ON cities.id=users.city_id'
            )
            res.json(users.rows)
        } catch (error) {
            console.error('Error fetching users:', error.message)
            res.status(500).json({ error: 'An error occurred while fetching users.' })
        }
    }    
	
	async create(req, res) {
		const { userName, email, city_id } = req.body;

    try {        
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email])

        if (existingUser.rows.length > 0) {           
            const updatedUser = await db.query(
                'UPDATE users SET userName = $1, city_id = $2 WHERE email = $3 RETURNING *',
                [userName, city_id, email]
            )
            res.json(updatedUser.rows[0])
			
        } else {            
            const newUser = await db.query(
                'INSERT INTO users (userName, email, city_id) VALUES ($1, $2, $3) RETURNING *',
                [userName, email, city_id]
            )
            res.json(newUser.rows[0])
        }
    } catch (error) {
        console.error('An error occurred while processing the request:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' })
    }
}

    async delete(req, res) {
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
        } catch (error) {
            console.error('Error deleting user:', error)
            res.status(500).json({ error: 'An error occurred while deleting the user.' })
        }
    }

    async update(req, res) {
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
        } catch (error) {
            console.error('Error updating user:', error)
            res.status(500).json({ error: 'An error occurred while updating the user.' })
        }
    }    
}

module.exports = new UserController()
