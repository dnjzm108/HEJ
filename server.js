const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const session = require('express-session');
const router = require('./routers/index');
const {board,information,user,sequelize} = require('./models');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors());
app.use(session({
    secret:'aa',
    resave:true,
    secure:false,
    saveUninitialized:false,
}))
app.use(express.static('public'));
app.use(cookieParser());

sequelize.sync({force:false})
.then(()=>{
    console.log('접속이 완료 되었습니다');
})
.catch((e)=>{
    console.log(e);
    console.log('접속 에러');
})

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine','html');
nunjucks.configure('views',{
    express:app
})

app.use('/',router);

app.listen(3000,()=>{
    console.log('server start port:3000');
})