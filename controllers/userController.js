const db = require('../db')

class UserController {
    async getAll(req, res) {
        const users = await db.query(
            'SELECT users.id, users.userName, users.email, users.city_id, cities.title FROM users JOIN cities ON cities.id=users.city_id'
        )        
        res.json(users.rows)
    }

    async getUser(req, res) {
        const email = req.params.email		
		
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email])

        if (existingUser.rows.length > 0) {            
            res.json(existingUser.rows[0])
        } else {
            console.log('User not found')
            res.json(null)
        }		
    }

    async create(req, res) {
        const { userName, email, city_id } = req.body        

        const users = await db.query('INSERT INTO users (userName, email, city_id) values ($1, $2, $3) RETURNING *', [
            userName,
            email,
            city_id,
        ])
        
        res.json(users.rows)
    }

    async delete(req, res) {
        const id = req.params.id
        const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [id])

        if (orders.rows.length > 0) {
            // Есть связанные заказы, нельзя удалить пользователя
            console.log('Cannot delete user. Orders are associated with the user.')
            res.status(400).json({ error: 'Cannot delete user. Orders are associated with the user.' })
        } else {
            const deletedUser = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
            console.log('Deleted user:', deletedUser.rows[0])
            res.status(200).send()
        }
		
    }

    async update(req, res) {
        const { id, userName, email, city_id } = req.body        

        try {
            // Проверяем, существует ли пользователь с указанным id
            const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
            if (user.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' })
            }

            // Обновляем имя, адрес и id города пользователю
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
	
	async patchUserName(req, res) {
		const { id, userName } = req.body;	

		try {			
			const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);

			if (user.rows.length === 0) {
				return res.status(404).json({ error: 'User not found' });
			}
			
			const updatedUserName = await db.query(
				'UPDATE users SET userName = $1 WHERE id = $2 RETURNING *',
				[userName, id]
			);			
			
			res.json(updatedUserName.rows[0]);
			
		} catch (error) {
			console.error('Error updating user name:', error);
			res.status(500).json({ error: 'An error occurred while updating the user name.' });
		}
	}
}

module.exports = new UserController()
