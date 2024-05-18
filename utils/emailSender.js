const nodemailer = require("nodemailer");
const { List } = require("../models/models");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 465,
  secure: true, // Set to true if you're using port 465 with SSL
  auth: {
    user: process.env.ELASTICEMAIL_USERNAME,
    pass: process.env.ELASTICEMAIL_PASSWORD,
  },
});

async function sendEmailToList(listId, subject, text) {
  const list = await List.findById(listId);

  if (!list) {
    throw new Error("List not found");
  }

  const unsubscribedEmails = new Set(list.unsubscribedEmails || []);
  const users = list.users.filter(
    (user) => !unsubscribedEmails.has(user.email)
  );

  for (const user of users) {
    const emailText = text.replace(/\[([^\]]+)\]/g, (_, propName) => {
      if (propName === "name") return user.name;
      if (propName === "email") return user.email;
      return user.customProperties.get(propName) || "";
    });

    const unsubscribeLink = `http://localhost:3000/api/email/unsubscribe/${listId}/${user.email}`;
    const finalEmailText = `${emailText}\n\nTo unsubscribe, click here: ${unsubscribeLink}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: subject,
      text: finalEmailText,
    };

    transporter.sendMail(mailOptions);
  }
}

async function unsubscribeUser(listId, email) {
  const list = await List.findById(listId);

  if (!list) {
    throw new Error("List not found");
  }

  if (!list.unsubscribedEmails) {
    list.unsubscribedEmails = [];
  }

  list.unsubscribedEmails.push(email);
  await list.save();
}

module.exports = {
  sendEmailToList,
  unsubscribeUser,
};
