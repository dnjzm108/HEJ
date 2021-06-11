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
const { board, information, user, sequelize, qanda, comment } = require('../../models');


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
    res.render('./main/test.html', {
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

let board_list = async (req, res) => {
    let result = await board.findAll({ raw: true });
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
    res.render('./main/board/list.html', {
        result: arr
    })
}
let board_write = (req, res) => {
    res.render('./main/board/write.html')
}
let board_write_send = async (req, res) => {
    let { title, userid, content, type } = req.body;
    let board_image = req.file == undefined ? '' : `/uploads/board/${req.file.filename}`;
    console.log(board_image);
    let write = await board.create({
        title, userid, content, board_image, type,
        hit: 0,
    })
    res.redirect('/board')
}
let board_view = async (req, res) => {
    let idx = req.query.idx;
    let result = await board.findAll({
        where: { idx }
    })
   
    let view = result[0].dataValues;
    let hitNum = await board.update({
        hit: view.hit + 1
    }, { where: { idx } });
    let see = await comment.findAll({
        where: { idx }
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

    res.render('./main/board/view.html', {
        view, idx, userid, see,dt
    })
}

let comment_send = async (req, res) => {
    let { userid, content, idx } = req.body;
    let result = await comment.create({
        userid, content, idx
    })
    res.redirect(`/board/view?idx=${idx}`);
}
let comment_delete = async (req, res) => {
    let { id, idx } = req.query;
    let result = await comment.destroy({
        where: { id }
    })
    res.redirect(`/board/view?idx=${idx}`)
}

let comment_modify = async (req, res) => {
    let { id,content } = req.body;
    console.log(id);
    console.log(content);
    let result = await comment.update({
        content
    }, { where: { id } });
    console.log('result:'+result);
    //res.redirect('/board');
}

let board_modify = async (req, res) => {
    let idx = req.query.idx;
    let result = await board.findAll({
        where: { idx }
    })
    let modify = result[0].dataValues;
    res.render('./main/board/modify.html', {
        modify, idx
    })
}
let board_modify_send = async (req, res) => {
    let { title, userid, content, type, idx,board_image1} = req.body;
    let board_image = req.file == undefined ? board_image1 : `/uploads/board/${req.file.filename}`;
    console.log('modify : '+ board_image);
    console.log('dkdk'+board_image);
    console.log('aaa');
    let modify = await board.update({
        title, userid, content, board_image, type
    }, { where: { idx } });
    res.redirect(`/board/view?idx=${idx}`);
}
let board_delete = async (req, res) => {
    let idx = req.query.idx
    let result = await board.destroy({ where: { idx } });
    res.redirect('/board');
}

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
    qanda_delete,
    test,
    info,
    kakao_logout,
    comment_send,
    comment_delete,
    comment_modify,
}