import { fetchWithDelay, fetchPostWithDelay, fetchPutWithDelay, deleteWithDelay } from "./fetch";

const getPostComments = (url) => fetchWithDelay(url);

const getCommentById = (url) => fetchWithDelay(url);

const createComment = (url, data) => fetchPostWithDelay(url, data);

const updateComment = (url, data) => fetchPutWithDelay(url, data);

const removeComment = (url) => deleteWithDelay(url);

export const commentService = {
    getPostComments,
    getCommentById,
    createComment,
    updateComment,
    removeComment
};