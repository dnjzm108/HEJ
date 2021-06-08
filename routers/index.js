const express =require('express');
const router = express.Router();
const infoRouter = require('./information/index');
const main = require('./main/main');
const user = require('./third');

router.use('/info',infoRouter);
router.use('/user',user);
router.use('/',main);

module.exports=router;