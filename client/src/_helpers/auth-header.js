export function authHeader() {
    // return authorization header with basic auth credentials
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.authdata) {
        return { 'Authorization': user.authdata, 'Content-Type': 'application/json', Accept: 'application/json', };
    } else {
        return {};
    }
}