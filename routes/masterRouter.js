const Router = require('express')
const router = new Router()
const masterController = require('../controllers/masterController')

const authMiddleware = require('../middleware/authMiddleware')
const validatorMiddleware = require('../middleware/validatorMiddleware')
const masterValidation = require('../middleware/masterValidation')

router.get('/admin', authMiddleware, masterController.getAll)
router.get('/ofcities/admin', authMiddleware, masterController.getMasterOfCities)
router.get('/ratings', masterController.getRatings)

router.post('/datetime', masterValidation.onWhenMasterValidation, validatorMiddleware,  masterController.onDateAndTime)

router.post('/create', masterValidation.createMasterValidation, validatorMiddleware, masterController.create)

router.delete('/delete/:id', masterValidation.deleteMasterValidation, validatorMiddleware, masterController.delete)

router.put('/update', masterValidation.updateMasterValidation, validatorMiddleware, masterController.update)

module.exports = router
