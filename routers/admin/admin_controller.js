const { information, admin } = require('../../models/index');
const moment = require('moment');
const http = require('http');
const fs = require('fs');
const url = require('url');

let admin_main = (req,res)=>{
    res.render('./admin/admin.html');
};

let upload = (req, res) => {
    res.render('./admin/upload.html');
};

let upload_success = async (req, res) => {
    let { title, content, writer, type } = req.body;
    let info_image = req.file == undefined ? '' : req.file.path;
    let infoResult = await information.create({ title, content, info_image, writer, type });
    res.redirect('/admin/main');
    /* 각각의 board로 redirect 될 수 있도록 */
};

let notice_list = async (req, res) => {
    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_array = [];

    let resultsall = await information.findAll({
        where:{
            type:'notice'
        }
    })
        .then((resultall) => {
            let totalrecord = resultall.length+1;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

    let results = await information.findAll({
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
        where:{
            type:'notice'
        }
    }).then((result) => {

        let total_page = Math.ceil(resultsall / 9);
        for (i = 1; i <= total_page; i++) {
            page_array.push(i);
        };
        let arrayimage = []
        let arrayid = []
        let arraytitle = []
        let arraydate = []
        let arraycontent = []
        result.forEach(ele => {
            ele.num = resultsall - offset;
            resultsall--;
            arrayimage.push(ele.dataValues.info_image.replace('public', ''));
            arrayid.push(resultsall);
            arraytitle.push(ele.dataValues.title);
            arraydate.push(moment(ele.dataValues.date).format("MMM Do YY"));
            arraycontent.push(ele.dataValues.content);
        });
        res.render('./admin/notice_list.html', {
            pagination:page_array,
            arrayimage,
            arrayid,
            arraytitle,
            arraydate,
            arraycontent,
        });
    }).catch((error) => {
        console.log(error);
    })
};

let popup_list = async (req, res) => {
    // console.log(window.location.href);

    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_array = [];

    let resultsall = await information.findAll({
        where:{
            type:'popup'
        }
    })
        .then((resultall) => {
            let totalrecord = resultall.length+1;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

    let results = await information.findAll({
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
        where:{
            type:'popup'
        }
    }).then((result) => {

        let total_page = Math.ceil(resultsall / 9);
        for (i = 1; i <= total_page; i++) {
            page_array.push(i);
        };
        let arrayimage = []
        let arrayid = []
        let arraytitle = []
        let arraydate = []
        let arraycontent = []
        result.forEach(ele => {
            ele.num = resultsall - offset;
            resultsall--;
            arrayimage.push(ele.dataValues.info_image.replace('public', ''));
            arrayid.push(resultsall);
            arraytitle.push(ele.dataValues.title);
            arraydate.push(moment(ele.dataValues.date).format("MMM Do YY"));
            arraycontent.push(ele.dataValues.content);
        });
        res.render('./admin/popup_list.html', {
            pagination:page_array,
            arrayimage,
            arrayid,
            arraytitle,
            arraydate,
            arraycontent,
        });
    }).catch((error) => {
        console.log(error);
    });
};

let about_list = async (req, res) => {
    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_array = [];

    let resultsall = await information.findAll({
        where:{
            type:'about'
        }
    }).then((resultall) => {
            let totalrecord = resultall.length+1;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

    let results = await information.findAll({
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
        where:{
            type:'about'
        }

    }).then((result) => {
        let total_page = Math.ceil(resultsall / 9);
        for (i = 1; i <= total_page; i++) {
            page_array.push(i);
        };
        let arrayimage = []
        let arrayid = []
        let arraytitle = []
        let arraydate = []
        let arraycontent = []
        result.forEach(ele => {
            ele.num = resultsall - offset;
            resultsall--;
            arrayimage.push(ele.dataValues.info_image.replace('public', ''));
            arrayid.push(resultsall);
            arraytitle.push(ele.dataValues.title);
            arraydate.push(moment(ele.dataValues.date).format("MMM Do YY"));
            arraycontent.push(ele.dataValues.content);
        });
        res.render('./admin/about_list.html', {
            pagination:page_array,
            arrayimage,
            arrayid,
            arraytitle,
            arraydate,
            arraycontent,
        });
    }).catch((error) => {
        console.log(error);
    })
};

let view = async (req, res) => {
    let { id } = req.query;
    let infoView = await information.findOne({
        where: {
            id: id
        }
    });
    let infoList = infoView.dataValues;
    let infodate = moment(infoList.date).format("MMM Do YY");
    let infoimage = infoList.info_image.replace('public', '');
    res.render('./admin/view.html', {
        infoList,
        infodate,
        infoimage,
    });
};

let postDel = async (req, res) => {
    try {
        let id = req.query.id;
        await information.destroy({
            where: { id: id }
        })
        res.redirect('/admin/notice_list');
    } catch (error) { console.log(error) }
};

let modify = async (req, res) => {
    let modify_id = req.query.id;
    let modify_result = await information.findAll({
        where: { id: modify_id }
    })
    let moList = modify_result[0].dataValues;
    res.render('./admin/modify.html', {
        moList,
    });
};

let modify_success = async (req, res) => {
    let { title, content, modifyId } = req.body;
    try {
        let infolist = await information.update({ title, content }, {
            where: { id: modifyId }
        })
    } catch (e) {
        console.log(e)
    }
    res.redirect(`/admin/view?id=${modifyId}`);
};

let admin_login = (req,res) => {
    res.render('./admin/admin_login.html');
};

let login_success = async (req,res)=>{
    let {adminid,adminpw} = req.body;
    let loginSuccess = await admin.findOne({
        where:{
            adminid:adminid,
            adminpw:adminpw
        }
    })
    if(loginSuccess == null){
        res.redirect('/admin/admin_login?flag=0');
    }
    res.redirect('/admin/main');
};



module.exports = {
    admin_main,
    upload,
    upload_success,
    view,
    postDel,
    modify,
    modify_success,
    admin_login,
    notice_list,
    about_list,
    popup_list,
    login_success,
}