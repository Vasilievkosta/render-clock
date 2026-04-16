import { Request, Response } from 'express'
import prisma from '../prismaClient'

function toNumber(value: unknown): number {
    return Number(value)
}

class UserController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const [users, cities] = await Promise.all([
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
            ])

            const citiesMap = new Map(cities.map((city) => [city.id, city.title]))

            const result = users
                .filter((user) => user.cityId !== null && citiesMap.has(user.cityId))
                .map((user) => ({
                    id: user.id,
                    username: user.userName,
                    email: user.email,
                    city_id: user.cityId,
                    title: citiesMap.get(user.cityId!)!,
                }))

            res.json(result)
        } catch (error: unknown) {
            console.error('Error fetching users:', error)
            res.status(500).json({ error: 'An error occurred while fetching users.' })
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const id = toNumber(req.params.id)

        try {
            const [ordersCount, user] = await Promise.all([
                prisma.order.count({
                    where: {
                        userId: id,
                    },
                }),
                prisma.user.findUnique({
                    where: {
                        id,
                    },
                    select: {
                        id: true,
                    },
                }),
            ])

            if (ordersCount > 0) {
                console.log('Cannot delete user. Orders are associated with the user.')
                res.status(400).json({ error: 'Cannot delete user. Orders are associated with the user.' })
                return
            }

            if (!user) {
                res.status(404).json({ error: 'User not found' })
                return
            }

            await prisma.user.delete({
                where: {
                    id,
                },
            })

            res.status(200).send()
        } catch (error: unknown) {
            console.error('Error deleting user:', error)
            res.status(500).json({ error: 'An error occurred while deleting the user.' })
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id, userName, email, city_id } = req.body
        const parsedId = toNumber(id)
        const parsedCityId = toNumber(city_id)

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: parsedId,
                },
            })

            if (!user) {
                res.status(404).json({ error: 'User not found' })
                return
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: parsedId,
                },
                data: {
                    userName,
                    email,
                    cityId: parsedCityId,
                },
            })

            res.json({
                id: updatedUser.id,
                username: updatedUser.userName,
                email: updatedUser.email,
                city_id: updatedUser.cityId,
            })
        } catch (error: unknown) {
            console.error('Error updating user:', error)
            res.status(500).json({ error: 'An error occurred while updating the user.' })
        }
    }
}

export default new UserController()
