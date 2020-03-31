var path = require('path');
const { to, ReE, ReS } = require('../services/util.service');

const model = require('../models/index.model');

const getPhoneCodes = async function (req, res) {
    let phonecodes, err;
    res.setHeader('Content-Type', 'application/json');
    [err, phonecodes] = await to(model.countries.findAll({ attributes: ['id', 'phonecode', 'sortname'] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { phonecodes: phonecodes });
}

const getAllCountries = async function (req, res) {
    let countries, err;
    res.setHeader('Content-Type', 'application/json');
    [err, countries] = await to(model.countries.findAll({ attributes: ['id', 'name', 'sortname'] }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { countries: countries });
}

const getCountryStates = async function (req, res) {
    let states, err;
    const body = req.params;
    res.setHeader('Content-Type', 'application/json');
    [err, states] = await to(model.states.findAll({ where: { country_id: body.id } }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { states: states });
}

const getStateCities = async function (req, res) {
    let cities, err;
    const body = req.params;
    res.setHeader('Content-Type', 'application/json');
    [err, cities] = await to(model.cities.findAll({ where: { state_id: body.id } }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { cities: cities });
}

const getCountryByName = async function (req, res) {
    let country, err;
    const body = req.params;
    res.setHeader('Content-Type', 'application/json');
    [err, country] = await to(model.countries.findOne({ where: { name: body.name } }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { country: country });
}

const getCityByName = async function (req, res) {
    let city, err;
    const body = req.params;
    res.setHeader('Content-Type', 'application/json');
    [err, city] = await to(model.cities.findOne({ where: { name: body.name } }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { city: city });
}

const getCityDetail = async function (req, res) {
    let info, err;
    const body = req.params;
    res.setHeader('Content-Type', 'application/json');
    [err, info] = await to(model.tb_city_info.findOne({ where: { city_id: body.id } }));
    if (err) {
        return ReE(res, err, 422);
    }
    return ReS(res, { info: info });
}

module.exports.getPhoneCodes = getPhoneCodes;
module.exports.getAllCountries = getAllCountries;
module.exports.getCountryStates = getCountryStates;
module.exports.getStateCities = getStateCities;
module.exports.getCountryByName = getCountryByName;
module.exports.getCityByName = getCityByName;
module.exports.getCityDetail = getCityDetail;