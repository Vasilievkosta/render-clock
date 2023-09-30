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
    sendLetter(userName, email, date, time) {   

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
            } 
        })
    }
}

module.exports = new SendController()
