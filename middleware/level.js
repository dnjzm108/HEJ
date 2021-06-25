const session = require('express-session');

const level = (req,res,next)=>{
    let log = session.authData.local.level;
    console.log(log);
if(log < 2 ){
    console.log('글쓰기 권한이 없습니다.');
    res.redirect('/community?msg=글쓰기 권한이 없습니다.')
}else{
    console.log('권한 허용');
    next()
}
}
module.exports=level;