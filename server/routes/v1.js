const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const CountryController = require('../controllers/country.controller');
const PostController = require('../controllers/post.controller');
const passport = require('passport');

//user Routes
//url: localhost:3000/v1/users
router.post('/login', UserController.login);
router.post('/createUser', UserController.createUser);
router.post('/uploadImage', UserController.uploadImage);
router.post('/forgetPassword', UserController.forgetPassword);
router.get('/users',  passport.authenticate('jwt', { session: false }), UserController.getAllUsers);
router.get('/getUserById/:userid', passport.authenticate('jwt', { session: false }), UserController.getById);
router.get('/getByUsername/:username', passport.authenticate('jwt', { session: false }), UserController.getByUsername);
router.put('/updateUser/:userid', passport.authenticate('jwt', { session: false }), UserController.update);
router.delete('/deleteUser/:userid', passport.authenticate('jwt', { session: false }), UserController.remove);

router.get('/usersByCSC/:city/:state/:country',  passport.authenticate('jwt', { session: false }), UserController.getUsersByCSC);

//Country/State/City Routes
router.get('/phonecodes',  CountryController.getPhoneCodes);
router.get('/countries',  CountryController.getAllCountries);
router.get('/states/:id',  CountryController.getCountryStates);
router.get('/cities/:id',  CountryController.getStateCities);
router.get('/country/:name',  CountryController.getCountryByName);
router.get('/city/:name',  CountryController.getCityByName);
router.get('/cityinfo/:id',  CountryController.getCityDetail);

//post Routes
router.get('/getAllPosts', passport.authenticate('jwt', { session: false }), PostController.getAll);
router.get('/getAllUserPosts/:userid', passport.authenticate('jwt', { session: false }), PostController.getUserPosts);
router.get('/getPostById/:postid', passport.authenticate('jwt', { session: false }), PostController.getById);
router.post('/createPost', passport.authenticate('jwt', { session: false }), PostController.create);
router.put('/updatePost/:postid', passport.authenticate('jwt', { session: false }), PostController.update);
router.delete('/removePost', passport.authenticate('jwt', { session: false }), PostController.remove);

module.exports = router;