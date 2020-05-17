const model = require('../models/index.model');
const { to, ReE, ReS } = require('../services/util.service');

let users = async function (req, res, next) {
    let userid, err, user;
    id = req.params.id;
    [err, user] = await to(model.user.findOne({ where: { id: id } }));
    if (err) return ReE(res, "err finding user");

    if (!user) return ReE(res, "user not found with id: " + id);

    req.users = user;
    next();
}
module.exports.users = users;