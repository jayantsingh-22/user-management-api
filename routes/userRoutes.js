const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { List } = require('../models/models');
const parseCsv = require('../utils/csvParser');

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage});

router.post('/upload-users/:listId', upload.single('file'), async (req, res) => {
  try {  
    const listId = req.params.listId;
    const file = req.file;
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if(!file){
      return res.status(400).json({error: 'No file uploaded'});
    }

    const { usersToAdd, failedUsers } = await parseCsv(file.path, list);

    list.users.push(...usersToAdd);
    await list.save();

    const successCount = usersToAdd.length;
    const failureCount = failedUsers.length;
    const totalUsers = list.users.length;

    res.status(200).json({
      successCount,
      failureCount,
      totalUsers,
      failedUsers
    });

    fs.unlinkSync(file.path); // Clean up the uploaded file
  } catch(error) {
    console.error('Error uploading users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
