const express = require('express');
const { List } = require('../models/models');
const router = express.Router();

router.post('/create-list', async (req, res) => {
    const { title, customProperties } = req.body;

    const list = new List({
        title,
        customProperties
    });

    await list.save();
    res.status(201).send(list);
});

module.exports = router;
