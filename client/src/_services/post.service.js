import { fetchWithDelay, fetchPostWithDelay, fetchPutWithDelay, deleteWithDelay } from "./fetch";

const getAllPosts = (url) => fetchWithDelay(url);

const getAllUserPosts = (url) => fetchWithDelay(url);

const getById = (url) => fetchWithDelay(url);

const createPost = (url, data) => fetchPostWithDelay(url, data);

const updatePost = (url, data) => fetchPutWithDelay(url, data);

const removePost = (url) => deleteWithDelay(url);

const updateIsActive = (url, data) => fetchPutWithDelay(url, data);

const updateIsPrivate = (url, data) => fetchPutWithDelay(url, data);

export const postService = {
    getAllPosts,
    getAllUserPosts,
    getById,
    createPost,
    updatePost,
    removePost,
    updateIsActive,
    updateIsPrivate
};