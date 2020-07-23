var path = require('path');
const model = require('../models/index.model');
const { to, ReE, ReS } = require('../services/util.service');

const getPostComments = async function (req, res) {
    const body = req.params;
    let comments, err;
    res.setHeader('Content-Type', 'application/json');
    [err, comments] = await to(model.comment.findAll({ where: { post_id: body.post_id, isactive : 1 }, include: ["user", "post"], order: [ ['createddate', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { comments: comments });
}

const getById = async function (req, res) {
    const body = req.params;
    let err, comment;
    [err, comment] = await to(model.comment.findOne({ where: { id: body.id, isactive : 1 }, include: ["user", "post"] }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { comment: comment });
}

const create = async function (req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body;
        body.created_at = model.sequelize.literal('CURRENT_TIMESTAMP');
        
        let err, comment;
        [err, comment] = await to(model.comment.create(body));
        if (err) ReE(res, err, 422);
        ReS(res, { message: 'Post Created', comment: comment }, 201);        
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const update = async function (req, res) {
    let comment;
    [err, comment] = await to(model.comment.update(
    {
        message: req.body.message,
        updated_at: model.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { where: { id: req.params.id } }));

    if (err) {
        ReE(res,'error ' + err.message);
    }

    return ReS(res, { message: 'Comment Updated', comment: comment });
}

const remove = async function (req, res) {
    let id = req.params.id;
    model.comment.destroy({
        where: {
            id: id 
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            return ReS(res, { message: 'Comment Deleted' }, 204);
        }
    }, function (err) {
        console.log(err);
        return ReE(res, 'error occured while deleting post');
    });
    return ReS(res, { message: 'Comment Deleted' }, 204);
}


module.exports.getPostComments = getPostComments;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;