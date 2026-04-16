import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import appRouter from './routes/appRouter'

const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY'

type AuthBody = {
    email?: string
    password?: string
}

type AuthTokenPayload = {
    email: string
}

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api', appRouter)

const generateAccessToken = (email: string): string => {
    const payload: AuthTokenPayload = { email }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' })
}

app.get('/', (_req: Request, res: Response) => {
    console.log('start for Render')
    res.send('start !')
})

app.post('/auth', (req: Request<{}, {}, AuthBody>, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.sendStatus(400)
        return
    }

    const isValid = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD

    if (!isValid) {
        res.status(401).json({ data: false, error: 'Invalid credentials' })
        return
    }

    const token = generateAccessToken(email)
    res.json({ data: true, token })
})

app.get('/logout', (_req: Request, res: Response) => {
    console.log('logout')
    res.send('logout')
})

app.use((_req: Request, res: Response) => {
    res.status(404).send('<h2>404 No Page Found</h2>')
})

app.listen(PORT, (err?: Error) => {
    if (err) {
        console.log(err)
        return
    }

    console.log(`Server is starting on port ${PORT}`)
})
