const session = require('express-session');

const auth =  (req,res,next)=>{
    if(session.authData == undefined){
        console.log('로그인이 안되있음');
        res.redirect('/user/login?msg=로그인이 필요한 서비스 입니다.')
    }else{
        console.log('로그인됨');
        next()
    }
}

module.exports=auth;