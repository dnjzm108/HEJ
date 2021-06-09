const express =require('express');
const router = express.Router();
const adminRouter = require('./admin/index');
const main = require('./main/main');
const user = require('./third');

router.use('/admin',adminRouter);
router.use('/user',user);
router.use('/',main);

module.exports=router;