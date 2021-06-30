const search = require('./serach');

async function pagination(pagin) {
    
    let page = (pagin.id == 'undefined') ? 1 : pagin.id;
    let offset = (pagin.id == 'undefined') ? 0 : 9 * (page - 1);
    let page_hired = [];
    let resultall;
    let result;

    if(pagin.localUrl == 'undefined'){
        if(pagin.table == "education"){
            resultsall = await search[pagin.table].findAll({where:{visibility:1}});
            result = await search[pagin.table].findAll({
                raw: true,
                limit: 9,
                order: [['id', 'DESC']],
                offset: offset,
                where:{visibilit:1},
            });
            let totalrecord = resultsall.length;
            let total_page = Math.ceil(totalrecord / 9);
            for (i = 1; i <= total_page; i++) {
                page_hired.push(i);
            };
            return {page_hired,result,totalrecord,offset};
        }
        resultsall = await search[pagin.table].findAll({});
        result = await search[pagin.table].findAll({
            raw: true,
            limit: 9,
            order: [['id', 'DESC']],
            offset: offset,
        });
        let totalrecord = resultsall.length;
        let total_page = Math.ceil(totalrecord / 9);
        for (i = 1; i <= total_page; i++) {
            page_hired.push(i);
        };
        return {page_hired,result,totalrecord,offset};
    }

    if(pagin.localUrl != undefined){
        resultsall = await search[pagin.table].findAll({ where: { type: `${pagin.localUrl}` } })
        result = await search[pagin.table].findAll({
            where: { type: `${pagin.localUrl}` },
            raw: true,
            limit: 9,
            order: [['id', 'DESC']],
            offset: offset,
        });
    }else{
        resultsall = await search[pagin.table].findAll({});
        result = await search[pagin.table].findAll({
            raw: true,
            limit: 9,
            order: [['id', 'DESC']],
            offset: offset,
        });
    }
    let totalrecord = resultsall.length;
    let total_page = Math.ceil(totalrecord / 9);
    for (i = 1; i <= total_page; i++) {
        page_hired.push(i);
    };

    return {page_hired,result,totalrecord,offset}
}

module.exports = pagination