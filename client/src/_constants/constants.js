var ENV_URI = 'https://www.hakka.house/';
var WEB_URI = 'http://localhost:5000/';

export default {
    // env
    ENV_URI: ENV_URI,
    // web
    WEB_URI: WEB_URI,
    // login
    LOGIN_USER: 'LOGIN_USER',
    LOGOUT_USER: 'LOGOUT_USER',
    LOGIN_URL: '/v1/login',
    SIGNUP_URI: '/v1/createUser',
    UPDATE_URI: '/v1/updateUser',
    GET_USER_URL: '/v1/getUserById',
    GET_USERNAME_URL: '/v1/getByUsername',
    LOGOUT_URI: '/v1/signout',
    UPLOADIMAGE_URI: '/v1/uploadImage',
    FORGET_PASSWORD_URL: '/v1/forgetPassword',
    
    COUNTRIES_URL: '/v1/countries',
    STATES_URL: '/v1/states',
    CITIES_URL: '/v1/cities',
    PHONECODE_URL: '/v1/phonecodes',
    GET_COUNTRY_URL: '/v1/country',
    GET_CITY_URL: '/v1/city',
    GET_CITY_INFO_URL: '/v1/cityinfo',
    GET_USERS_CSC_URL: '/v1/usersByCSC',

    GET_POSTS_URI: '/v1/getAllPosts',
    GET_POSTS_USERS_URI: '/v1/getAllUserPosts',
    GET_USERS_POSTS_URI: '/v1/getAllUsersPosts',
    GET_POST_ID_URI: '/v1/getPostById',
    CREATE_POST_URI: '/v1/createPost',
    UPDATE_POST_URI: '/v1/updatePost',
    REMOVE_POST_URI: '/v1/removePost',
    UPDATE_ISACTIVE_URI: '/v1/updateIsActive',
    UPDATE_ISPRIVATE_URI: '/v1/updateIsPrivate',
    UPLOADPOSTIMAGE_URI: '/v1/uploadPostImage',

    GET_POST_LIKES_URI: '/v1/getPostLikes',
    GET_LIKE_ID_URI: '/v1/getLikeById',
    CREATE_LIKE_URI: '/v1/createLike',
    UPDATE_LIKE_URI: '/v1/updateLike',
    REMOVE_LIKE_URI: '/v1/removeLike',

    GET_USER_MESSAGES_URI: '/v1/getUserMessages',
    GET_MESSAGES_URI: '/v1/getSenderMessages',
    GET_MESSAGE_ID_URI: '/v1/getMessageById',
    CREATE_MESSAGE_URI: '/v1/createMessage',
    UPDATE_MESSAGE_URI: '/v1/updateMessage',
    REMOVE_MESSAGE_URI: '/v1/removeMessage',

    GET_POST_COMMENTS_URI: '/v1/getPostComments',
    GET_COMMENT_ID_URI: '/v1/getCommentById',
    CREATE_COMMENT_URI: '/v1/createComment',
    UPDATE_COMMENT_URI: '/v1/updateComment',
    REMOVE_COMMENT_URI: '/v1/removeComment',
}
