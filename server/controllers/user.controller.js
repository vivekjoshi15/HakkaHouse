const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
var path = require('path');
var multer  = require('multer');
var upload = multer().array('imgCollection');

const model = require('../models/index.model');
const authService = require('../services/auth.service');
const { to, ReE, ReS } = require('../services/util.service');

const getAllUsers = async function (req, res) {
    let user, err;
    res.setHeader('Content-Type', 'application/json');
    [err, user] = await to(model.user.findAll());
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { users: user });
}

const getById = async function (req, res) {
    const body = req.params;
    let err, user;
    [err, user] = await to(model.user.findOne({ where: { id: body.id, isactive : 1 } }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { user: user });
}

const getByUsername = async function (req, res) {
    const body = req.params;
    let err, user;
    [err, user] = await to(model.user.findOne({ where: { username: body.username, isactive : 1 } }));
    if (err) return ReE(res, err, 422);
    return ReS(res, { user: user });
}

const update = async function (req, res) {
    let user;
    if(req.body.password =='')
    {
        [err, user] = await to(model.user.update(
        {
            role_id: req.body.role_id,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            country: req.body.country,
            phonecode: req.body.phonecode,
            phone: req.body.phone,
            language: req.body.language,
            gender: req.body.gender,
            birthday: req.body.birthday,
            isactive: req.body.isactive,
        },
        { where: { id: req.params.id } }));

        if (err) {
            ReE(res,'error ' + err.message);
        }
    }
    else
    {     
        let salt, hash, password
        [err, salt] = await to(bcrypt.genSalt(10));
        if(err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(req.body.password, salt));
        if(err) TE(err.message, true);

        password = hash;

        [err, user] = await to(model.user.update(
        {
            role_id: req.body.role_id,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: password,
            address: req.body.address,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            country: req.body.country,
            phone: req.body.phone,
            language: req.body.language,
            gender: req.body.gender,
            birthday: req.body.birthday,
            isactive: req.body.isactive,
        },
        { where: { id: req.params.id } }));

        if (err) {
            ReE(res,'error ' + err.message);
        }
    }

    return ReS(res, { message: 'User Updated: ' + req.body.firstname, user: user });
}

const createUser = async function (req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body;
        if (!body.email) {
            ReE(res, 'Please enter an email to register.');
        } else {
            let err, user;
            [err, user] = await to(authService.createUser(body, res));
            if (err) ReE(res, err, 422);
            ReS(res, { message: 'Successfully created new user.', token: user.getJWT(user), user: user.toWeb() }, 201);
        }
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const uploadImage = async function (req, res) {
    // Imports the Google Cloud client library.
    const {Storage} = require('@google-cloud/storage');

    const storage = new Storage({projectId: 'hakka-house', keyFilename: path.join(__dirname, '../creds.json')});
    var url ='';

    try {
        res.setHeader('Content-Type', 'application/json');
        
        let file = req.file;
        let bucketName = 'hakkahouseassets';
        let bucket = storage.bucket(bucketName);
        const { originalname, buffer } = file

        let newFileName = req.body.folder + '/' + originalname.replace(/ /g, "_");

        let blob = bucket.file(newFileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('finish', () => {
            url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        })
        .on('error', (error) => {
            ReE(res,'Something is wrong! Unable to upload at the moment.' + error);
        })
        .end(buffer);  

        //Updating User table for profile image       
        let err, user; 
        url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        [err, user] = await to(model.user.update(
        {
            profileimage: url,
        },
        { where: { id: req.body.id } }));

        if (err) {
            ReE(res,'error ' + err.message);
        }          

        ReS(res, { message: 'File is uploaded.', image: url }, 201);
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const get = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let user = req.users;
    console.log(req);
    return ReS(res, { user: user.toWeb() });
}

const remove = async function (req, res) {
    let id = req.params.id;
    model.user.destroy({
        where: {
            id: id //this will be your id that you want to delete
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            console.log('Deleted successfully');
            return ReS(res, { message: 'User Deleted' }, 204);
        }
    }, function (err) {
        console.log(err);
        return ReE(res, 'error occured while deleting user');
    });
    return ReS(res, { message: 'User Deleted' }, 204);
}

const login = async function (req, res) {
    let err, user;

    [err, user] = await to(authService.authUser(req.body, res));
    if (err) {
        console.log(err);
        return ReE(res, err, 422);
    }
    const token = user.getJWT(user);
    //res.cookie('token', token, { httpOnly: true });

    return ReS(res, { token: token, user: user.toWeb() });
}

const forgetPassword = async function (req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body;
        if (!body.email) {
            ReE(res, 'Please enter valid email or username.');
        } else {
            let err, user;
            [err, user] = await to(authService.createUser(body, res));
            if (err) ReE(res, err, 422);
            ReS(res, { message: 'please check your email for password recovery.', user: user.toWeb() }, 201);
        }
    }
    catch (err) {
        ReE(res, err, 422);
    }
}

const getUsersByCSC = async function (req, res) {
    const body = req.params;
    let err, user;
    if(body.city && body.city != 0){
        [err, user] = await to(model.user.findAll({ where: { city: body.city, isactive : 1 }, attributes: ['id', 'username', 'firstname', 'lastname', 'profileimage'] }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { user: user });
    }
    else if(body.state && body.state != 0){
        [err, user] = await to(model.user.findAll({ where: { state: body.state, isactive : 1 }, attributes: ['id', 'username', 'firstname', 'lastname', 'profileimage'] }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { user: user });
    }
    else if(body.country && body.country != 0){
        [err, user] = await to(model.user.findAll({ where: { country: body.country, isactive : 1 }, attributes: ['id', 'username', 'firstname', 'lastname', 'profileimage'] }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { user: user });
    }
    else {
        [err, user] = await to(model.user.findAll({ where: { isactive : 1 }, attributes: ['id', 'username', 'firstname', 'lastname', 'profileimage'] }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { user: user });
    }
}

module.exports.getAllUsers = getAllUsers;
module.exports.getById = getById;
module.exports.getByUsername = getByUsername;
module.exports.createUser = createUser;
module.exports.uploadImage = uploadImage;
module.exports.update = update;
module.exports.get = get;
module.exports.login = login;
module.exports.remove = remove;
module.exports.forgetPassword = forgetPassword;
module.exports.getUsersByCSC = getUsersByCSC;