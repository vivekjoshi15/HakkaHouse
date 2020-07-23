const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const CountryController = require('../controllers/country.controller');
const PostController = require('../controllers/post.controller');
const CommentController = require('../controllers/comment.controller');
const LikeController = require('../controllers/like.controller');
const MessageController = require('../controllers/message.controller');
const passport = require('passport');

//user Routes
//url: localhost:3000/v1/users
router.post('/login', UserController.login);
router.post('/createUser', UserController.createUser);
router.post('/uploadImage', UserController.uploadImage);
router.post('/forgetPassword', UserController.forgetPassword);
router.get('/users',  passport.authenticate('jwt', { session: false }), UserController.getAllUsers);
router.get('/getUserById/:id', passport.authenticate('jwt', { session: false }), UserController.getById);
router.get('/getByUsername/:username', passport.authenticate('jwt', { session: false }), UserController.getByUsername);
router.put('/updateUser/:id', passport.authenticate('jwt', { session: false }), UserController.update);
router.delete('/deleteUser/:id', passport.authenticate('jwt', { session: false }), UserController.remove);

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
router.get('/getAllUserPosts/:user_id', passport.authenticate('jwt', { session: false }), PostController.getUserPosts);
router.post('/getAllUsersPosts', passport.authenticate('jwt', { session: false }), PostController.getUsersPosts);
router.get('/getPostById/:id', passport.authenticate('jwt', { session: false }), PostController.getById);
router.post('/createPost', passport.authenticate('jwt', { session: false }), PostController.create);
router.put('/updatePost/:id', passport.authenticate('jwt', { session: false }), PostController.update);
router.delete('/removePost/:id', passport.authenticate('jwt', { session: false }), PostController.remove);
router.put('/updateIsActive/:id', passport.authenticate('jwt', { session: false }), PostController.updateIsActive);
router.put('/updateIsPrivate/:id', passport.authenticate('jwt', { session: false }), PostController.updateIsPrivate);
router.post('/uploadPostImage', PostController.uploadPostImage);

//comment
router.get('/getPostComments/:post_id', passport.authenticate('jwt', { session: false }), CommentController.getPostComments);
router.get('/getCommentById/:id', passport.authenticate('jwt', { session: false }), CommentController.getById);
router.post('/createComment', passport.authenticate('jwt', { session: false }), CommentController.create);
router.put('/updateComment/:id', passport.authenticate('jwt', { session: false }), CommentController.update);
router.delete('/removeComment/:id', passport.authenticate('jwt', { session: false }), CommentController.remove);

//like
router.get('/getPostLikes/:post_id', passport.authenticate('jwt', { session: false }), LikeController.getPostLikes);
router.get('/getLikeById/:id', passport.authenticate('jwt', { session: false }), LikeController.getById);
router.post('/createLike', passport.authenticate('jwt', { session: false }), LikeController.create);
router.put('/updateLike/:id', passport.authenticate('jwt', { session: false }), LikeController.update);
router.delete('/removeLike/id', passport.authenticate('jwt', { session: false }), LikeController.remove);

//message
router.get('/getUserMessages/:user_id', passport.authenticate('jwt', { session: false }), MessageController.getUserMessages);
router.get('/getSenderMessages/:user_id', passport.authenticate('jwt', { session: false }), MessageController.getSenderMessages);
router.get('/getMessageById/:id', passport.authenticate('jwt', { session: false }), MessageController.getById);
router.post('/createMessage', passport.authenticate('jwt', { session: false }), MessageController.create);
router.put('/updateMessage/:id', passport.authenticate('jwt', { session: false }), MessageController.update);
router.delete('/removeMessage/:id', passport.authenticate('jwt', { session: false }), MessageController.remove);

module.exports = router;