const express = require('express');
const router = express.Router();
const controller = require('./admin_controller');
const multer = require('multer');
const path = require('path');
const app = require('../../middleware/app');

const upload = multer({
    storage: multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,'public/uploads/info_image/')
        },
        filename:function(req,file,callback){
            callback(null,new Date().valueOf() + path.extname(file.originalname))
        }
    }),
});

router.post('/login_success',controller.login_success);
router.get('/notice_list',controller.notice_list);
router.get('/popup_list',controller.popup_list);
router.get('/about_list',controller.about_list);
router.post('/modify_success',controller.modify_success);
router.get('/modify',controller.modify);
router.get('/delete',controller.postDel);
router.get('/view',controller.view);
router.post('/upload_success',upload.single('info_image'),controller.upload_success);
router.get('/upload',controller.upload);
router.get('/main',controller.admin_main);
router.use('/',controller.admin_login);

module.exports = router;