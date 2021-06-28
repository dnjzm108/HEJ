const { comment,information, admin, hired: hiredTd, education, popup: popupTd, user, community: communityTd } = require('../../models/index');
const moment = require('moment');
const ctoken = require('../../jwt');
const search = require('../../serach');
const pagination = require('../../pagination');
const chash = require('../../chash');
const router = require('.');
const { Op } = require("sequelize");
// const {Sequelize} = require('../../models/index.js');
// const Op = Sequelize.Op

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
            authority_level: '3'
        }
    })
    let userpw = chash(adminpw)
    let userAdmin = await user.findOne({
        where: {
            userid: adminid,
            userpw,
            authority_level: '3'
        }
    })
    if (loginSuccess != null || userAdmin != null) {
        let adminToken = ctoken(adminpw);
        res.cookie('AccessToken', adminToken, {});
        res.redirect('/admin/main');
    } else {
        res.redirect('/admin/admin_login?flag=0&msg=NOT AUTHORIZED.');
    }
};

// else if(userAdmin == null){
//     res.redirect('/admin/admin_login?flag=0&msg=NOT AUTHORIZED.')
// }

/*========================WRITE PAGE========================*/

let upload = (req, res) => {
    let { title, localUrl } = req.query;
    res.render('./admin/upload.html', { title, localUrl });
};

let upload_success = async (req, res) => {
    let { localUrl, title, content, writer, type } = req.body;
    if (localUrl == 'education') {
        let { edName, edPeriod, time, fee, hashtag, localUrl, title, content, writer } = req.body;
        let edResult = await search[localUrl].create({ edName, ed_start_period: edPeriod[0], ed_end_period: edPeriod[1], time, fee, hashtag, title, content, writer, type });
        await search[localUrl].update({ visibility: 1 }, { where: { id: edResult.id } });
        await search[localUrl].update({ visibility: 0 }, { where: { id: { [Op.ne]: edResult.id } } });
        res.redirect('/admin/education');
        return;
    }

    if (localUrl == 'hired') {
        let thumbnail = req.file == undefined ? '' : `/uploads/user_image/${req.file.filename}`;
        let { title, content, writer, type } = req.body;
        await search[localUrl].create({title,content,writer,type, thumbnail});
        res.redirect(`/admin/hired/${type}`);
        return;
    }

    // if(type == 'staff'){
    //     let thumbnail = req.file == undefined ? '' : `/uploads/user_image/${req.file.filename}`;
    //     let {title, writer, type, staffComment, staffPosition, staffName, staffCareer, staffExplanation } = req.body;
    //     await search[localUrl].create({title,writer,type,thumbnail,staffComment,staffPosition,staffName,staffCareer,staffExplanation});
    //     res.redirect('/admin/information/staff');
    //     return;
    // }

    let result = await search[localUrl].create({ title, content, writer, type });
    if (localUrl == 'information') {
        await search[localUrl].update({ visibility: 1 }, { where: { type, id: result.id } });
        await search[localUrl].update({ visibility: 0 }, { where: { type, id: { [Op.ne]: result.id } } });
    }

    /* 각각의 board로 redirect 될 수 있도록 */
    
    if (type != null) {
        res.redirect(`/admin/${localUrl}/${type}`);
    }
    else { res.redirect(`/admin/${localUrl}`) }
};

/*========================VIEW PAGE========================*/

let view = async (req, res) => {
    let { id, table, localUrl } = req.query;
    console.log(localUrl)
    let infoView = await search[table].findOne({ where: { id } })
    let infoList = infoView.dataValues;
    let location = 1;
    let see = await comment.findAll({
        where:{idx:id}
    })
    let infodate = moment(infoList.date).format("MMM Do YY");
    if(localUrl == 'qanda' || localUrl =='board'){
        res.render('./main/menu/menu_view.html',{
            infoList,
            infodate,
            table,
            localUrl,
            see,
            id
        })
    }else{
        res.render('./admin/view.html', {
            infoList,
            infodate,
            table,
            localUrl,
            location,
            
        });
    }
};

let postDel = async (req, res) => {
    let { id, table, localUrl } = req.query;
    await search[table].destroy({ where: { id } });
    if (localUrl == '') {
        res.redirect(`/admin/${table}`);
    } else {
        res.redirect(`/admin/${table}/${localUrl}`);
    }
};

/*=======================MODIFY PAGE=======================*/

let modify = async (req, res) => {
    let { id, table, localUrl } = req.query;
    let modify_result = await search[table].findOne({ where: { id } });
    let moList = modify_result.dataValues;
    res.render('./admin/modify.html', {
        moList,
        table,
        localUrl
    });
};

let modify_success = async (req, res) => {
    let { title, content, modifyId, table } = req.body;
    await search[table].update({ title, content }, { where: { id: modifyId } });
    // res.redirect(`/admin/view?id=${modifyId}&table=${table}`);
    res.redirect(`/admin/${table}`)
};

/*========================= 학원소개 ==========================*/

let Information = async (req, res) => {
    let { localUrl } = req.params;
    let { id } = req.query;
    let page = { localUrl: `${localUrl}`, id: `${id}`, table: 'information' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let infoList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            date: moment(v.write_date).format("MMM Do YY"),
        }
    });
    res.render('./admin/information.html', { infoList, pagin: pagin.page_hired, localUrl })
};

let information_update = async (req, res) => {
    let { visibility, local } = req.body;
    await information.update({ visibility: 1 }, { where: { id: visibility } });
    await information.update({ visibility: 0 }, { where: { id: { [Op.ne]: visibility }, type: local } });
    res.redirect(`/admin/information/${local}`);
}

/*============================== 취업정보 =============================== */

let hired = async (req, res) => {
    let { localUrl } = req.params;
    let { id } = req.query;
    let page = { localUrl: `${localUrl}`, id: `${id}`, table: 'hired' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let hireList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY")
        }
    })
    res.render('./admin/hired.html', {
        pagin: pagin.page_hired,
        hireList,
        localUrl
    });
};

/*======================== 교육과정 ============================*/

let educationT = async (req, res) => {
    let { id } = req.query;
    let page = { id: `${id}`, table: 'education' };
    let pagin = await pagination(page);
    let result = pagin.result;
    let edList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY"),
            num: v.num
        }
    });
    res.render('./admin/education.html', {
        edList,
        pagin: pagin.page_hired,
    });
};

let education_update = async (req, res) => {
    let { visibility } = req.body;
    await education.update({ visibility: 0 }, { where: { id: { [Op.ne]: null } } });
    await education.update({ visibility: 1 }, { where: { id: visibility } });
    res.redirect('/admin/education');
}
/*========================= 팝업 게시판 ================================= */

let popup = async (req, res) => {
    let { id } = req.query;
    let page = { id: `${id}`, table: 'popup' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let popupList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY"),
            visibility: v.visibility == 0 ? "invisible" : "visible",
            num: v.num
        }
    });
    res.render('./admin/popup.html', {
        pagin: pagin.page_hired,
        popupList
    });
};

let popup_upload = (req, res) => {
    let { title, localUrl } = req.query;
    res.render('./admin/popup_upload', { title, localUrl })
};

let popup_upload_success = async (req, res) => {
    let { writer, visibility, title, type, period, scroll, size, location, hyperlink, content } = req.body;
    await popupTd.create({ writer, visibility, type, title, popup_start_date: period[0], popup_end_date: period[1], scroll, pop_width: size[0], pop_height: size[1], pop_locationX: location[0], pop_locationY: location[1], hyperlink, content });
    res.redirect('/admin/popup');
};

let popup_view = async (req, res) => {
    let { id, table } = req.query;
    let result = await search['popup'].findAll({ where: { id: `${id}` }, raw: true })
    let popupList = result.map(v => {
        return {
            ...v,
            type: v.type == 1 ? '일반팝업' : '레이어팝업',
            visibility: v.visibility == 1 ? 'visible' : 'invisible',
            scroll: v.scroll == 1 ? '스크롤 허용' : '스크롤 비허용',
            popup_start_date: moment(v.popup_start_date).format("yyyy-MM-DD"),
            popup_end_date: moment(v.popup_end_date).format("yyyy-MM-DD"),
            date: moment(v.date).format("MMM Do YY")
        }
    });
    res.render('./admin/popup_view.html', { popupList })
};

let popup_modify = async (req, res) => {
    let { id, table } = req.query;
    let popupResult = await search[table].findAll({ where: { id }, raw: true });
    let popupList = popupResult.map(v => {
        return {
            ...v,
            popup_start_date: moment(v.popup_start_date).format("yyyy-MM-DD"),
            popup_end_date: moment(v.popup_end_date).format("yyyy-MM-DD"),
            date: moment(v.date).format("MMM Do YY")
        }
    });
    res.render('./admin/popup_modify.html', {
        popupList,
        table,
    });
};

let popup_modify_success = async (req, res) => {
    let { writer, visibility, title,type, period, scroll, size, location, hyperlink, content, modifyId, table } = req.body;
    await search[table].update({ writer, type, visibility, title, popup_start_date: period[0], popup_end_date: period[1], scroll, pop_width: size[0], pop_height: size[1], pop_locationX: location[0], pop_locationY: location[1], hyperlink, content }, { where: { id: modifyId } });
    res.redirect(`/admin/popup_view?id=${modifyId}&table=${table}`);
};

/*========================= 회원관리 ================================= */

let user_admin = async (req, res) => {
    let { id } = req.query;
    let page = { id: `${id}`, table: 'user' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let userList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            userdt: moment(v.userdt).format("MMM Do YY"),
            num: v.num
        }
    });
    res.render('./admin/user_admin', { userList, pagin: pagin.page_hired });
};

let user_view = async (req, res) => {
    let { id } = req.query;
    let image = req.file == undefined ? '' : req.file.path;
    let result = await user.findAll({ where: { id }, raw: true });
    /* map은 배열에만 사용가능하다 */
    let userResult = result.map(v => {
        return {
            ...v,
            userdt: moment(v.userdt).format("MMM Do YY"),
            userimage: v.userimage.replace('public', '')
        }
    });
    let userList = userResult.pop();
    res.render('./admin/user_view.html', { userList })
};

let authority = async (req, res) => {
    let { authority_level, userid } = req.body;
    await user.update({ authority_level }, { where: { userid } });
    res.redirect('/admin/user')
};

/* ===================== 커뮤니티 게시판 ========================= */

let community = async (req, res) => {
    let { localUrl } = req.params;
    let { id } = req.query;
    let page = { localUrl: `${localUrl}`, id: `${id}`, table: 'community' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let commList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            write_date: moment(v.write_date).format("MMM Do YY"),
            num: v.num
        }
    });
    res.render('./admin/community.html', {
        pagin: pagin.page_hired,
        commList,
        localUrl
    });
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
    login_success,
    Information,
    information_update,
    hired,
    educationT,
    education_update,
    popup,
    popup_upload,
    popup_upload_success,
    popup_view,
    popup_modify,
    user_admin,
    user_view,
    authority,
    community,
    popup_modify_success,
}