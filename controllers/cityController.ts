import { Request, Response } from 'express'
import prisma from '../prismaClient'

class CityController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const cities = await prisma.city.findMany()
            res.json(cities)
        } catch (error: unknown) {
            console.error('An error occurred while processing the request:', error)
            res.status(500).json({ error: 'An error occurred while processing the request.' })
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        const { newTitle } = req.body

        try {
            const city = await prisma.city.create({
                data: {
                    title: newTitle,
                },
            })

            res.json([city])
        } catch (error: unknown) {
            console.error('An error occurred while creating the city:', error)
            res.status(500).json({ error: 'An error occurred while creating the city.' })
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id)

        try {
            const [usersCount, masterCitiesCount] = await Promise.all([
                prisma.user.count({
                    where: {
                        cityId: id,
                    },
                }),
                prisma.masterCity.count({
                    where: {
                        cityId: id,
                    },
                }),
            ])

            if (usersCount > 0 || masterCitiesCount > 0) {
                console.log('Cannot delete city. Users or masters are associated with it.')
                res.status(400).json({ error: 'Cannot delete city. Users or masters are associated with it.' })
            } else {
                const city = await prisma.city.findUnique({
                    where: {
                        id,
                    },
                    select: {
                        id: true,
                    },
                })

                if (!city) {
                    res.status(404).json({ error: 'Resource not found' })
                    return
                }

                await prisma.city.delete({
                    where: {
                        id,
                    },
                })

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
            const city = await prisma.city.findUnique({
                where: {
                    id: Number(cityId),
                },
            })

            if (!city) {
                res.status(404).json({ error: 'Resource not found' })
                return
            }

            const updatedCity = await prisma.city.update({
                where: {
                    id: Number(cityId),
                },
                data: {
                    title: newTitle,
                },
            })

            res.json(updatedCity)
        } catch (error: unknown) {
            console.error('Error updating city:', error)
            res.status(500).json({ error: 'An error occurred while updating the city.' })
        }
    }
}

export default new CityController()
