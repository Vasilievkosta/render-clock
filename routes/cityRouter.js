const Router = require('express')
const router = new Router()
const cityController = require('../controllers/cityController')

const authMiddleware = require('../middleware/authMiddleware')
const validatorMiddleware = require('../middleware/validatorMiddleware')
const cityValidation = require('../middleware/cityValidation')

router.get('/', cityController.getAll)

router.post('/create', authMiddleware, cityValidation.createCityValidation, validatorMiddleware, cityController.create)

router.delete('/delete/:id', authMiddleware, cityValidation.deleteCityValidation, validatorMiddleware, cityController.delete)

router.put('/update', authMiddleware, cityValidation.updateCityValidation, validatorMiddleware, cityController.update)

module.exports = router
