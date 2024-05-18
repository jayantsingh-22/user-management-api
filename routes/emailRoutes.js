const express = require("express");
const router = express.Router();
const { sendEmailToList, unsubscribeUser } = require("../utils/emailSender");

router.post("/send-email", async (req, res) => {
  const { listId, subject, text } = req.body;

  try {
    await sendEmailToList(listId, subject, text);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

router.get("/unsubscribe/:listId/:email", async (req, res) => {
  const { listId, email } = req.params;

  try {
    await unsubscribeUser(listId, email);
    res.status(200).send("You have been unsubscribed successfully.");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;

