const { user } = require('../../models/index');
const moment = require('moment');
const chash = require('../../chash');
const token = require('../../jwt');

let index = (req, res)=>{
    res.render('./third/user/index')
};

let join = (req, res) => {
    let flag = req.query.flag;
    res.render('./third/user/join.html',{flag})
};

let login = (req, res) => {
    res.render('./third/user/login.html');
};

let info = async (req, res) => {
    let userid = req.session.uid1;
    let userlist = await user.findOne({
        where : {userid}
    });
    let result = userlist.dataValues;
    let obj = {
        id:result.id,
        userid:result.userid,
        userpw:result.userpw,
        user_name:result.user_name,
        user_number:result.user_number, 
        gender:result.gender,
        user_birth:result.user_birth,
        userimage:result.userimage,
        user_email:result.user_email,
        user_address:result.user_address,
        userdt:moment(result.userdt).format('YYYY년 MM월 DD일 hh:mm:ss a'),
    };
    res.render('./third/user/info.html',obj)
};

let join_success = async (req,res) => {
    let {userid,userpw,user_name,user_number,gender,user_email,user_birth, user_address} = req.body;
    let userimage = req.file == undefined ? '': req.file.filename;
    console.log(userimage);

    let hash = chash(userpw);
    
    console.log('++++++++++++++++++++'+hash);
    let rst = await user.create({ 
        userid, userpw:hash, user_name, gender, user_number, userimage , user_email,user_address, user_birth
    });
    res.render('./third/user/join_success',{userimage, user_name});
};

let login_check = async (req, res) => {
    let {userid,userpw} = req.body;

    let hash = chash(userpw);
    let ctoken = token(userpw);
    console.log("+++++++++++++"+ctoken);
    let result = await user.findOne({
        where: { userid, userpw:hash }
    });
    res.cookie('AccessToken',ctoken,{httpOnly:true,secure:true,})

        req.session.uid1 = userid;
        req.session.uid2 = userid;
        req.session.isLogin = true;
        req.session.userimage=result.userimage;
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

let userid_check = async (req,res)=>{
    let userid = req.query.userid;
    console.log(userid)
    let result = await user.findOne({
        where:{ userid }
    })
    let flag = false
    if(result == undefined){
        flag = true;
    }else{
        flag = false;
    }
    res.json({
        login: flag,
        userid
    })
};

let info_modify = async (req,res)=>{
    let id = req.query.id;
    let result = await user.findOne({where:{id}})
    let short = result.dataValues;
    res.render('./third/user/info_modify.html',{
        id,
        userid:short.userid,
        userpw:short.userpw,
        gender:short.gender,
        user_birth:short.user_birth,
        userimage:short.userimage,
        user_name:short.user_name,
        user_number:short.user_number,
        user_email:short.user_email,
        user_address:short.user_address,
        userdt:short.userdt,
    });
};

let info_after_modify = async (req,res)=> { //DB 업데이트, findOne 해오기 
    let {id, userid, userpw, gender, user_birth, user_name,user_number, user_email, user_address, userdt}= req.body;
    let userimage = req.file == undefined ? '':req.file.filename;

    await user.update({
        userid, userpw, gender, user_birth, userimage, user_name, user_number, user_email, user_address, userdt},{where:{id}});
    let result = await user.findOne({
        where:{id,}
    })
    req.session.userimage=userimage;
    req.session.save(()=>{
        res.render('./third/user/info.html',{
            id:result.id,
            userid:result.userid,
            userpw:result.userpw,
            gender:result.gender,
            user_birth:result.user_birth,
            userimage:result.userimage,
            user_name:result.user_name,
            user_number:result.user_number,
            user_email:result.user_email,
            user_address:result.user_address,
            userdt:result.userdt,
        });
    });
};

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
}