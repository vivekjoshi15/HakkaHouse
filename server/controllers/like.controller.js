var path = require('path');
const model = require('../models/index.model');
const { to, ReE, ReS } = require('../services/util.service');

const getPostLikes = async function (req, res) {
    const body = req.params;
    let likes, err;
    res.setHeader('Content-Type', 'application/json');
    [err, likes] = await to(model.like.findAll({ where: { post_id: body.post_id, isactive : 1 }, order: [ ['created_at', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { likes: likes });
}

const getById = async function (req, res) {
    const body = req.params;
    let err, like;
    [err, like] = await to(model.like.findOne({ where: { id: body.id, isactive : 1 } }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { like: like });
}

const create = async function (req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body;
        body.created_at = model.sequelize.literal('CURRENT_TIMESTAMP');
        
        let err, like;
        [err, like] = await to(model.like.create(body));
        if (err) ReE(res, err, 422);
        ReS(res, { message: 'Like Created', like: like }, 201);        
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const update = async function (req, res) {
    let like;
    [err, like] = await to(model.like.update(
    {
        isactive: req.body.isactive,
        updated_at: model.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { where: { id: req.params.id } }));

    if (err) {
        ReE(res,'error ' + err.message);
    }

    return ReS(res, { message: 'Like Updated', like: like });
}

const remove = async function (req, res) {
    let id = req.params.id;
    model.like.destroy({
        where: {
            id: id 
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            return ReS(res, { message: 'Like Deleted' }, 204);
        }
    }, function (err) {
        console.log(err);
        return ReE(res, 'error occured while deleting post');
    });
    return ReS(res, { message: 'Like Deleted' }, 204);
}


module.exports.getPostLikes = getPostLikes;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;