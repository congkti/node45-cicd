import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "congkti@gmail.com",
    pass: "mveueaihrfhgbjil",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(
  recipientEmail,
  subject,
  plainBody,
  htmlBody,
  recipientName = ""
) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"CTY KAY CHIPCHIP 👻" <web.congkti@gmail.com>', // sender address
    to: `${recipientName || ""} <${recipientEmail}>`, // list of receivers
    subject: `${subject} ✔`, // Subject line
    text: plainBody, // plain text body
    html: htmlBody, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// sendMail().catch(console.error);

export default sendMail;
