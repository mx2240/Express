const express = require('express');
const router = express.Router();


const { register, login } = require('../controller/AccountController');
router.post('/register', register);
router.post('/login', login);




router.get('/contact', function (req, res, next) {
    res.send('respond with contact');
});














module.exports = router;