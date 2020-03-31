import { fetchWithDelay, fetchPostWithDelay, fetchPutWithDelay } from "./fetch";

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch('$/users/authenticate', requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                // store user details and basic auth credentials in local storage 
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

const logout = ()  => {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    // remove all
    //localStorage.clear();
}

const getAll = (url) => fetchWithDelay(url);

const getById = (url) => fetchWithDelay(url);

const getByUsername = (url) => fetchWithDelay(url);

const getUsersByCSC = (url) => fetchWithDelay(url);

export const userService = {
    login,
    logout,
    getAll,
    getById,
    getByUsername,
    getUsersByCSC
};

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}