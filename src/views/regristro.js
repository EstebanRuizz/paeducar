const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send('estamos en registro.js')
});

module.exports = router; 