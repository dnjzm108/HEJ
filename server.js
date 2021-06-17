const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const session = require('express-session');
const router = require('./routers/index');
const mysql2 = require('mysql2');
const mysql = require('mysql');
const {community,information,user,sequelize} = require('./models');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./middleware/auth');
const socket = require ('socket.io');
const http = require ('http');
const server = http.createServer(app);
const io = socket(server);

app.use(cors());
app.use(session({
    secret:'aa',
    resave:true,
    secure:false,
    saveUninitialized:false,
}))
app.use(express.static('node_modules/socket.io/client-dist'));
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

app.use(bodyParser.urlencoded({extended:false,}));
app.set('view engine','html');
nunjucks.configure('views',{
    express:app
})

app.use('/',router);

io.sockets.on('connection',(socket)=>{
    socket.on('newUser',(name)=>{
        console.log(name +'님이 접속하였습니다');
        socket.name=name;
        socket.broadcast.emit('update',{type:'connect',name:'SERVER',message:name+'님이 접속 하였습니다.'})
    })
   socket.on('message',(data)=>{
       data.name = socket.name;
       console.log(data);
       socket.broadcast.emit('update',data);
   })
   socket.on('disconnect',()=>{
       console.log(socket.name+'님이 나가셨습니다');
       socket.broadcast.emit('update',{type:'disconnect',name:'SERVER',message:socket.name+'님이 나가셨습니다.'})
   })
   socket.on('send',(talk)=>{
    socket.broadcast.emit('msg',{name:socket.name,content:talk});
   })
    })

server.listen(3000,()=>{
    console.log('server start port:3000');
})