import { Router } from 'express'

import masterRouter from './masterRouter'
import cityRouter from './cityRouter'
import userRouter from './userRouter'
import orderRouter from './orderRouter'

const appRouter = Router()

appRouter.use('/master', masterRouter)
appRouter.use('/city', cityRouter)
appRouter.use('/user', userRouter)
appRouter.use('/order', orderRouter)

export default appRouter
