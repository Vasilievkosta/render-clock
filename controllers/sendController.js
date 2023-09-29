const nodemailer = require('nodemailer')
require('dotenv').config()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASSWORD,
    },
})

transporter.verify((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Ready to Send')
    }
})

class SendController {
    sendLetter(req, res) {
        const { userName, email, date, time } = req.body

        const mail = {
            from: '"Great 😃👨‍👩‍👦‍👦" <foo@example.com>',
            to: `${email}`,
            subject: 'Hello ✔❤️',
            html: `
				<!DOCTYPE html>
				<html>
				  <head>
					
				  </head>
				  <body>
					<b>Hi, ${userName}!)</b>
					<p>Мы рады. Встретимся ${date} в ${time}.</p>
				  </body>
				</html>
				`,
        }

        transporter.sendMail(mail, (error) => {
            if (error) {
                console.error('Error sending email:', error.message)
                res.status(500).json({
                    status: 'ERROR',
                    message: 'Failed to send the email.',
                    error: error.message,
                })
            } else {
                res.json({
                    status: 'Message Sent',
                    message: 'Email sent successfully.',
                })
            }
        })
    }
}

module.exports = new SendController()
