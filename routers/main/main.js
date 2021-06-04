const express = require('express');
const router = express.Router();
const controller =  require('./main_controller');

router.get('/auth/kakao/callback',controller.kakao_check)
router.use('/auth/kakao',controller.kakao_login)
router.post('/login',controller.login);
router.use('/',controller.main);


module.exports=router;