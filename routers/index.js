const express =require('express');
const router = express.Router();
const admin = require('./admin/index');
const main = require('./main/main');
const user = require('./third');

router.use('/admin',admin);
router.use('/user',user);
router.use('/',main);

module.exports=router;