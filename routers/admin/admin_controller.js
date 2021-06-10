const { information, admin, hired: hiredTd, education: educationTd, popup:popupTd } = require('../../models/index');
const moment = require('moment');
const ctoken = require('../../jwt');


/*========================ADMIN MAIN PAGE========================*/
let admin_main = (req, res) => {
    res.render('./admin/admin.html');
};

/*========================ADMIN LOGIN PAGE========================*/

let admin_login = (req, res) => {
    let { flag, msg } = req.query;
    res.render('./admin/admin_login.html', { flag, msg });
};

let login_success = async (req, res) => {
    let { adminid, adminpw } = req.body;
    let loginSuccess = await admin.findOne({
        where: {
            adminid: adminid,
            adminpw: adminpw,
            authority_level: '1'
        }
    })
    if (loginSuccess == null) {
        res.redirect('/admin/admin_login?flag=0&msg=NOT AUTHORIZED.');
    } else {
        let adminToken = ctoken(adminpw);
        res.cookie('AccessToken', adminToken, {});
        res.redirect('/admin/main');
    }
};

/*========================WRITE PAGE========================*/
let upload = (req, res) => {
    let { title } = req.query;
    console.log(title)
    res.render('./admin/upload.html', { title });
};

let upload_success = async (req, res) => {
    let { localUrl, title, content, writer, type } = req.body;
    // let image = req.file == undefined ? '' : req.file.path;
    console.log(localUrl)

    switch (localUrl) {
        case 'information':
            await information.create({ title, content, writer, type });
            break;
        case 'hired':
            await hiredTd.create({ title, content, writer, type });
            break;
        case 'education':
            await educationTd.create({ title, content, writer, type });
            break;
    }
    if(type != null){
        res.redirect(`/admin/${localUrl}/${type}`);
    }
    res.redirect(`/admin/${localUrl}`)
    /* 각각의 board로 redirect 될 수 있도록 */
};

/*========================VIEW PAGE========================*/

let view = async (req, res) => {
    let { id, table } = req.query;

    let infoView
    switch(table){
        case 'education':
            infoView = await educationTd.findOne({where:{id}});
        break;
        case 'hired':
            infoView = await hiredTd.findOne({where:{id}});
        break;
        case 'information':
            infoView = await information.findOne({where:{id}});
        break;
    }
    let infoList = infoView.dataValues;
    console.log(infoList)
    let infodate = moment(infoList.date).format("MMM Do YY");
    res.render('./admin/view.html', {
        infoList,
        infodate,
    });
};

let postDel = async (req, res) => {
    let {id,table} = req.query;
    switch(table){
        case 'information':
            await information.destroy({where: {id}})
        case 'education':
            await educationTd.destroy({where: {id}})
        break;
        case 'hired':
            await hiredTd.destroy({where: {id}})
        break;
    }
    res.redirect(`/admin/${table}`);
};

let modify = async (req, res) => {
    let {id , table } = req.query;

    let modify_result
    switch(table){
        case 'education':
            modify_result = await educationTd.findOne({where:{id}});
        break;
        case 'hired':
            modify_result = await hiredTd.findOne({where:{id}});
        break;
    }
    let moList = modify_result.dataValues;
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


/*========================= 학원소개 ==========================*/

let Information = async (req, res) => {
    //let localUrl = req.originalUrl.replace('/admin/information/', '');
    let { localUrl } = req.params;

    let infoid = [];
    let infotitle = [];
    let infodate = [];
    let infocontent = [];
    let infoRealId = [];
    let resultsall = await information.findAll({
        where: { type: `${localUrl}` }
    });
    resultsall.forEach(ele => {
        resultsall--;
        infoid.push(resultsall);
        infotitle.push(ele.dataValues.title);
        infodate.push(moment(ele.dataValues.date).format("MMM Do YY"));
        infocontent.push(ele.dataValues.content);
        infoRealId.push(ele.dataValues.id);
    });
    res.render('./admin/information.html', {
        infoid,
        infotitle,
        infodate,
        infocontent,
        infoRealId,
        localUrl,
    });
}

/*============================== 취업정보 =============================== */

let hired = async (req, res) => {
    let {localUrl} = req.params;

    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_hired = [];

    let resultsall = await hiredTd.findAll({ where: { type: localUrl } })
    let totalrecord = resultsall.length;


    let results = await hiredTd.findAll({
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
        where: {type: localUrl}
    });
    console.log('resultsladjfakdjfh;',results)
        let total_page = Math.ceil(totalrecord / 9);
        for (i = 1; i <= total_page; i++) {
            page_hired.push(i);
        };
        let hiredid = []
        let hiredtitle = []
        let hireddate = []
        let hiredcontent = []
        let hiredRealId = []
        results.forEach(ele => {
            ele.num = totalrecord - offset;
            totalrecord--;
            hiredid.push(ele.num);
            hiredtitle.push(ele.dataValues.title);
            hireddate.push(moment(ele.dataValues.date).format("MMM Do YY"));
            hiredcontent.push(ele.dataValues.content);
            hiredRealId.push(ele.dataValues.id);
        });
        res.render('./admin/hired.html', {
            pagination: page_hired,
            hiredid,
            hiredtitle,
            hireddate,
            hiredcontent,
            hiredRealId,
            localUrl,
        });
};

/*======================== 교육과정 ============================*/
let education = async (req, res) => {
    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_hired = [];
    let resultsall = await educationTd.findAll({})
    let totalrecord = resultsall.length;
    let total_page = Math.ceil(totalrecord / 9);
    for (i = 1; i <= total_page; i++) {
        page_hired.push(i);
    };
    let result = await educationTd.findAll({
        raw:true,
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
    });
    let newid = [];
    result.forEach(ele=>{
        ele.num = totalrecord - offset;
        totalrecord--;
        newid.push(ele.num);
    })
    let edList = result.map(v => {
        return {...v,
            // image:v.image.replace('public',''),
            date:moment(v.date).format("MMM Do YY")
        }
    });
    console.log(edList)
    res.render('./admin/education.html', {
        edList,
        pagination:page_hired,
        newid,
    });
};

let popup = async(req,res)=>{
    let result = await popupTd.findAll({raw:true});
    let popupList = result.map(v=>{
        return {...v,
            // image:v.image.replace('public',''),
            date:moment(v.date).format("MMM Do YY")}
    });
    res.render('./admin/popup.html',{
        popupList
    })
};

let popup_upload = async (req,res)=>{
    let { image } = req.body;
    let result = await popupTd.create({})
}

module.exports = {
    admin_main,
    upload,
    upload_success,
    view,
    postDel,
    modify,
    modify_success,
    admin_login,
    login_success,
    Information,
    hired,
    education,
    popup,
    popup_upload,
}