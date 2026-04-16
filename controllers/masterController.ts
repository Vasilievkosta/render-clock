import { Request, Response } from 'express'
import prisma from '../prismaClient'

function hours(h: string): number {
    return parseInt(h, 10)
}

function findMasters(startOrder: string, durationOrder: number, startMaster: string, durationMaster: number): boolean {
    const result =
        hours(startOrder) + durationOrder <= hours(startMaster) ||
        hours(startOrder) >= hours(startMaster) + durationMaster
    return !result
}

type MasterRow = {
    id: number
    name: string
    rating_id: number | null
}

class MasterController {
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const masters = await prisma.master.findMany({
                select: {
                    name: true,
                    masterCities: {
                        select: {
                            city: {
                                select: {
                                    title: true,
                                },
                            },
                        },
                    },
                },
            })

            const result = masters.flatMap((master) =>
                master.masterCities.map((masterCity) => ({
                    master_name: master.name,
                    city_title: masterCity.city.title,
                }))
            )

            res.json(result)
        } catch (error: unknown) {
            console.error('Error fetching masters:', error)
            res.status(500).json({ error: 'An error occurred while fetching masters.' })
        }
    }

    async getRatings(req: Request, res: Response): Promise<void> {
        try {
            const ratings = await prisma.rating.findMany()
            res.json(ratings)
        } catch (error: unknown) {
            console.error('Error fetching ratings:', error)
            res.status(500).json({ error: 'An error occurred while fetching ratings.' })
        }
    }

    async getMasterOfCities(req: Request, res: Response): Promise<void> {
        try {
            const masters = await prisma.master.findMany({
                select: {
                    id: true,
                    name: true,
                    rating: {
                        select: {
                            id: true,
                            rating: true,
                        },
                    },
                    masterCities: {
                        select: {
                            city: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
            })

            if (masters.length === 0) {
                res.status(404).json({ error: 'РњР°СЃС‚РµСЂР° РЅРµ РЅР°Р№РґРµРЅС‹' })
                return
            }

            const result = masters.map((master) => ({
                master_id: master.id,
                master_name: master.name,
                rating_id: master.rating?.id ?? null,
                master_rating: master.rating?.rating ?? null,
                cities: master.masterCities.map((masterCity) => ({
                    id: masterCity.city.id,
                    title: masterCity.city.title,
                })),
            }))

            res.json(result)
        } catch (error: unknown) {
            console.error('РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РјР°СЃС‚РµСЂРѕРІ:', error)
            res.status(500).json({ error: 'РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РјР°СЃС‚РµСЂРѕРІ' })
        }
    }

    async onDateAndTime(req: Request, res: Response): Promise<void> {
        const { cityId, date, time, duration } = req.body

        try {
            const [masters, ordersByDate] = await Promise.all([
                prisma.master.findMany({
                    where: {
                        masterCities: {
                            some: {
                                cityId: Number(cityId),
                            },
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                        ratingId: true,
                    },
                }),
                prisma.order.findMany({
                    where: {
                        date,
                    },
                    select: {
                        time: true,
                        duration: true,
                        master: {
                            select: {
                                name: true,
                            },
                        },
                    },
                }),
            ])

            const masterRows: MasterRow[] = masters.map((master) => ({
                id: master.id,
                name: master.name,
                rating_id: master.ratingId,
            }))

            if (ordersByDate.length === 0) {
                res.json(masterRows)
                return
            }

            const busyMasters = ordersByDate
                .filter(
                    (order) =>
                        order.time &&
                        order.master?.name &&
                        findMasters(time, duration, order.time, order.duration ?? 0)
                )
                .map((order) => order.master!.name)

            const filteredMasters = masterRows.filter((master) => !busyMasters.includes(master.name))
            res.json(filteredMasters)
        } catch (error: unknown) {
            console.error('An error occurred while processing the request:', error)
            res.status(500).json({ error: 'An error occurred while processing the request.' })
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        const { newName, arr, rating_id } = req.body

        try {
            const master = await prisma.$transaction(async (tx) => {
                const createdMaster = await tx.master.create({
                    data: {
                        name: newName,
                        ratingId: rating_id,
                    },
                })

                if (Array.isArray(arr) && arr.length > 0) {
                    await tx.masterCity.createMany({
                        data: arr.map((cityId: number) => ({
                            masterId: createdMaster.id,
                            cityId,
                        })),
                    })
                }

                return createdMaster
            })

            res.json([
                {
                    id: master.id,
                    name: master.name,
                    rating_id: master.ratingId,
                },
            ])
        } catch (error: unknown) {
            console.error('An error occurred while creating the master:', error)
            res.status(500).json({ error: 'An error occurred while creating the master.' })
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        const masterId = Number(req.params.id)

        try {
            const ordersCount = await prisma.order.count({
                where: {
                    masterId,
                },
            })

            if (ordersCount > 0) {
                console.log('Cannot delete master. Orders are associated with the master.')
                res.status(400).json({ error: 'Cannot delete master. Orders are associated with the master.' })
                return
            }

            const master = await prisma.master.findUnique({
                where: {
                    id: masterId,
                },
                select: {
                    id: true,
                },
            })

            if (!master) {
                res.status(404).json({ error: 'Resource not found' })
                return
            }

            await prisma.$transaction([
                prisma.masterCity.deleteMany({
                    where: {
                        masterId,
                    },
                }),
                prisma.master.delete({
                    where: {
                        id: masterId,
                    },
                }),
            ])

            res.sendStatus(204)
        } catch (error: unknown) {
            console.error('Error deleting master:', error)
            res.status(500).json({ error: 'An error occurred while deleting the master.' })
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const { masterId, newName, ratingId, arr } = req.body
        const parsedMasterId = Number(masterId)

        try {
            const master = await prisma.master.findUnique({
                where: {
                    id: parsedMasterId,
                },
            })

            if (!master) {
                res.status(404).json({ error: 'Resource not found' })
                return
            }

            const updatedMaster = await prisma.$transaction(async (tx) => {
                await tx.masterCity.deleteMany({
                    where: {
                        masterId: parsedMasterId,
                    },
                })

                if (Array.isArray(arr) && arr.length > 0) {
                    await tx.masterCity.createMany({
                        data: arr.map((cityId: number) => ({
                            masterId: parsedMasterId,
                            cityId,
                        })),
                    })
                }

                return tx.master.update({
                    where: {
                        id: parsedMasterId,
                    },
                    data: {
                        name: newName,
                        ratingId,
                    },
                })
            })

            res.json({
                id: updatedMaster.id,
                name: updatedMaster.name,
                rating_id: updatedMaster.ratingId,
            })
        } catch (error: unknown) {
            console.error('Error updating master:', error)
            res.status(500).json({ error: 'An error occurred while updating the master.' })
        }
    }
}

export default new MasterController()
