const db = require('../db')
const sendController = require('../controllers/sendController')

class OrderController {
    async getAll(req, res) {
        try {
        const ordersData = await db.query(`
            SELECT o.id, o.date, o.time, o.duration, u.id AS user_id, u.userName AS user_name, u.email, c.title AS city_title, c.id AS city_id, m.name AS master_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN cities c ON u.city_id = c.id
            JOIN masters m ON o.master_id = m.id
        `)
        
        const formattedOrders = ordersData.rows.map(order => ({
            id: order.id,
            date: order.date,
            time: order.time,
			duration: order.duration,
            user: {
                id: order.user_id,
                name: order.user_name,
                email: order.email
            },
            city: {
				id: order.city_id,
                title: order.city_title
            },
            master: {
                name: order.master_name
            }
        }))
        
        res.json(formattedOrders)
		
		} catch (error) {
			console.error('Error fetching orders:', error.message)
			res.status(500).json({ error: 'An error occurred while fetching orders.' })
		}
    }    
	
	async createAndSend(req, res) {
        try {
            const { date, time, duration, user_id, master_id, userName, email } = req.body
			            
			const orders = await db.query(
                'INSERT INTO orders (date, time, duration, user_id, master_id) values ($1, $2, $3, $4, $5) RETURNING *',
                [date, time, duration, user_id, master_id]
            )			
			if (orders.rows.length > 0) {
				
				sendController.sendLetter(userName, email, date, time)				
				res.json({ status: 'Success', order: orders.rows[0] })
			
			} else {
				res.status(500).json({ error: 'An error occurred while creating the order.' });
			}		
			
        } catch (error) {
            console.error('Error creating order:', error.message)
            res.status(500).json({ error: 'An error occurred while creating the order.' })
        }
    }
	
	async update(req, res) {
		try {
			const { orderId, date, time, duration, user_id, master_id } = req.body			

			const updatedOrder = await db.query(
				'UPDATE orders SET date = $1, time = $2, duration = $3, user_id = $4, master_id = $5 WHERE id = $6 RETURNING *',
				[date, time, duration, user_id, master_id, orderId]
			)

			if (updatedOrder.rows.length === 0) {
				return res.status(404).json({ error: 'Order not found.' })
			}

			res.json(updatedOrder.rows[0])
						
		} catch (error) {
			console.error('Error updating order:', error.message)
			res.status(500).json({ error: 'An error occurred while updating the order.' })
		}
	}


    async delete(req, res) {
        const id = req.params.id

        try {
			const deleteOrder = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id])
			if (deleteOrder.rows.length === 0) {
				return res.status(404).json({ error: 'Order not found.' })
			}

        res.json(deleteOrder.rows[0])
		
		} catch (error) {
			console.error('Error deleting order:', error.message)
			res.status(500).json({ error: 'An error occurred while deleting the order.' })
		}
    }
}

module.exports = new OrderController()
