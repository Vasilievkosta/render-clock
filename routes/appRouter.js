const Router = require('express')
const router = new Router()

const masterRouter = require('./masterRouter')
const cityRouter = require('./cityRouter')
const userRouter = require('./userRouter')
const orderRouter = require('./orderRouter')
const sendRouter = require('./sendRouter')

router.use('/master', masterRouter)
router.use('/city', cityRouter)
router.use('/user', userRouter)
router.use('/order', orderRouter)
router.use('/send', sendRouter)

module.exports = router
