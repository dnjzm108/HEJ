const express = require('express');
const router = express.Router();
const controller = require('./admin_controller');
const multer = require('multer');
const path = require('path');
const auth = require('../../middleware/auth');

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

router.use('/community/:localUrl',controller.community);
router.use('/community',controller.community);
router.post('/authority',controller.authority);
router.get('/user_view',controller.user_view);
router.use('/user',controller.user_admin)
router.get('/popup_view',controller.popup_view);
router.post('/popup_upload_success',upload.single('image'),controller.popup_upload_success);
router.get('/popup_upload',controller.popup_upload);
router.use('/popup',controller.popup);
router.use('/education',controller.educationT);
router.use('/hired/:localUrl',controller.hired);
router.use('/hired',controller.hired);
router.use('/information/:localUrl',controller.Information);
router.use('/information/',controller.Information);

router.post('/login_success',controller.login_success);
router.post('/modify_success',controller.modify_success);
router.get('/modify',controller.modify);
router.get('/delete',controller.postDel);
router.get('/view',controller.view);
router.post('/upload_success',controller.upload_success);
router.get('/upload',controller.upload);
router.get('/main',auth,controller.admin_main);
router.use('/',controller.admin_login);



module.exports = router;