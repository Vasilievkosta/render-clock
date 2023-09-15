const Router = require('express')
const router = new Router()
const cityController = require('../controllers/cityController')

const {body} = require('express-validator')

const validatorMiddleware = require('../middleware/validatorMiddleware')


const createCityValidation = [
    body('title').isString().trim()
	.isLength({min:3, max: 10})
	.withMessage('Title length should be from 3 to 10 symbols')
];


router.get('/', cityController.getAll)

router.post('/create', createCityValidation, validatorMiddleware, cityController.create)

router.delete('/delete/:id', cityController.delete)
router.put('/update', cityController.update)

module.exports = router
