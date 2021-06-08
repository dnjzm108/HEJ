const express = require('express');
const router = express.Router();
const controller = require('./info_controller');
const multer = require('multer');
const path = require('path');

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

router.post('/modify_success',controller.modify_success);
router.get('/modify',controller.modify);
router.get('/delete',controller.postDel);
router.get('/view',controller.view);
router.get('/infolist',controller.info_list);
router.post('/upload_success',upload.single('info_image'),controller.upload_success);
router.use('/',controller.info);

module.exports = router;