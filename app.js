const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const db = require('./db')
const router = require('./routes/appRouter')

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)

const generateAccessToken = (email, password) => {
    const payload = {
        email,
        password,
    }
    return jwt.sign(payload, 'SECRET_KEY', { expiresIn: '2h' })
}

app.get('/', (req, res) => {
    console.log('start for Render')
    res.send('start !')
})

app.post('/auth', function async(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(400)
    }
    const { email, password } = req.body

    let valid = req.body.password === process.env.ADMIN_PASSWORD && req.body.email === process.env.ADMIN_EMAIL

    const token = generateAccessToken(email, password)

    res.json({ data: valid, token: token })
})

app.get('/logout', (req, res) => {
    console.log('logout')
    res.send('logout')
})

app.use((req, res) => {
    res.status(404).send('<h2>404 No Page Found</h2>')
})

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server is starting on port ${PORT}`)
})
