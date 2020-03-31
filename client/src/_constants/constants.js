var ENV_URI = 'https://stg-app.com';
var WEB_URI = 'http://.com:5000';

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
    GET_POST_ID_URI: '/v1/getPostById',
    CREATE_POST_URI: '/v1/createPost',
    UPDATE_POST_URI: '/v1/updatePost',
    REMOVE_POST_URI: '/v1/removePost',
}
