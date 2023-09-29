const Router = require('express')
const router = new Router()

const masterRouter = require('./masterRouter')
const cityRouter = require('./cityRouter')
const userRouter = require('./userRouter')
const orderRouter = require('./orderRouter')

router.use('/master', masterRouter)
router.use('/city', cityRouter)
router.use('/user', userRouter)
router.use('/order', orderRouter)

module.exports = router
