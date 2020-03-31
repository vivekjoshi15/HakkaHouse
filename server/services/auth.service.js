const User = require('../models/tb_user.model');
const model = require('../models/index.model');
const validator = require('validator');
const { to, TE, ReE } = require('./util.service');

const getUniqueKeyFromBody = function (body) {// this is so they can send in 3 options unique_key, email, or phone and it will work
    let unique_key;
    if (typeof unique_key === 'undefined') {
        if (typeof body.email != 'undefined') {
            unique_key = body.email
        } else {
            unique_key = null;
        }
    }
    return unique_key;
}

const createUser = async (userInfo, res) => {
    let unique_key, auth_info, err;

    auth_info = {};
    auth_info.status = 'create';

    unique_key = getUniqueKeyFromBody(userInfo);
    if (!unique_key) ReE(res,'An email or phone number was not entered.');

    if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(model.tb_user.findOne({ where: { email: unique_key } }));
        if (user !== null) {
            ReE(res,'user with email already exists.')

            return null;
        }
        else {
            [err, user] = await to(model.tb_user.create(userInfo));
            if (err) {
                ReE(res,'user already exists with that email ' + err.message);
            }

            return user;
        }

    } else if (validator.isMobilePhone(unique_key, 'any')) {//checks if only phone number was sent
        auth_info.method = 'phone';
        userInfo.phone = unique_key;
        [err, user] = await to(model.tb_user.findOne({ where: { phone: unique_key } }));
        if (user !== null) {
            ReE(res,'user with phone already exists.')

            return null;
        }
        else {
            [err, user] = await to(model.tb_user.create(userInfo));
            if (err) ReE(res,'user already exists with that phone number' + err.message);

            return user;
        }
    } else {
        ReE(res,'A valid email or phone number was not entered.');
    }
}

const authUser = async function (userInfo, res) {//returns token
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if (!unique_key) ReE(res,'Please enter an email or phone number to login');

    if (!userInfo.password) ReE(res,'Please enter a password to login');
       
    let user;
    if (validator.isEmail(unique_key)) {
        auth_info.method = 'email';
        
        [err, user] = await to(model.tb_user.findOne({ where: { email: unique_key } }));
        if (err) ReE(res,'error '+ err.message);
        if (typeof user === 'undefined' || user === null) {
            ReE(res,'A valid username/email or password was not entered.')
        }
    } else if (validator.isMobilePhone(unique_key, 'any')) {//checks if only phone number was sent
        auth_info.method = 'phone';
       
        [err, user] = await to(model.tb_user.findOne({ where: { phone: unique_key } }));
        if (err) ReE(res,'error '+ err.message);
        if (typeof user === 'undefined' || user === null) {
            ReE(res,'A valid username/email or password was not entered.')
        }
    }else { //checks if only username was sent
        auth_info.method = 'phone';
       
        [err, user] = await to(model.tb_user.findOne({ where: { username: unique_key } }));
        if (err) ReE(res,'error '+ err.message);
        if (typeof user === 'undefined' || user === null) {
            ReE(res,'A valid username/email or password was not entered.')
        }
    }

    if (!user) ReE(res,'Not registered');

    if(user.isactive !== 1){
        ReE(res,'user account is not active');
    }

    [err, user] = await to(user.comparePassword(userInfo.password));
    if (err) ReE(res,err.message);
       
    return user;
}

module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;
module.exports.createUser = createUser;
module.exports.authUser = authUser;

