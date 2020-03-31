const { ExtractJwt, Strategy } = require('passport-jwt');
const model = require('../models/index.model');
const CONFIG = require('../config/config');
const { to } = require('../services/util.service');

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        let err, user;
        console.log(jwt_payload);
        [err, user] = await to(model.tb_user.findOne({ where: { userid: jwt_payload.userid } }));

        if(err) return done(err, false);
        if(user) {
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));
}