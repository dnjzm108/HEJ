const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const multer = require('multer'); 
const path = require('path'); 
const auth = require('../../middleware/auth');

const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,'uploads/')
        },
        filename:function(req,file,callback){
            callback(null,new Date().valueOf()+ path.extname(file.originalname))
        }
    })
});

router.get('/index',userController.index);
router.get('/join',userController.join);
router.get('/login',userController.login);
router.get('/logout',userController.logout);
router.get('/info',auth,userController.info);
router.post('/join_success', upload.single('userimage'),userController.join_success);
router.post('/login_check',userController.login_check);
router.get('/userid_check', userController.userid_check);
router.get('/info_modify', userController.info_modify);
router.post('/info_after_modify',  upload.single('img'), userController.info_after_modify);

module.exports = router;