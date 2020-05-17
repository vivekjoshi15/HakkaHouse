var path = require('path');
const model = require('../models/index.model');
const { to, ReE, ReS } = require('../services/util.service');
const { Sequelize } = require('sequelize');

const getAll = async function (req, res) {
    let posts, err;
    res.setHeader('Content-Type', 'application/json');
    [err, posts] = await to(model.post.findAll({ where: { isactive : 1, isprivate : 0 }, include: ["user", "likes", "comments"],  order: [ ['created_at', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { posts: posts });
}

const getUserPosts = async function (req, res) {
    const body = req.params;
    let posts, err;
    res.setHeader('Content-Type', 'application/json');
    [err, posts] = await to(model.post.findAll({ where: { user_id: body.user_id, isactive : 1 }, include: ["user", "likes", "comments"], order: [ ['created_at', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { posts: posts });
}

const getById = async function (req, res) {
    const body = req.params;
    let err, post;
    [err, post] = await to(model.post.findOne({ 
                                where: { id: body.id, isactive : 1 }, 
                                include: ["user", "likes", "comments"],
                            }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { post: post });
}

const create = async function (req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body;
        body.created_at = model.sequelize.literal('CURRENT_TIMESTAMP');
        
        let err, post;
        [err, post] = await to(model.post.create(body));
        if (err) ReE(res, err, 422);
        ReS(res, { message: 'Post Created', post: post }, 201);
        
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const update = async function (req, res) {
    let post;
    [err, post] = await to(model.post.update(
    {
        message: req.body.message,
        updated_at: model.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { where: { id: req.params.id } }));

    if (err) {
        ReE(res,'error ' + err.message);
    }

    return ReS(res, { message: 'Post Updated', post: post });
}

const remove = async function (req, res) {
    let id = req.params.id;
    model.post.destroy({
        where: {
            id: id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            console.log('Deleted successfully');
            return ReS(res, { message: 'Post Deleted' }, 204);
        }
    }, function (err) {
        console.log(err);
        return ReE(res, 'error occured while deleting post');
    });
    return ReS(res, { message: 'Post Deleted' }, 204);
}

const updateIsActive = async function (req, res) {
    let post;
    [err, post] = await to(model.post.update(
    {
        isactive: req.body.isactive,
        updated_at: model.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { where: { id: req.params.id } }));

    if (err) {
        ReE(res,'error ' + err.message);
    }

    return ReS(res, { message: 'Post Updated', post: post });
}

const updateIsPrivate = async function (req, res) {
    let post;
    [err, post] = await to(model.post.update(
    {
        isprivate: req.body.isprivate,
        updated_at: model.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { where: { id: req.params.id } }));

    if (err) {
        ReE(res,'error ' + err.message);
    }

    return ReS(res, { message: 'Post Updated', post: post });
}


module.exports.getAll = getAll;
module.exports.getUserPosts = getUserPosts;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.updateIsActive = updateIsActive;
module.exports.updateIsPrivate = updateIsPrivate;