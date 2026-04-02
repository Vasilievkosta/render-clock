import dotenv from "dotenv";

dotenv.config();

interface Mail {
  sender: { email: string };
  to: { email: string }[];
  subject: string;
  htmlContent: string;
}

class SendController {
  async sendLetter(userName: string, email: string, date: string, time: string): Promise<void> {
    const mail: Mail = {
      sender: { email: process.env.TRANSPORTER_EMAIL || "" },
      to: [{ email }],
      subject: "Hello ✔❤️",
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <body>
            <b>Hi, ${userName}!)</b>
            <p>Мы рады. Встретимся ${date} в ${time}.</p>
          </body>
        </html>
      `,
    };

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mail),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error sending email:", errorText);
      } else {
        console.log("Email sent successfully");
      }
    } catch (error: any) {
      console.error("Error sending email:", error.message);
    }
  }
}

export default new SendController();