const express =require('express');
const router = express.Router();
const infoRouter = require('./information/index');
const main = require('./main/main');

router.use('/info',infoRouter);
router.use('/',main);

module.exports=router;