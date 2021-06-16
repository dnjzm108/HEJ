const express = require('express');
const router = express.Router();
const controller =  require('./main_controller');
const multer = require('multer');
const path = require('path');
const login_check = require('../../middleware/login');

const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,'public/uploads/community/')
        },
        filename:function(req,file,callback){
            callback(null,new Date().valueOf()+ path.extname(file.originalname))
        }
    })
});

router.get('/chat',login_check,controller.chat);


router.get('/community/delete',controller.community_delete)
router.get('/community/view',login_check,controller.community_view)
router.post('/community/modify',upload.single('community_image'),controller.community_modify_send)
router.get('/community/modify',controller.community_modify)
router.post('/community/write',upload.single('community_image'),controller.community_write_send)
router.get('/community/write',login_check,controller.community_write)
router.get ('/community',controller.community_list)
router.post('/community/comment',controller.comment_send)
router.get('/comment/delete',controller.comment_delete)
router.post('/community/comment/modify',controller.comment_modify);

router.get('/auth/kakao/unlink',controller.kakao_logout)
router.get('/auth/kakao/callback',controller.kakao_check)
router.get('/auth/kakao',controller.kakao_login);
router.get('/kakao/info',login_check,controller.info)
router.get('/kakao',controller.kakao_in);
router.post('/login',controller.login);
router.get('/test',controller.test);
router.use('/',controller.main);

module.exports=router;