/*
rest key  d71e574bb53209815ff9a1eedf9d85dd
URL  http://localhost:3000/auth/kakao/callback
secretn key  hLAJzSnEQyKo2fujTV2saFCGixSySbHg
*/
const axios = require('axios');
const qs = require('qs');


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
    res.render('./main/main.html',{
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

module.exports = {
    main,login,kakao_login,kakao_check,
}