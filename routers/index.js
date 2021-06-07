const express =require('express');
const router = express.Router();
const main = require('./main/main');
const user = require('./third');

router.use('/user',user);
router.use('/',main);

module.exports=router;