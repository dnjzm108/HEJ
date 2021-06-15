const { information, admin, hired: hiredTd, education, popup: popupTd, community:communityTd, user } = require('./models/index');


let arr = [information, admin, hiredTd, education, popupTd , communityTd, user];
let search = {}
arr.forEach(v => {
    let tableName = `${v.fieldRawAttributesMap.id.Model.tableName}`;
    let obj = {
        [tableName]:v,
    }
    search = {...search, ...obj}
});

module.exports = search