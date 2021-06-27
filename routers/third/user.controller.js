const { user } = require('../../models/index');
const moment = require('moment');
const chash = require('../../chash');
const token = require('../../jwt');
const session = require('express-session');
const { render } = require('nunjucks');

let index = (req, res) => {
    let { uid1: userid } = req.session;
    res.render('./third/user/index', { userid })
};

let join = (req, res) => {
    let flag = req.query.flag;
    res.render('./third/user/join.html', { flag })
};

let login = (req, res) => {
    let { flag } = req.query;
    let { uid1: userid } = req.session;
    let {msg} = req.query;
    res.render('./third/user/login.html', { flag, session: session.authData, userid,msg});
};

let info = async (req, res) => {
    let { checked, flag } = req.query;
    let userid = req.session.uid1;
    let userlist = await user.findOne({
        where: { userid }
    });
    let result = userlist.dataValues;
    let userimage2 = result.userimage;
    let gender;
    if (result.gender) {
        gender = "남자"
    } else {
        gender = "여자"
    };
    res.render('./third/user/info.html', {
        id: result.id,
        userid: result.userid,
        userpw: result.userpw,
        user_name: result.user_name,
        user_number: result.user_number,
        gender,
        user_birth: moment(result.user_birth).format('YYYY년 MM월 DD일'),
        userimage: userimage2,
        user_email: result.user_email,
        user_address: result.user_address,
        userdt: moment(result.userdt).format('YYYY년 MM월 DD일'),
        checked,
        flag
    })
};

let info_pwcheck = async (req, res) => {
    let { uid1 } = req.session;
    let { userpw } = req.body;
    let hash = chash(userpw);
    let result = await user.findOne(
        { where: { userid: uid1, userpw: hash } }
    )

    if (result != null) {
        //비밀번호 확인성공, result값이 db에 있을때
        res.redirect("/user/info_modify");
    } else {
        //비밀번호 확인실패, result값이 db에 없을때
        res.redirect("/user/info?checked=0&flag=0");
    }
}

let join_success = async (req, res) => {
    let { userid, userpw, user_name, user_number, gender, user_email, user_birth, user_address1, user_address2, user_address3 } = req.body;
    let userimage = req.file == undefined ? '' : `/uploads/user_image/${req.file.filename}`;
    console.log(userimage);
    let hash = chash(userpw);
    let user_address = user_address1 + user_address2 + user_address3;

    let rst = await user.create({
        userid, userpw: hash, user_name, gender, user_number, userimage, user_email, user_address, user_birth
    });
    res.render('./third/user/join_success', { userimage, user_name });
};

let login_check = async (req, res) => {
    let { userid, userpw } = req.body;
    let hash = chash(userpw);
    let ctoken = token(userpw);
    let result = await user.findOne({
        where: { userid, userpw: hash }
    });
    if (result == null) {
        res.redirect("/user/login?flag=0");
    }
    res.cookie('AccessToken', ctoken, { httpOnly: true, secure: true, })
    let authData = { 
        userid: result.user_name,
        level: result.authority_level
     }
     console.log(result.authority_level);
    session.authData = {
        ["local"]: authData
    }
    let { onSignIn } = req.body;
    req.session.uid1 = userid;
    req.session.isLogin = true;
    req.session.userimage = '1623203467710.png';
    req.session.save(() => {
        res.redirect('/');
    });
};

let logout = async (req, res) => {
    if (session.authData.local) {
        delete session.authData;
        res.redirect('/');
    } else if (session.authData.kakao) {
        const { access_token } = session.authData.kakao;
        let unlink;
        try {
            unlink = await axios({
                mehtod: 'POST',
                url: 'https://kapi.kakao.com/v1/user/unlink',
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
        } catch (err) {
            res.json(err.data)
        }
        const { id } = unlink.data;
        if (session.authData["kakao"].id == id) {
            delete session.authData;
        }
        res.redirect('/?msg=로그아웃 되었습니다.')

    } else {
        return;
    }
}

let userid_check = async (req, res) => {
    let userid = req.query.userid;
    let result = await user.findOne({
        where: { userid }
    })
    let flag = false
    if (result == undefined) {
        flag = true;
    } else {
        flag = false;
    }
    res.json({
        login: flag,
        userid
    })
};

let info_modify = async (req, res) => {
    let userid = session.authData.local.userid;
    let result = await user.findOne({ where: { user_name:userid } })
    let short = result.dataValues;
    let userpw = short.userpw;
    let userimage = `${short.userimage}`;
    let gender;
    if (result.gender) {
        gender = "남자"
    } else {
        gender = "여자"
    };
    const test = JSON.parse(Buffer.from(userpw, 'base64').toString());
    res.render('./third/user/info_modify.html', {
        id:short.id,
        userid: short.userid,
        userpw: test,
        gender,
        user_birth: moment(short.user_birth).format('YYYY년 MM월 DD일'),
        userimage: userimage,
        user_name: short.user_name,
        user_number: short.user_number,
        user_email: short.user_email,
        user_address: short.user_address,
        userdt: moment(result.userdt).format('YYYY년 MM월 DD일'),
    });
};

let info_after_modify = async (req, res) => { //DB 업데이트, findOne 해오기   
    let { userid, userpw, gender, user_birth, user_name, user_number, user_email, user_address, user_address1, user_address2, user_address3, userdt } = req.body;
    let hash = chash(userpw);
    let userimage = req.file == undefined ? req.body.userimage1 : `/uploads/user_image/${req.file.filename}`;
    let user_addressnew = user_address1 + user_address2 + user_address3;
    let user_addressnew2 = user_addressnew == '' ? user_address : user_addressnew;

    await user.update({
        userpw:hash, gender, user_birth, userimage, user_name, user_number, user_email, user_addressnew2, userdt
    }, { where: { userid } });

  
    req.session.userimage = userimage;
    res.redirect('/user/info?checked=1');
};

let find_info = async (req, res) => {
    let { flag } = req.query;
    res.render('./third/user/find_info.html', { flag });
}

let find_check = async (req, res) => {

    let { check } = req.query;
    let { user_name, user_email, } = req.body;
    let result = await user.findOne({
        where: { user_name, user_email }
    })
    flag = false;
    let { userid, userpw } = result.dataValues;
    const test = JSON.parse(Buffer.from(userpw, 'base64').toString());
    if (check == "0") {
        res.render("./third/user/find_success.html", {
            userid, userpw: test, check: '0'
        })
    } else {
        res.render("./third/user/find_success.html", {
            userid, userpw: test, check: '1'
        })
    }
};

let google = (req, res) => {
    let { userid, username } = req.query;
    let authData = { userid: userid, username: username }
    session.authData = { ["google"]: authData };
    let result = JSON.stringify(session.authData)
    res.redirect('/');
};

let google_out = (req, res) => {
    if (session.authData.google) {
        delete session.authData;
        res.redirect('/');
    }
};

let map = (req, res) => {
    res.render('./third/user/map.html')
}
module.exports = {
    index,
    join,
    login,
    info,
    join_success,
    login_check,
    logout,
    userid_check,
    info_modify,
    info_after_modify,
    info_pwcheck,
    find_info,
    find_check,
    google,
    google_out,
    map
}