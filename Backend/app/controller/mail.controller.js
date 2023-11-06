const nodemailer = require("nodemailer");

exports.sendMail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nguyenanh160201@gmail.com",
        pass: "lsvqdizarolouqrn",
      },
    });
    const mailOptions = {
      from: "nguyenanh160201@gmail.com",
      to: req.body.mail,
      subject: req.body.title,
      html: req.body.content,
    };
    const info = await transporter.sendMail(mailOptions);
    res.json({ document: "success", status: "success" });
  } catch (error) {
    res.json({ document: error, status: "fail" });
  }
};
