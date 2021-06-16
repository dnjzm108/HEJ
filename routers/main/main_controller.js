/*
rest key  d71e574bb53209815ff9a1eedf9d85dd
URL  http://localhost:3000/auth/kakao/callback
secretn key  hLAJzSnEQyKo2fujTV2saFCGixSySbHg
*/
/*
google key : AIzaSyDQSByPF9_abC9Gb5PLJK93mNelv-XZzic
client id : 271562730452-rufsjg41rp8hhbno7686je73714i5dpu.apps.googleusercontent.com
client password : wMc8se_eBobJrH2EN-r3JF6z

*/
const axios = require('axios');
const qs = require('qs');
const moment = require('moment');
const session = require('express-session')
const { community, information, user, sequelize, qanda, comment } = require('../../models');


const kakao = {
    clientID: 'd71e574bb53209815ff9a1eedf9d85dd',
    clientSecret: 'hLAJzSnEQyKo2fujTV2saFCGixSySbHg',
    redirectUri: 'http://localhost:3000/auth/kakao/callback'
}
let kakao_in = (req, res) => {
    res.render('./main/kakao.html');
}
let kakao_login = (req, res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile,account_email`;
    res.redirect(kakaoAuthURL);
}
let kakao_check = async (req, res) => {
    let token;
    try {
        token = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }, // npm install qs
            data: qs.stringify({
                grant_type: 'authorization_code', // 특정 스트링 
                client_id: kakao.clientID,
                client_secret: kakao.clientSecret,
                redirectUri: kakao.redirectUri,
                code: req.query.code,
            })
        })
    } catch (err) {
        res.json(err.data)
    }
    let user;
    try {
        user = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: `Bearer ${token.data.access_token}`
            }
        })
    } catch (err) {
        res.json(err.data)
    }
    const authData = {
        ...token.data,
        ...user.data,
    }
    session.authData = { ["kakao"]: authData };
    res.redirect('/');
}

let info = (req, res) => {
    const { authData } = session;
    const provider = Object.keys(authData)[0]

    let userinfo = {}
    switch (provider) {
        case "kakao":
            userinfo = {
                userid: authData[provider].properties.nickname,
            }
            break
    }
    let { nickname } = session.authData.kakao.properties;
    res.render('./main/info.html', {
        nickname: userinfo.userid
    })
}
let kakao_logout = async (req, res) => {
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
}


let main = (req, res) => {
    let id = req.query.id;
    let pw = req.query.pw;
    if(session.authData != null){
    }
    res.render('./main/main.html', {
        id, pw
    })
}

let login = (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    let pw_check = req.body.pw_check;
    console.log('id:' + id, 'pw:' + pw, 'pw_check:' + pw_check);
    res.redirect(`/?id=${id}&pw=${pw}`);
}
// community start

let community_list = async (req, res) => {
    let result = await community.findAll({ raw: true });
    //    let arr = []
    //       result.forEach(v => {
    //          arr.push(v.dataValues.write_date);
    //      });
    //      console.log(result);
    //      console.log(arr);
    //      let dt = moment(arr).format('YYYY년 MM월 DD일')
    //      console.log(dt);
    let arr = result.map(v => {
        return {
            ...v,
            write_date: moment(v.write_date).format('YYYY년 MM월 DD일 hh:mm a')
        }
    })
    console.log("++++++++++++"+arr);
    res.render('./main/community/list.html', {
        result: arr
    })
}
let community_write = (req, res) => {
    let userid;
    if (session.authData.kakao != null) {
        userid = session.authData.kakao.properties.nickname;
    } else if (session.authData.local != null) {
        userid = session.authData.local.userid
    } else if (session.authData.google != null) {
        userid = session.authData.google.userid
    }
    res.render('./main/community/write.html',{
        userid
    })
}
let community_write_send = async (req, res) => {
    let { title, userid, content, type } = req.body;
    let community_image = req.file == undefined ? '' : `/uploads/community/${req.file.filename}`;
    console.log(community_image);
    let write = await community.create({
        title, userid, content, community_image, type,
        hit: 0,
    })
    res.redirect('/community')
}
let community_view = async (req, res) => {
    let id = req.query.id;
    let result = await community.findAll({
        where: { id }
    })
   
    let view = result[0].dataValues;
    let hitNum = await community.update({
        hit: view.hit + 1
    }, { where: { id } });
    let see = await comment.findAll({
        where: { idx:id }
    });
    let dt = moment(view.write_date).format('YYYY년 MM월 DD일 hh:mm a')
    let userid;
    if (session.authData.kakao != null) {
        userid = session.authData.kakao.properties.nickname;
    } else if (session.authData.local != null) {
        userid = session.authData.local.userid
    } else if (session.authData.google != null) {
        userid = session.authData.google.userid
    } else if (session.authData.fecebook != null) {
        userid = session.authData.fecebook.userid
    }

    res.render('./main/community/view.html', {
        view, id, userid, see,dt
    })
}

let community_modify = async (req, res) => {
    let id = req.query.id;
    let result = await community.findAll({
        where: { id }
    })
    let modify = result[0].dataValues;
    res.render('./main/community/modify.html', {
        modify, id
    })
}
let community_modify_send = async (req, res) => {
    let { title, userid, content, type, id,community_image1} = req.body;
    let community_image = req.file == undefined ? community_image1 : `/uploads/community/${req.file.filename}`;
    console.log('modify : '+ community_image);
    console.log('dkdk'+community_image);
    console.log('aaa');
    let modify = await community.update({
        title, userid, content, community_image, type
    }, { where: { id } });
    res.redirect(`/community/view?id=${id}`);
}
let community_delete = async (req, res) => {
    let id = req.query.id
    let result = await community.destroy({ where: { id } });
    res.redirect('/community');
}
//  community end

//comment start
let comment_send = async (req, res) => {
    let { userid, content,id} = req.body;
    let result = await comment.create({
        userid, content,idx:id
    })
    res.redirect(`/community/view?id=${id}`);
}
let comment_delete = async (req, res) => {
    let { id,idx } = req.query;
    let result = await comment.destroy({
        where: { id }
    })
    res.redirect(`/community/view?id=${idx}`)
}

let comment_modify = async (req, res) => {
    let { id,content } = req.body;
    console.log(id);
    console.log(content);
    let result = await comment.update({
        content
    }, { where: { id } });
    console.log('result:'+result);
    res.redirect('/community');
}
//comment end

let qanda_list = async (req, res) => {
    let result = await qanda.findAll({});
    res.render('./main/qanda/qanda_list.html', {
        result
    });
}

let qanda_aply = (req, res) => {
    res.render('./main/qanda/qanda_write.html')
}
let qanda_send = async (req, res) => {
    let { write_name, gender, age, email, pone_number, content } = req.body;
    let result = await qanda.create({
        write_name, gender, age, email, pone_number, content
    })
    res.redirect('/qanda/list')
}
let qanda_view = async (req, res) => {
    let id = req.query.id;
    let result = await qanda.findAll({
        where: { id }
    })
    let view = result[0].dataValues;
    res.render('./main/qanda/qanda_view', {
        view, id
    });
}
let qanda_modify = async (req, res) => {
    let id = req.query.id;
    let result = await qanda.findAll({
        where: { id }
    })
    let modify = result[0].dataValues;
    res.render('./main/qanda/qanda_modify.html', {
        modify, id
    })
}
let qanda_modify_send = async (req, res) => {
    let { write_name, gender, age, email, pone_number, content, id } = req.body;
    let modify = await qanda.update({
        write_name, gender, age, email, pone_number, content
    }, { where: { id } });
    res.redirect(`/qanda/view?id=${id}`);
}
let qanda_delete = async (req, res) => {
    let id = req.query.id
    let result = await qanda.destroy({ where: { id } });
    res.redirect('/qanda/list');
}
let test = (req, res) => {
    res.render('./main/test.html');
}

module.exports = {
    main,
    kakao_in,
    login,
    kakao_login,
    kakao_check,
    community_list,
    community_write,
    community_write_send,
    community_modify,
    community_modify_send,
    community_view,
    community_delete,
    qanda_aply,
    qanda_send,
    qanda_list,
    qanda_view,
    qanda_modify,
    qanda_modify_send,
    qanda_delete,
    test,
    info,
    kakao_logout,
    comment_send,
    comment_delete,
    comment_modify,
}