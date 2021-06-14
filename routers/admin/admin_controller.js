const { information, admin, hired: hiredTd, education, popup: popupTd, user , community:communityTd } = require('../../models/index');
const moment = require('moment');
const ctoken = require('../../jwt');
const search = require('../../serach');
const pagination = require('../../pagination');

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
    res.render('./admin/upload.html', { title });
};

let upload_success = async (req, res) => {
    let { localUrl, title, content, writer, type } = req.body;
    await search[localUrl].create({ title, content, writer, type });
    if (type != null) {
        res.redirect(`/admin/${localUrl}/${type}`);
    }
    else{res.redirect(`/admin/${localUrl}`)}
    /* 각각의 board로 redirect 될 수 있도록 */
};

/*========================VIEW PAGE========================*/

let view = async (req, res) => {
    let { id, table } = req.query;
    let infoView = await search[table].findOne({ where: { id } })
    let infoList = infoView.dataValues;
    let infodate = moment(infoList.date).format("MMM Do YY");
    res.render('./admin/view.html', {
        infoList,
        infodate,
        table,
    });
};

let postDel = async (req, res) => {
    let { id, table } = req.query;
    await search[table].destroy({ where: { id } })
    res.redirect(`/admin/${table}`);
};

let modify = async (req, res) => {
    let { id, table } = req.query;  
    let modify_result = await search[table].findOne({ where: { id } });
    let moList = modify_result.dataValues;
    res.render('./admin/modify.html', {
        moList,
        table,
    });
};

let modify_success = async (req, res) => {
    let { title, content, modifyId, table } = req.body;
    await search[table].update({ title, content }, { where: { id: modifyId } });
    res.redirect(`/admin/view?id=${modifyId}&table=${table}`);
};

/*========================= 학원소개 ==========================*/

let Information = async (req, res) => {
    let { localUrl } = req.params;
    let resultsall = await search['information'].findAll({ where: { type: `${localUrl}` }, raw: true });

    let infoList = resultsall.map(v => {
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY"),
            visibility: v.visibility == 0 ? "invisible" : "visible"
        }
    });

    let idArr = '';
    infoList.forEach(v => {
        idArr += v.id + ','
    })
    res.render('./admin/information.html', { infoList, idArr })
}

/*============================== 취업정보 =============================== */

let hired = async (req, res) => {
    let { localUrl } = req.params;

    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_hired = [];

    let resultsall = await hiredTd.findAll({ where: { type: `${localUrl}` } })
    let totalrecord = resultsall.length;
    let results = await hiredTd.findAll({
        where: { type: `${localUrl}` },
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset
    });
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
let educationT = async (req, res) => {
    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_hired = [];
    let resultsall = await education.findAll({})
    let totalrecord = resultsall.length;
    let total_page = Math.ceil(totalrecord / 9);
    for (i = 1; i <= total_page; i++) {
        page_hired.push(i);
    };
    let result = await education.findAll({
        raw: true,
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
    });
    let newid = [];
    result.forEach(ele => {
        ele.num = totalrecord - offset;
        totalrecord--;
        newid.push(ele.num);
    })
    let edList = result.map(v => {
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY")
        }
    });
    res.render('./admin/education.html', {
        edList,
        pagination: page_hired,
        newid,
    });
};

/*========================= 팝업 게시판 ================================= */

let popup = async (req, res) => {
    let {id} = req.query;
    let page = { id:`${id}`, table:'popup' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let popupList = result.map(v => {
        return {
            ...v,
            image: v.image.replace('public', ''),
            date: moment(v.date).format("MMM Do YY"),
            visibility: v.visibility == 0 ? "invisible" : "visible"
        }
    })
    res.render('./admin/popup.html', {
        pagin:pagin.page_hired,
        popupList
    })
};

let popup_upload = (req, res) => {
    res.render('./admin/popup_upload')
}

let popup_upload_success = async (req, res) => {
    let { writer, visibility } = req.body;
    let image = req.file == undefined ? '' : req.file.path;
    await popupTd.create({ image, writer, visibility });
    res.redirect('/admin/popup');
}

let popup_view = async (req, res) => {
    let { id } = req.query;
    let popupView = await popupTd.findOne({
        where: { id }
    })
    let popupList = popupView.dataValues;
    let popupDate = moment(popupList.date).format('MMM Do YY');
    let popupImage = popupList.image.replace('public', '');
    res.render('./admin/popup_view.html', { popupList, popupDate, popupImage })
}

/*========================= 회원관리 ================================= */

let user_admin = async (req, res) => {
    let result = await user.findAll({ raw: true });
    let userList = result.map(v => {
        return {
            ...v,
            userdt: moment(v.userdt).format("MMM Do YY"),
        }
    })
    res.render('./admin/user_admin', { userList });
}

let user_view = async (req, res) => {
    let { id } = req.query;
    let image = req.file == undefined ? '' : req.file.path;
    let result = await user.findAll({ where: { id },raw:true });
    /* map은 배열에만 사용가능하다 */
    let userResult = result.map(v=>{
        return {...v,
            userdt: moment(v.userdt).format("MMM Do YY"),
            userimage: v.userimage.replace('public','')
        }
    });
    let userList = userResult.pop();
    res.render('./admin/user_view.html', { userList })
}

let authority = async(req,res)=>{
    let { authority_level, userid } = req.body;
    await user.update({ authority_level }, { where: { userid } });
    res.redirect('/admin/user')
}

/* ===================== 커뮤니티 게시판 ========================= */

let community = async(req,res)=>{
    let {localUrl} = req.params;
    let {id} = req.query;
    let page = { localUrl:`${localUrl}`, id:`${id}`, table:'community' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let commList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            write_date: moment(v.write_date).format("MMM Do YY"),
            num:v.num
        }
    })
    res.render('./admin/community.html',{
        pagin:pagin.page_hired,
        commList,
        localUrl
    });
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
    educationT,
    popup,
    popup_upload,
    popup_upload_success,
    popup_view,
    user_admin,
    user_view,
    authority,
    community,
}