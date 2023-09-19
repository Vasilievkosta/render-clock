const Router = require('express')
const router = new Router()
const sendController = require('../controllers/sendController')

const validatorMiddleware = require('../middleware/validatorMiddleware')
const sendValidation = require('../middleware/sendValidation')

router.post('/', sendValidation.sendMailValidation, validatorMiddleware, sendController.sendLetter)

module.exports = router
