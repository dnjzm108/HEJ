const { user } = require('../../models/index');
const moment = require('moment');
const chash = require('../../chash');
const token = require('../../jwt');
const session = require('express-session');
const { render } = require('nunjucks');

let index = (req, res) => {
    let { uid1: userid } = req.session;
    console.log(userid);
    res.render('./third/user/index', { userid })
};

let join = (req, res) => {
    let flag = req.query.flag;
    res.render('./third/user/join.html', { flag })
};

let login = (req, res) => {
    let { flag } = req.query;
    res.render('./third/user/login.html', { flag });
};

let info = async (req, res) => {
    let {checked, flag} = req.query;
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
        user_birth: result.user_birth,
        userimage: userimage2,
        user_email: result.user_email,
        user_address: result.user_address,
        userdt: moment(result.userdt).format('YYYY년 MM월 DD일 hh:mm:ss a'),
        checked,
        flag
    })
};

let info_pwcheck = async(req,res) =>{
    let {uid1} = req.session;
    let { userpw } = req.body;
    let hash = chash(userpw);
    let result = await user.findOne(
        {where: {userid:uid1, userpw:hash}}
    )
    console.log(result);

    if(result != null){
        //비밀번호 확인성공, result값이 db에 있을때
        res.redirect("/user/info?checked=1");       
    }else{
        //비밀번호 확인실패, result값이 db에 없을때
        res.redirect("/user/info?checked=0&flag=0");
       
        
    }
   
} 

let join_success = async (req, res) => {
    let { userid, userpw, user_name, user_number, gender, user_email, user_birth, user_address1, user_address2, user_address3 } = req.body;
    let userimage = req.file == undefined ? '' : `/uploads/user_image/${req.file.filename}`;
    let hash = chash(userpw);
    let user_address = user_address1 + user_address2 + user_address3;

    console.log('++++++++++++++++++++' + hash);
    let rst = await user.create({
        userid, userpw: hash, user_name, gender, user_number, userimage, user_email, user_address, user_birth
    });
    console.log(user_address);

    res.render('./third/user/join_success', { userimage, user_name });
};

let login_check = async (req, res) => {
    let { userid, userpw } = req.body;

    let hash = chash(userpw);
    let ctoken = token(userpw);
    console.log("111111", userid, "2222222", hash)
    let result = await user.findOne({
        where: { userid, userpw: hash }
    });
    if (result == null) {
        res.redirect("/user/login?flag=0");
    }
    res.cookie('AccessToken', ctoken, { httpOnly: true, secure: true, })
    let authData = {userid:result.user_name}
    session.authData={
        ["local"]:authData
    }
    console.log("---------",session.authData);
    let {onSignIn} = req.body;
    console.log("-------",onSignIn);
    req.session.uid1 = userid;
    req.session.isLogin = true;
    req.session.userimage = '1623203467710.png';
    req.session.save(() => {
        res.redirect('/user/index');
    });
};

let logout = (req, res) => {
    delete req.session.isLogin;
    delete req.session.uid;
    delete req.session.uid2;
    delete req.session.userimage;
    req.session.save(() => {
        res.redirect('/user/login');
    })
};

let userid_check = async (req, res) => {
    let userid = req.query.userid;
    console.log("++++++++",userid)
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
    let id = req.query.id;
    let result = await user.findOne({ where: { id } })
    let short = result.dataValues;
    let userimage = `${short.userimage}`
    res.render('./third/user/info_modify.html', {
        id,
        userid: short.userid,
        userpw: short.userpw,
        gender: short.gender,
        user_birth: short.user_birth,
        userimage: userimage,
        user_name: short.user_name,
        user_number: short.user_number,
        user_email: short.user_email,
        user_address: short.user_address,
        userdt: short.userdt,
    });
};

let info_after_modify = async (req, res) => { //DB 업데이트, findOne 해오기   
    let { id, userpw, gender, user_birth, user_name, user_number, user_email, user_address, user_address1, user_address2, user_address3, userdt } = req.body;
    let userimage = req.file == undefined ? req.body.userimage1 : `/uploads/user_image/${req.file.filename}`;

    let user_addressnew = user_address1 + user_address2 + user_address3;
    let user_addressnew2 = user_addressnew == '' ? user_address : user_addressnew;

    await user.update({
        userpw, gender, user_birth, userimage, user_name, user_number, user_email, user_addressnew2, userdt
    }, { where: { id } });
    let result = await user.findOne({
        where: { id, }
    })
    req.session.userimage = userimage;
    req.session.save(() => {
        res.render('./third/user/info.html', {
            id: result.id,
            userid: result.userid,
            userpw: result.userpw,
            gender: result.gender,
            user_birth: result.user_birth,
            userimage: result.userimage,
            user_name: result.user_name,
            user_number: result.user_number,
            user_email: result.user_email,
            user_address: result.user_address,
            userdt: result.userdt,
        });

    });
};

let find_info = async(req,res)=>{
    let {find} =req.query;
    res.render('./third/user/find_info.html',{find});
}

let find_check = async(req,res)=>{
    let {find} = req.query;
    let {user_name,user_email}=req.body;
    let result = await user.findOne({
        where:{user_name, user_email}
    })
    let {userid,userpw} = result.dataValues;

    // if (result != null & find == '0'){
        res.redirect(`/user/find_success?check=0&userid=${userid}&userpw=${userpw}`)
    // }else if(find== '1'){
    //     res.redirect('/user/find_success?check=1')
    // }else{
    //     return;
    // }
}

let find_success = async(req,res)=>{
    let {check, userid,userpw} = req.query;
    console.log(check,userid,userpw)
    // let {user_name,user_email}=req.body;
    // let result = await user.findOne({
    //     where:{user_name, user_email}
    // })
    
    // let userid = result.dataValues.userid;
    // let userpw = result.datavalues.userpw;
    res.render('./third/user/find_success.html', {check,userid})

}

let google =(req,res)=>{
    let {userid,username} = req.query;
    console.log(userid,username);
    let authData = {userid:userid,username:username}
    session.authData = {["google"]: authData}
}
let google_out = (req,res)=>{
    if(session.authData["google"] != null ){
        delete session.authData;
}
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
    find_success,
    google,
    google_out
}