import { fetchWithDelay, fetchPostWithDelay, fetchPutWithDelay, deleteWithDelay } from "./fetch";

const getUserMessages = (url) => fetchWithDelay(url);

const getSenderMessages = (url) => fetchWithDelay(url);

const getMessageById = (url) => fetchWithDelay(url);

const createMessage = (url, data) => fetchPostWithDelay(url, data);

const updateMessage = (url, data) => fetchPutWithDelay(url, data);

const removeMessage = (url) => deleteWithDelay(url);

export const messageService = {
    getUserMessages,
    getSenderMessages,
    getMessageById,
    createMessage,
    updateMessage,
    removeMessage
};