import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'OPTIONS') {
        console.log(req.method)
        return next()
    }

    try {
        const authorizationHeader = req.headers.authorization

        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split(' ')[1]

            // Укажи тип payload, если знаешь структуру токена
            const decodedToken = jwt.verify(token, 'SECRET_KEY')

            // Можно сохранить данные токена в req для дальнейшего использования
            ;(req as any).user = decodedToken

            return next()
        } else {
            return res.status(401).send('Требуется авторизация')
        }
    } catch (e: unknown) {
        console.error(e)
        return res.status(403).json({ error: 'Не авторизован' })
    }
}
