const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    return res.render('index', {mobile:"index.css", tablet:"", desktop:"", componentes:"componentes.css"});
});

module.exports = router; 