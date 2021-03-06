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
const session = require('express-session');
const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socket(server);
const { community, user, sequelize, qanda, comment, apply } = require('../../models');
const search = require('../../serach');
const pagination = require('../../pagination');
// const comment = require('../../models/comment');


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
};

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
};

let main = async (req, res) => {
    let userid;
    let id = req.query.id;
    let pw = req.query.pw;
    if (session.authData != null) {
        if (session.authData.kakao != null) {
            userid = session.authData.kakao.properties.nickname;
        } else if (session.authData.local != null) {
            userid = session.authData.local.userid
        } else if (session.authData.google != null) {
            userid = session.authData.google.username
        }
    }
    let popup = await search['popup'].findAll({ where: { visibility: 1 }, raw: true });
    let idArr = '';
    let type = [];
    popup.forEach(v => {
        idArr += v.id + ','
        type.push(v.type);
    });
    let {msg} = req.query;
    res.render('./main/apple.html', {
        id, pw, popup, idArr, userid, session: session.authData, msg
    });
};

let login = (req, res) => {
    let id = req.body.id;
    let pw = req.body.pw;
    let pw_check = req.body.pw_check;
    res.redirect(`/?id=${id}&pw=${pw}`);
};

/*================================= community start ==============================================*/

let community_list = async (req, res) => {
    let { localUrl } = req.params;
    let { id } = req.query;
    let page = { localUrl: `${localUrl}`, id: `${id}`, table: 'community' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let {msg} = req.query;
    let commList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            write_date: moment(v.write_date).format("MMM Do YY"),
            num: v.num
        }
    });
    let userid;
    if (session.authData != null) {
        if (session.authData.kakao != null) {
            userid = session.authData.kakao.properties.nickname;
        } else if (session.authData.local != null) {
            userid = session.authData.local.userid
        } else if (session.authData.google != null) {
            userid = session.authData.google.username
        }
    }
    let tables = await community.findAll({ raw: true });
    if (tables != undefined) {
        let arr = tables.map(v => {
            return {
                ...v,
                write_date: moment(v.write_date).format('YYYY년 MM월 DD일 hh:mm a')
            }
        })
    }
    let edMenu = await search['education'].findAll({ where: { visibility: 1 } });
    res.render('./main/menu/community_list.html', {
        pagin: pagin.page_hired,
        commList,userid,localUrl,session:session.authData,msg,
        edMenu
    });

}
let community_write = (req, res) => {
    let {type} = req.query;
    let userid;
    if (session.authData.kakao != null) {
        userid = session.authData.kakao.properties.nickname;
    } else if (session.authData.local != null) {
        userid = session.authData.local.userid
    } else if (session.authData.google != null) {
        userid = session.authData.google.username
    }
    res.render('./main/community/write.html',{
        userid,type
    })
}
let community_write_send = async (req, res) => {
    let { title, userid, content, type } = req.body;
    // let community_image = req.file == undefined ? '' : `/uploads/community/${req.file.filename}`;
    let write = await community.create({
        title, userid, content, type,writer:userid,
        hit: 0,
    });
    res.redirect('/community')
};
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
        where: { idx: id }
    });
    let dt = moment(view.write_date).format('YYYY년 MM월 DD일 hh:mm a')
    let userid;
    if (session.authData.kakao != null) {
        userid = session.authData.kakao.properties.nickname;
    } else if (session.authData.local != null) {
        userid = session.authData.local.userid
    } else if (session.authData.google != null) {
        userid = session.authData.google.username
    }

    res.render('./main/community/view.html', {
        view, id, userid, see, dt ,
    })
}

let community_modify = async (req, res) => {
    let id = req.query.id;
    let modi = await community.findAll({
        where: { id }
    })
    let modify = modi[0].dataValues;
    res.render('./main/community/write.html', {
        modify,id
    })
}

let community_modify_send = async (req, res) => {
    let { title, userid, content, type, id } = req.body;
    console.log(title, userid, content, type, id);
    let modify = await community.update({
        title, userid, content, type
    }, { where: { id } });
   
    res.redirect(`/community`);
};

let community_delete = async (req, res) => {
    let {id,localUrl} = req.query
    let result = await community.destroy({ where: { id } });
    res.redirect(`/community/${localUrl}`);
};
//  community end

//comment start
let comment_send = async (req, res) => {
    let { table,localUrl,userid , content , id } = req.body;
    let result = await comment.create({
        userid, content, idx : id
    })
    res.redirect(`/admin/view?id=${id}&table=${table}&localUrl=${localUrl}`);
}
let comment_delete = async (req, res) => {
    let { id, idx } = req.query;
    let result = await comment.destroy({
        where: { id }
    })
    res.redirect(`/community/view?id=${idx}`)
}

let comment_modify = async (req, res) => {
    let { id, content } = req.body;
    let result = await comment.update({
        content
    }, { where: { id } });
    res.redirect('/community');
};
//comment end

let test = (req, res) => {
    res.render('./main/test.html');
}

let chat = (req, res) => {
    res.render('./main/chat.html');

}

let information = async (req, res) => {
    let { localUrl } = req.params;

    let resultsall = await search['information'].findAll({ where: { type: `${localUrl}`, visibility: 1 }, raw: true });
    let userid;
    if (session.authData != null) {
        if (session.authData.kakao != null) {
            userid = session.authData.kakao.properties.nickname;
        } else if (session.authData.local != null) {
            userid = session.authData.local.userid
        } else if (session.authData.google != null) {
            userid = session.authData.google.username
        }
    }
    let infoList = resultsall.map(v => {
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY"),
            visibility: v.visibility == 0 ? "invisible" : "visible"
        }
    });
    let idArr = '';
    infoList.forEach(v => {
        idArr += v.id + ','
    })
    let edMenu = await search['education'].findAll({ where: { visibility: 1 } });
    res.render('./main/menu/information_list.html', {
         infoList, idArr, localUrl, edMenu,userid,session:session.authData })
}

let hired = async (req, res) => {
    let { localUrl } = req.params;
    let { id } = req.query;
    let page = { localUrl: `${localUrl}`, id: `${id}`, table: 'hired' }
    let pagin = await pagination(page);
    let result = pagin.result;
    let userid;
    if (session.authData != null) {
        if (session.authData.kakao != null) {
            userid = session.authData.kakao.properties.nickname;
        } else if (session.authData.local != null) {
            userid = session.authData.local.userid
        } else if (session.authData.google != null) {
            userid = session.authData.google.username
        }
    }
    let hireList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY")
        }
    })
    let edMenu = await search['education'].findAll({ where: { visibility: 1 } });
    res.render('./main/menu/hired_list.html', {
        pagin: pagin.page_hired,
        hireList,
        localUrl,
        edMenu,
        userid,session:session.authData
    })
}

let education = async (req, res) => {
    let {localUrl} = req.params;
    let { id } = req.query;
    let page = { id: `${id}`, table: 'education'};
    let pagin = await pagination(page);
    let result = pagin.result;
    let userid;
    if (session.authData != null) {
        if (session.authData.kakao != null) {
            userid = session.authData.kakao.properties.nickname;
        } else if (session.authData.local != null) {
            userid = session.authData.local.userid
        } else if (session.authData.google != null) {
            userid = session.authData.google.username
        }
    }
    let edList = result.map(v => {
        v.num = pagin.totalrecord - pagin.offset;
        pagin.totalrecord--;
        return {
            ...v,
            date: moment(v.date).format("MMM Do YY"),
            ed_start_period:moment(v.ed_start_period).format('YYYY-DD-MM'),
            ed_end_period:moment(v.ed_end_period).format('YYYY-MM-DD'),
            num: v.num
        }
    });
    let edMenu = await search['education'].findAll({ where: { visibility: 1 } });
    res.render('./main/menu/education.html', {
        edList,
        pagin: pagin.page_hired,
        edMenu,
        localUrl,
        userid,session:session.authData
    })
}

let ed_view = async(req,res)=>{
    let { id } = req.query;
    let edMenu = await search['education'].findAll({ where: { visibility: 1 } });
    let edItem = await search['education'].findAll({where:{id}});
    res.render('./main/menu/education_view',{
        edMenu,
        edItem
    })
}

let view = async (req, res) => {
    let { id, table, localUrl } = req.query;
    let infoView = await search[table].findOne({ where: { id } })
    let see = await comment.findAll({
        where:{idx:id}
    })
    let result = await community.findAll({
        where: { id }
    })
    let view = result[0].dataValues;
    let hitNum = await search[table].update({
        hit: view.hit + 1
    }, { where: { id } });
    let location = 0;
    let userid;
    if(session.authData != null){
    if (session.authData.kakao != null) {
        userid = session.authData.kakao.properties.nickname;
    } else if (session.authData.local != null) {
        userid = session.authData.local.userid
    } else if (session.authData.google != null) {
        userid = session.authData.google.username
    }
}
    let infoList = infoView.dataValues;
    let infodate = moment(infoList.date).format("MMM Do YY");
    res.render('./main/menu/menu_view.html', {
        infoList,
        infodate,
        table,
        localUrl,
        see,
        id,location,userid
    });
}

let apply_form = async(req,res)=>{
    let { name, age, number, content,userdt } = req.body;
    console.log("3333333333",name,age,number,content);
    let rst = await apply.create({
        name, age, number, content, userdt
    })
    console.log(rst);
    res.redirect('/');
}
module.exports = {
    main,
    apply_form,
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
    test,
    info,
    kakao_logout,
    comment_send,
    comment_delete,
    comment_modify,
    chat,
    information,
    hired,
    education,
    view,
    ed_view
}