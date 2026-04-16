import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY'

type AuthTokenPayload = JwtPayload & {
    email: string
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'OPTIONS') {
        console.log(req.method)
        next()
        return
    }

    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            res.status(401).send('Требуется авторизация')
            return
        }

        const token = authorizationHeader.split(' ')[1]
        const decodedToken = jwt.verify(token, JWT_SECRET) as AuthTokenPayload

        ;(req as Request & { user?: AuthTokenPayload }).user = decodedToken
        next()
    } catch (error: unknown) {
        console.error(error)
        res.status(403).json({ error: 'Не авторизован' })
    }
}
