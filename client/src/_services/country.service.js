import { fetchWithDelay } from "./fetch";

const getCountries = (url) => fetchWithDelay(url);

const getStates = (url) => fetchWithDelay(url);

const getCities = (url) => fetchWithDelay(url);

const getPhoneCodes = (url) => fetchWithDelay(url);

const getCountryByName = (url) => fetchWithDelay(url);

const getCityByName = (url) => fetchWithDelay(url);

const getCityInfo = (url) => fetchWithDelay(url);

export const countryService = {
    getCountries,
    getStates,
    getCities,
    getPhoneCodes,
    getCountryByName,
    getCityByName,
    getCityInfo
};