import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import db from './db' // db.ts должен экспортировать pool через export default
import appRouter from './routes/appRouter' // уникальное имя вместо router

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Подключаем роутер
app.use('/api', appRouter)

const generateAccessToken = (email: any, password: any): any => {
    const payload = {
        email,
        password,
    }
    return jwt.sign(payload, 'SECRET_KEY', { expiresIn: '5h' })
}

app.get('/', (req: any, res: any) => {
    console.log('start for Render')
    res.send('start !')
})

app.post('/auth', function async(req: any, res: any) {
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(400)
    }
    const { email, password } = req.body

    let valid = req.body.password === process.env.ADMIN_PASSWORD && req.body.email === process.env.ADMIN_EMAIL

    const token = generateAccessToken(email, password)

    res.json({ data: valid, token: token })
})

app.get('/logout', (req: any, res: any) => {
    console.log('logout')
    res.send('logout')
})

app.use((req: any, res: any) => {
    res.status(404).send('<h2>404 No Page Found</h2>')
})

app.listen(PORT, (err: any) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server is starting on port ${PORT}`)
})
