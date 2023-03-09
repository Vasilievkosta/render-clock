const Router = require('express');
const router = new Router();

const masterRouter = require('./masterRouter');
const cityRouter = require('./cityRouter');
const userRouter = require('./userRouter');

router.use('/master', masterRouter);
router.use('/city', cityRouter);
router.use('/user', userRouter);

module.exports = router;