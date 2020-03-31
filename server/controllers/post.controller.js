var path = require('path');
const model = require('../models/index.model');
const { to, ReE, ReS } = require('../services/util.service');

const getAll = async function (req, res) {
    let posts, err;
    res.setHeader('Content-Type', 'application/json');
    [err, posts] = await to(model.tb_post.findAll({ where: { isactive : 1 }, order: [ ['createddate', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { posts: posts });
}

const getUserPosts = async function (req, res) {
    const body = req.params;
    let posts, err;
    res.setHeader('Content-Type', 'application/json');
    [err, posts] = await to(model.tb_post.findAll({ where: { userid: body.userid, isactive : 1 }, order: [ ['createddate', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { posts: posts });
}

const getById = async function (req, res) {
    const body = req.params;
    let err, post;
    [err, post] = await to(model.tb_post.findOne({ where: { postid: body.postid, isactive : 1 } }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { post: post });
}

const create = async function (req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body;
        body.createddate=model.sequelize.literal('CURRENT_TIMESTAMP');
        
        let err, post;
        [err, post] = await to(model.tb_post.create(body));
        if (err) ReE(res, err, 422);
        ReS(res, { message: 'Successfully created post.', post: post }, 201);
        
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const update = async function (req, res) {
    let post;
    [err, post] = await to(model.tb_post.update(
    {
            message: req.body.message,
            isprivate: req.body.isprivate,
            isactive: req.body.isactive,
            modifieddate: model.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { where: { postid: req.params.postid } }));

    if (err) {
        ReE(res,'error ' + err.message);
    }

    return ReS(res, { message: 'Post Updated: ', post: post });
}

const remove = async function (req, res) {
    let postid = req.params.postId;
    model.tb_post.destroy({
        where: {
            postid: postid //this will be your id that you want to delete
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

module.exports.getAll = getAll;
module.exports.getUserPosts = getUserPosts;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;