const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { List } = require('../models/models');
const parseCsv = require('../utils/csvParser');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-users/:listId', upload.single('file'), async (req, res) => {
  const { listId } = req.params;
  const file = req.file;
  const list = await List.findById(listId);

  if (!list) {
    return res.status(404).send({ error: 'List not found' });
  }

  const { usersToAdd, failedUsers } = await parseCsv(file.path, list);

  list.users.push(...usersToAdd);
  await list.save();

  const successCount = usersToAdd.length;
  const failureCount = failedUsers.length;
  const totalUsers = list.users.length;

  res.send({
    successCount,
    failureCount,
    totalUsers,
    failedUsers
  });

  fs.unlinkSync(file.path); // Clean up the uploaded file
});

module.exports = router;
