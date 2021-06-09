const path = require('path')
require('dotenv').config({path: path.join(__dirname, '.env')})
const crypto = require('crypto');

function createHash(userpw){
    const signature = crypto.createHmac('sha256',Buffer.from(process.env.salt))
    .update(userpw)
    .digest('base64')
    .replace('==','')
    .replace('=','')
    
    return signature
}

module.exports =createHash
