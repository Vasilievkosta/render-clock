import { Request, Response } from 'express'
import prisma from '../prismaClient'
import sendController from './sendController'

function toNumber(value: unknown): number {
    return Number(value)
}

class OrderController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const [orders, users, cities, masters] = await Promise.all([
                prisma.order.findMany({
                    select: {
                        id: true,
                        date: true,
                        time: true,
                        duration: true,
                        userId: true,
                        masterId: true,
                    },
                }),
                prisma.user.findMany({
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        cityId: true,
                    },
                }),
                prisma.city.findMany({
                    select: {
                        id: true,
                        title: true,
                    },
                }),
                prisma.master.findMany({
                    select: {
                        id: true,
                        name: true,
                    },
                }),
            ])

            const usersMap = new Map(users.map((user) => [user.id, user]))
            const citiesMap = new Map(cities.map((city) => [city.id, city]))
            const mastersMap = new Map(masters.map((master) => [master.id, master]))

            const formattedOrders = orders
                .filter((order) => {
                    if (order.userId === null || order.masterId === null) {
                        return false
                    }

                    const user = usersMap.get(order.userId)
                    if (!user || user.cityId === null) {
                        return false
                    }

                    return citiesMap.has(user.cityId) && mastersMap.has(order.masterId)
                })
                .map((order) => {
                    const user = usersMap.get(order.userId!)
                    const city = user?.cityId !== null && user?.cityId !== undefined ? citiesMap.get(user.cityId) : undefined
                    const master = mastersMap.get(order.masterId!)

                    return {
                        id: order.id,
                        date: order.date,
                        time: order.time,
                        duration: order.duration,
                        user: {
                            id: user!.id,
                            name: user!.userName,
                            email: user!.email,
                        },
                        city: {
                            id: city!.id,
                            title: city!.title,
                        },
                        master: {
                            name: master!.name,
                        },
                    }
                })

            res.json(formattedOrders)
        } catch (error: unknown) {
            console.error('Error fetching orders:', error)
            res.status(500).json({ error: 'An error occurred while fetching orders.' })
        }
    }

    async createAndSend(req: Request, res: Response): Promise<void> {
        try {
            const { date, time, duration, city_id, master_id, userName, email } = req.body
            const parsedCityId = toNumber(city_id)
            const parsedMasterId = toNumber(master_id)
            const parsedDuration = toNumber(duration)

            const order = await prisma.$transaction(async (tx) => {
                const existingUser = await tx.user.findFirst({
                    where: {
                        email,
                    },
                })

                const user = existingUser
                    ? await tx.user.update({
                          where: {
                              id: existingUser.id,
                          },
                          data: {
                              userName,
                              cityId: parsedCityId,
                          },
                      })
                    : await tx.user.create({
                          data: {
                              userName,
                              email,
                              cityId: parsedCityId,
                          },
                      })

                return tx.order.create({
                    data: {
                        date,
                        time,
                        duration: parsedDuration,
                        userId: user.id,
                        masterId: parsedMasterId,
                    },
                })
            })

            sendController.sendLetter(userName, email, date, time)
            res.json({ status: 'Success', order })
        } catch (error: unknown) {
            console.error('Error creating order:', error)
            res.status(500).json({ error: 'An error occurred while creating the order.' })
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { orderId, date, time, duration, user_id, master_id } = req.body
            const parsedOrderId = toNumber(orderId)
            const parsedDuration = toNumber(duration)
            const parsedUserId = toNumber(user_id)
            const parsedMasterId = toNumber(master_id)

            const order = await prisma.order.findUnique({
                where: {
                    id: parsedOrderId,
                },
                select: {
                    id: true,
                },
            })

            if (!order) {
                res.status(404).json({ error: 'Order not found.' })
                return
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: parsedOrderId,
                },
                data: {
                    date,
                    time,
                    duration: parsedDuration,
                    userId: parsedUserId,
                    masterId: parsedMasterId,
                },
            })

            res.json({
                id: updatedOrder.id,
                date: updatedOrder.date,
                time: updatedOrder.time,
                duration: updatedOrder.duration,
                user_id: updatedOrder.userId,
                master_id: updatedOrder.masterId,
            })
        } catch (error: unknown) {
            console.error('Error updating order:', error)
            res.status(500).json({ error: 'An error occurred while updating the order.' })
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const id = toNumber(req.params.id)

        try {
            const order = await prisma.order.findUnique({
                where: {
                    id,
                },
            })

            if (!order) {
                res.status(404).json({ error: 'Order not found.' })
                return
            }

            const deletedOrder = await prisma.order.delete({
                where: {
                    id,
                },
            })

            res.json({
                id: deletedOrder.id,
                date: deletedOrder.date,
                time: deletedOrder.time,
                duration: deletedOrder.duration,
                user_id: deletedOrder.userId,
                master_id: deletedOrder.masterId,
            })
        } catch (error: unknown) {
            console.error('Error deleting order:', error)
            res.status(500).json({ error: 'An error occurred while deleting the order.' })
        }
    }
}

export default new OrderController()
