const express = require('express');
const router = express.Router();
const controller =  require('./main_controller');
const multer = require('multer');
const path = require('path');
const login_check = require('../../middleware/login');

const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,'public/uploads/board/')
        },
        filename:function(req,file,callback){
            callback(null,new Date().valueOf()+ path.extname(file.originalname))
        }
    })
});


router.get('/qanda/write',controller.qanda_aply);
router.post('/qanda/write',controller.qanda_send);
router.get('/qanda/list',controller.qanda_list);
router.get('/qanda/view',controller.qanda_view);
router.get('/qanda/modify',controller.qanda_modify);
router.post('/qanda/modify',controller.qanda_modify_send);
router.get('/qanda/delete',controller.qanda_delete);

router.get('/board/delete',controller.board_delete)
router.get('/board/view',login_check,controller.board_view)
router.post('/board/modify',upload.single('board_image'),controller.board_modify_send)
router.get('/board/modify',controller.board_modify)
router.post('/board/write',upload.single('board_image'),controller.board_write_send)
router.get('/board/write',login_check,controller.board_write)
router.get ('/board',controller.board_list)
router.post('/board/comment',controller.comment_send)
router.get('/comment/delete',controller.comment_delete)
router.post('/board/comment/modify',controller.comment_modify);

router.get('/auth/kakao/unlink',controller.kakao_logout)
router.get('/auth/kakao/callback',controller.kakao_check)
router.get('/auth/kakao',controller.kakao_login);
router.get('/kakao/info',login_check,controller.info)
router.get('/kakao',controller.kakao_in);
router.post('/login',controller.login);
router.get('/test',controller.test);
router.use('/',controller.main);

module.exports=router;