import { Router } from 'express'

import cityController from '../controllers/cityController'

import { authMiddleware } from '../middleware/authMiddleware'
import { validatorMiddleware } from '../middleware/validatorMiddleware'
import { cityValidation } from '../middleware/cityValidation'

const cityRouter = Router()

/**
 * @openapi
 * /api/city:
 *   get:
 *     tags:
 *       - City
 *     summary: Get all cities
 *     description: Returns the list of cities from the database.
 *     responses:
 *       200:
 *         description: Cities retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Kyiv
 *       500:
 *         description: Server error.
 */
cityRouter.get('/', cityController.getAll)

/**
 * @openapi
 * /api/city/create:
 *   post:
 *     tags:
 *       - City
 *     summary: Create a city
 *     description: Creates a new city record. Requires authorization.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newTitle
 *             properties:
 *               newTitle:
 *                 type: string
 *                 example: Lviv
 *     responses:
 *       200:
 *         description: City created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   title:
 *                     type: string
 *                     example: Lviv
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
cityRouter.post(
    '/create',
    authMiddleware,
    cityValidation.createCityValidation,
    validatorMiddleware,
    cityController.create
)

cityRouter.delete(
    '/delete/:id',
    authMiddleware,
    cityValidation.deleteCityValidation,
    validatorMiddleware,
    cityController.delete
)

cityRouter.put(
    '/update',
    authMiddleware,
    cityValidation.updateCityValidation,
    validatorMiddleware,
    cityController.update
)

export default cityRouter
