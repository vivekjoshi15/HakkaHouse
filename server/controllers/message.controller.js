var path = require('path');
const model = require('../models/index.model');
const { to, ReE, ReS } = require('../services/util.service');

const getUserMessages = async function (req, res) {
    const body = req.params;
    let messages, err;
    res.setHeader('Content-Type', 'application/json');
    [err, messages] = await to(model.message.findAll({ where: { user_id: body.user_id, isactive : 1 }, order: [ ['created_at', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { messages: messages });
}

const getSenderMessages = async function (req, res) {
    const body = req.params;
    let messages, err;
    res.setHeader('Content-Type', 'application/json');
    [err, messages] = await to(model.message.findAll({ where: { sender_id: body.user_id, isactive : 1 }, order: [ ['created_at', 'DESC'] ] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { messages: messages });
}

const getById = async function (req, res) {
    const body = req.params;
    let err, message;
    [err, message] = await to(model.message.findOne({ where: { id: body.id, isactive : 1 } }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { message: message });
}

const create = async function (req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body;
        body.created_at = model.sequelize.literal('CURRENT_TIMESTAMP');
        
        let err, message;
        [err, message] = await to(model.message.create(body));
        if (err) ReE(res, err, 422);
        ReS(res, { message: 'Message Created', message: message }, 201);        
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const update = async function (req, res) {
    let message;
    [err, message] = await to(model.message.update(
    {
        message: req.body.message,
        updated_at: model.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    { where: { id: req.params.id } }));

    if (err) {
        ReE(res,'error ' + err.message);
    }

    return ReS(res, { message: 'Message Updated', message: message });
}

const remove = async function (req, res) {
    let id = req.params.id;
    model.message.destroy({
        where: {
            id: id 
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            return ReS(res, { message: 'Message Deleted' }, 204);
        }
    }, function (err) {
        console.log(err);
        return ReE(res, 'error occured while deleting post');
    });
    return ReS(res, { message: 'Message Deleted' }, 204);
}

module.exports.getUserMessages = getUserMessages;
module.exports.getSenderMessages = getSenderMessages;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;