const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

const authMiddleware = require('../middleware/authMiddleware')
const validatorMiddleware = require('../middleware/validatorMiddleware')
const userValidation = require('../middleware/userValidation')

router.get('/', authMiddleware, userController.getAll)

router.delete('/delete/:id', authMiddleware, userValidation.deleteUserValidation, validatorMiddleware, userController.delete)

router.put('/update', authMiddleware, userValidation.updateUserValidation, validatorMiddleware, userController.update)


module.exports = router
