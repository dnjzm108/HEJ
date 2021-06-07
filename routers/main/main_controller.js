/*
rest key  d71e574bb53209815ff9a1eedf9d85dd
URL  http://localhost:3000/auth/kakao/callback
secretn key  hLAJzSnEQyKo2fujTV2saFCGixSySbHg
*/
const axios = require('axios');
const qs = require('qs');
const {board,information,user,sequelize,qanda} = require('../../models');


const kakao={
    clientID:'d71e574bb53209815ff9a1eedf9d85dd',
    clientSecret:'hLAJzSnEQyKo2fujTV2saFCGixSySbHg',
    redirectUri:'http://localhost:3000/auth/kakao/callback'
}
let kakao_login = (req,res)=>{
    const kakaoAuthURL=`https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile,account_email`;
    res.redirect(kakaoAuthURL);
}
let kakao_check = async(req,res) =>{
    let token;
    try{
    token = await axios({
        method:'POST',
        url:'https://kauth.kakao.com/ouath/token',
        headers:{
            "content-type":'application/x-www-form-urlencoded',
        },
        data:qs.stringify({
            grant_type:'authorization_code',
            client_id:kakap.clientID,
            client_secret: kakao.clientSecret,
            redirectUri: kakao.redirectUri,
            code: req.query.code,
        })
    })
}catch(err){
        res.json(err.data)
    }
    res.send('ok')
}

let main = (req,res)=>{
    let id = req.query.id;
    let pw = req.query.pw;
    res.render('./main/board/main.html',{
        id,pw
    })
}

let login = (req,res)=>{
    let id = req.body.id;
    let pw = req.body.pw;
    let pw_check = req.body.pw_check;
    console.log('id:'+id,'pw:'+pw,'pw_check:'+pw_check);
    res.redirect(`/?id=${id}&pw=${pw}`);
}

let board_list = async (req,res)=>{
    let result = await board.findAll({});
    res.render('./main/board/list.html',{
        result
    })
}
let board_write = (req,res)=>{
    res.render('./main/board/write.html')
}
let board_write_send = async (req,res)=>{
    let {title,userid,content,board_image,write_type} = req.body;
    console.log(title,userid,content,board_image,write_type);
    let write = await board.create({
        title,userid,content,board_image,write_type,
        hit:0,
    })
    console.log(write);
    res.redirect('/board')
}
let board_view = async (req,res) =>{
    let idx = req.query.idx;
    let result = await board.findAll({
        where:{idx}
    })
    let view = result[0].dataValues;
    let hitNum = await board.update({
        hit : view.hit+1 },{where:{idx}} );
    res.render('./main/board/view.html',{
        view,idx
    })
}

let board_modify = async (req,res)=>{
    let idx = req.query.idx;
    let result = await board.findAll({
        where:{idx}
    })
    let modify = result[0].dataValues;
    res.render('./main/board/modify.html',{
        modify,idx
    })
}
let board_modify_send = async (req,res)=>{
    let {title,userid,content,board_image,write_type,idx} = req.body;
     let modify = await board.update({
        title,userid,content,board_image,write_type},{where:{idx}} );
        res.redirect(`/board/view?idx=${idx}`);
  }
let board_delete = async (req,res)=>{
    let idx = req.query.idx
    let result = await board.destroy({where:{idx}});
    res.redirect('/board');
}

let qanda_list = async (req,res)=>{
    let result = await qanda.findAll({});
    res.render('./main/qanda/qanda_list.html',{
        result
    });
}

let qanda_aply = (req,res)=>{
    res.render('./main/qanda/qanda_write.html')
}
let qanda_send = async (req,res)=>{
    let {write_name,gender,age,email,pone_number,content} = req.body;
    let result = await qanda.create({
        write_name,gender,age,email,pone_number,content
    })
    res.redirect('/qanda/list')
}
let qanda_view = async (req,res)=>{
    let id = req.query.id;
    let result = await qanda.findAll({
        where:{id}
    })
    let view = result[0].dataValues;
    res.render('./main/qanda/qanda_view',{
        view,id
    });
}
let qanda_modify = async (req,res)=>{
    let id = req.query.id;
    let result = await qanda.findAll({
        where:{id}
    })
    let modify = result[0].dataValues;
    res.render('./main/qanda/qanda_modify.html',{
        modify,id
    })
}
let qanda_modify_send = async (req,res)=>{
    let {write_name,gender,age,email,pone_number,content,id} = req.body;
     let modify = await qanda.update({
        write_name,gender,age,email,pone_number,content},{where:{id}} );
        res.redirect(`/qanda/view?id=${id}`);
  }
  let qanda_delete = async (req,res)=>{
    let id = req.query.id
    let result = await qanda.destroy({where:{id}});
    res.redirect('/qanda/list');
}

module.exports = {
    main,login,
    kakao_login,
    kakao_check,
    board_list,
    board_write,
    board_write_send,
    board_modify,
    board_modify_send,
    board_view,
    board_delete,
    qanda_aply,
    qanda_send,
    qanda_list,
    qanda_view,
    qanda_modify,
    qanda_modify_send,
    qanda_delete
}