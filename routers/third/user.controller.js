const { user } = require('../../models/index');
const moment = require('moment');

let index = (req, res)=>{
    res.render('./third/user/index')
}

let join = (req, res) => {
    res.render('./third/user/join.html')
}

let login = (req, res) => {
    res.render('./third/user/login.html',);
    // console.log(req);

}

let info = async (req, res) => {
    let userid = req.session.uid; 
    let userlist = await User.findOne({
        where : {userid}
    });
    let short = userlist.dataValues;
    res.render('./third/user/info.html');
    // ,{
    //     id:short.id,
    //     userid:short.userid,
    //     userpw:short.userpw,
    //     gender:short.gender,
    //     user_birth:short.user_birth,
    //     user_name:short.user_name,
    //     user_number:short.user_number,
    //     user_email:short.user_email,
    //     user_address : short.user_address,
    //     userdt:moment(short.userdt).format('YYYY년 MM월 DD일 hh:mm:ss a'),
    // })
}

let join_success = async (req,res) => {
    let {userid,userpw,user_name,user_number,gender,user_email,user_birth} = req.body;
    let userimage = req.file == undefined ? '': req.file.filename;
    console.log(userimage);
    let rst = await user.create({ 
        userid, userpw, user_name, gender, user_number, userimage , user_email,user_address:"12", user_birth
    });

    res.render('./third/user/join_success',{userimage, user_name});
};

let login_check = async (req, res) => {
    let {userid,userpw} = req.body;

    let result = await user.findOne({
        where: { userid, userpw }
    })

  
        req.session.uid = userid;  
        req.session.uid2 = userid;
        req.session.isLogin = true;
        req.session.userimage=result.userimage;

        req.session.save(() => {
            res.redirect(`/`);
        });
      
    };



let logout = (req, res) => {
    delete req.session.isLogin;
    delete req.session.uid;
    delete req.session.uid2;
    delete req.session.userimage;

    req.session.save(() => {
        res.redirect('/');
    })
}

let userid_check = async (req,res)=>{
    let userid = req.query.userid;
    console.log(userid)
    let result = await User.findOne({
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
}

let info_modify = async (req,res)=>{
    let id = req.query.id;
    let result = await User.findOne({where:{id}})
    let short = result.dataValues;
    console.log(id,'++++++++++++',result)
    res.render('./user/info_modify.html',{
        id,
        userid:short.userid,
        userpw:short.userpw,
        user_name:short.user_name,
        user_number:short.user_number,
        user_email:short.user_email,
        userdt:short.userdt,
    })
}

let info_after_modify = async (req,res)=> { //DB 업데이트, findOne 해오기 
    let id= req.body.id;
    let userid = req.body.userid;
    let userpw = req.body.userpw;
    let user_name = req.body.user_name;
    let user_number = req.body.user_number;
    let user_email = req.body.user_email;
    let userdt = req.body.userdt;

    await User.update({
        userid,userpw,user_name,user_number,user_email,userdt,
    },{where:{id}});

    let result = await User.findOne({
        where:{id,}
    })
    req.session.userimage=userimage;
    req.session.save(()=>{
        res.render('./third/user/info.html',{
            id:result.id,
            userid:result.userid,
            userpw:result.userpw,
            user_name:result.user_name,
            user_number:result.user_number,
            user_email:result.user_email,
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
