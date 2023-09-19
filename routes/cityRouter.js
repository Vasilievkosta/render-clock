const Router = require('express')
const router = new Router()
const cityController = require('../controllers/cityController')

const validatorMiddleware = require('../middleware/validatorMiddleware')
const cityValidation = require('../middleware/cityValidation')

router.get('/', cityController.getAll)

router.post('/create', cityValidation.createCityValidation, validatorMiddleware, cityController.create)

router.delete('/delete/:id', cityValidation.deleteCityValidation, validatorMiddleware, cityController.delete)

router.put('/update', cityValidation.updateCityValidation, validatorMiddleware, cityController.update)

module.exports = router
