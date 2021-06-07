const express = require('express');
const { route } = require('..');
const router = express.Router();
const controller =  require('./main_controller');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,'uploads/')
        },
        filename:function(req,file,callback){
            callback(null,new Date().valueOf() + path.extname(file,originalname))
        }
    }),
})


router.get('/qanda/write',controller.qanda_aply);
router.post('/qanda/write',controller.qanda_send);
router.get('/qanda/list',controller.qanda_list);
router.get('/qanda/view',controller.qanda_view);
router.get('/qanda/modify',controller.qanda_modify);
router.post('/qanda/modify',controller.qanda_modify_send);
router.get('/qanda/delete',controller.qanda_delete);

router.get('/board/delete',controller.board_delete)
router.get('/board/view',controller.board_view)
router.post('/board/modify',upload.single('img'),controller.board_modify_send)
router.get('/board/modify',controller.board_modify)
router.post('/board/write',upload.single('img'),controller.board_write_send)
router.get('/board/write',controller.board_write)
router.get ('/board',controller.board_list)
router.get('/auth/kakao/callback',controller.kakao_check)
router.use('/auth/kakao',controller.kakao_login)
router.post('/login',controller.login);
router.use('/',controller.main);


module.exports=router;