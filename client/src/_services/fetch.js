import { authHeader } from '../_helpers/auth-header';

export const fetchWithDelay = url => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        fetch(url, {
          method: "GET",
          headers: authHeader()
        }).then(response => response.json())
      );
    }, 0);
  });

  return promise;
};

export const fetchPostWithDelay = (url, data) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: authHeader()
        }).then(response => response.json())
      );
    }, 0);
  });

  return promise;
};

export const fetchPutWithDelay = (url, data) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        fetch(url, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: authHeader()
        }).then(response => response.json())
      );
    }, 0);
  });

  return promise;
};

export const deleteWithDelay = (url, data) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        fetch(url, {
          method: "DELETE",
          headers: authHeader()
        }).then(response => response.json())
      );
    }, 0);
  });

  return promise;
};
