import { fetchWithDelay, fetchPostWithDelay, fetchPutWithDelay, deleteWithDelay } from "./fetch";

const getAllPosts = (url) => fetchWithDelay(url);

const getAllUserPosts = (url) => fetchWithDelay(url);

const getById = (url) => fetchWithDelay(url);

const createPost = (url, data) => fetchPostWithDelay(url, data);

const updatePost = (url, data) => fetchPutWithDelay(url, data);

const removePost = (url) => deleteWithDelay(url);

export const postService = {
    getAllPosts,
    getAllUserPosts,
    getById,
    createPost,
    updatePost,
    removePost
};