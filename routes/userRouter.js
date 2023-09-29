const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

const authMiddleware = require('../middleware/authMiddleware')
const validatorMiddleware = require('../middleware/validatorMiddleware')
const userValidation = require('../middleware/userValidation')

router.get('/admin', authMiddleware, userController.getAll)

router.post('/create', userValidation.createUserValidation, validatorMiddleware, userController.create)

router.delete('/delete/:id', userValidation.deleteUserValidation, validatorMiddleware, userController.delete)

router.put('/update', userValidation.updateUserValidation, validatorMiddleware, userController.update)


module.exports = router
