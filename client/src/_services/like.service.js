import { fetchWithDelay, fetchPostWithDelay, fetchPutWithDelay, deleteWithDelay } from "./fetch";

const getPostLikes = (url) => fetchWithDelay(url);

const getLikeById = (url) => fetchWithDelay(url);

const createLike = (url, data) => fetchPostWithDelay(url, data);

const updateLike = (url, data) => fetchPutWithDelay(url, data);

const removeLike = (url) => deleteWithDelay(url);

export const likeService = {
    getPostLikes,
    getLikeById,
    createLike,
    updateLike,
    removeLike
};