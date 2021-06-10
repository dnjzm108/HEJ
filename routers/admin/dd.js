let notice_list = async (req, res) => {
    let page = (req.query.id == undefined) ? 1 : req.query.id;
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let page_hired = [];

    let resultsall = await hiredrmation.findAll({
        where:{
            type:'notice'
        }
    })
        .then((resultall) => {
            let totalrecord = resultall.length+1;
            return totalrecord;
        }).catch((error) => {
            console.log(error);
        });

    let results = await hiredrmation.findAll({
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
        where:{
            type:'notice'
        }
    }).then((result) => {

        let total_page = Math.ceil(resultsall / 9);
        for (i = 1; i <= total_page; i++) {
            page_hired.push(i);
        };
        let hiredimage = []
        let hiredid = []
        let hiredtitle = []
        let hireddate = []
        let hiredcontent = []
        let hiredRealId = []
        result.forEach(ele => {
            ele.num = resultsall - offset;
            resultsall--;
            hiredimage.push(ele.dataValues.hired_image.replace('public', ''));
            hiredid.push(resultsall);
            hiredtitle.push(ele.dataValues.title);
            hireddate.push(moment(ele.dataValues.date).format("MMM Do YY"));
            hiredcontent.push(ele.dataValues.content);
            hiredRealId.push(ele.dataValues.id);
        });
        res.render('./admin/notice_list.html', {
            pagination:page_hired,
            hiredimage,
            hiredid,
            hiredtitle,
            hireddate,
            hiredcontent,
            hiredRealId,
        });
    }).catch((error) => {
        console.log(error);
    })
};


/* ============================== MAP ================================== */

let edList = result.map(v=>{
    v.dataValues.ed_image = v.dataValues.ed_image.replace('public','')
    return v
})
let edList = result.map(el =>el.get({ plain: true }));