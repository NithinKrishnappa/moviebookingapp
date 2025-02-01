const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/auth/signup', userController.signUp);
router.post('/auth/login', userController.login);
router.post('/auth/logout', userController.logout);
router.get('/getCouponCode', userController.getCouponCode);
router.post('/bookShow', userController.bookShow);


module.exports = router;