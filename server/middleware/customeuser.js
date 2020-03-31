const model = require('../models/index.model');
const { to, ReE, ReS } = require('../services/util.service');

let users = async function (req, res, next) {
    let userid, err, user;
    userid = req.params.userid;
    [err, user] = await to(model.tb_user.findOne({ where: { userid: userid } }));
    if (err) return ReE(res, "err finding user");

    if (!user) return ReE(res, "user not found with id: " + userid);

    req.users = user;
    next();
}
module.exports.users = users;