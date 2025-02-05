const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "ponmarimdeiveega@gmail.com",
    pass: "kbcveyjenlwqvjpe",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email,token) {
  console.log(email,token)
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "ponmarimdeiveega@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text:`http://localhost:5173/ForgetPassword/${token}`,  /* `url/${token}` , plain text body */
    //html: `<a href="#">${token}</a>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

/* sendMail().catch(console.error); */
module.exports={
sendMail
}