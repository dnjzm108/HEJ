const { information } = require('../../models/index');
const moment = require('moment');

let info = (req, res) => {
    res.render('./information/info.html');
};

let upload_success = async (req, res) => {
    let { title, content, writer } = req.body;
    let info_image = req.file == undefined ? '' : req.file.path;
    let infoResult = await information.create({ title, content, info_image, writer });
    res.redirect('/info/infolist');
};

let info_list = async (req, res) => {
    let offset = (req.query.id == undefined) ? 0 : 9 * (page - 1);
    let results = await information.findAll({
        limit: 9,
        order: [['id', 'DESC']],
        offset: offset,
    });
    let arrayimage = []
    let arrayid = []
    let arraytitle = []
    let arraydate = []
    let arraycontent = []
    results.forEach((v) => {
        arrayimage.push(v.dataValues.info_image.replace('public', ''));
        arrayid.push(v.dataValues.id);
        arraytitle.push(v.dataValues.title);
        arraydate.push(moment(v.dataValues.date).format("MMM Do YY"));
        arraycontent.push(v.dataValues.content);
    });
    res.render('./information/upload.html', {
        arrayimage,
        arrayid,
        arraytitle,
        arraydate,
        arraycontent,
    });
};

let view = async (req, res) => {
    let { id } = req.query;
    let infoView = await information.findOne({
        where: {
            id: id
        }
    });
    let infoList = infoView.dataValues;
    let infodate = moment(infoList.date).format("MMM Do YY");
    let infoimage = infoList.info_image.replace('public', '');
    res.render('./information/view.html', {
        infoList,
        infodate,
        infoimage,
    });
};

let postDel = async (req, res) => {
    try {
        let id = req.query.id;
        await information.destroy({
            where: { id: id }
        })
        res.redirect('/info/infolist');
    } catch (error) { console.log(error) }
};

let modify = async (req, res) => {
    let modify_id = req.query.id;
    let modify_result = await information.findAll({
        where: { id: modify_id }
    })
    let moList = modify_result[0].dataValues;
    res.render('./information/modify.html', {
        moList,
    });
};

let modify_success = async (req, res) => {
    let { title, content, modifyId } = req.body;
    try {
        let infolist = await information.update({title,content},{
            where: { id:modifyId }
        })
    } catch (e) {
        console.log(e)
    }
    res.redirect(`/info/view?id=${modifyId}`);
}

module.exports = {
    upload_success,
    info,
    info_list,
    view,
    postDel,
    modify,
    modify_success,
}