const Router = require('express')
const router = new Router()
const masterController = require('../controllers/masterController')

const authMiddleware = require('../middleware/authMiddleware')
const validatorMiddleware = require('../middleware/validatorMiddleware')
const masterValidation = require('../middleware/masterValidation')

router.get('/', authMiddleware, masterController.getAll)
router.get('/ofcities/', authMiddleware, masterController.getMasterOfCities)
router.get('/ratings', masterController.getRatings)

router.post('/datetime', masterValidation.onWhenMasterValidation, validatorMiddleware,  masterController.onDateAndTime)

router.post('/create', authMiddleware, masterValidation.createMasterValidation, validatorMiddleware, masterController.create)

router.delete('/delete/:id', authMiddleware, masterValidation.deleteMasterValidation, validatorMiddleware, masterController.delete)

router.put('/update', authMiddleware, masterValidation.updateMasterValidation, validatorMiddleware, masterController.update)

module.exports = router
