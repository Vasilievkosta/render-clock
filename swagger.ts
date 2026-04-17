import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Clock Repair API',
        version: '1.0.0',
        description: 'API documentation for the Clock Repair backend built with Express, TypeScript, and Prisma.',
    },
    servers: [
        {
            url: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
}

const swaggerOptions = {
    definition: swaggerDefinition,
    apis: [
        path.join(process.cwd(), 'app.ts'),
        path.join(process.cwd(), 'routes/*.ts'),
        path.join(process.cwd(), 'dist/app.js'),
        path.join(process.cwd(), 'dist/routes/*.js'),
    ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default swaggerSpec
