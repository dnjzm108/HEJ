const { information, admin, hired: hiredTd, education, popup: popupTd } = require('./models/index');

let table;

let arr = [information, admin, hiredTd, education, popupTd];
let search = {}
arr.forEach(v => {
    let tableName = `${v.fieldRawAttributesMap.id.Model.tableName}`;
    let obj = {
        [tableName]:v,
    }
    search = {...search, ...obj}
})

// search[table].findAll({})
// .then(data => {
//     console.log(data);
// });

module.exports = search