const createCustom = require('../../model/owner/createCustom.js');
const createOption = require('../../model/owner/createOption.js');
const deleteCustom = require('../../model/owner/deleteCustom.js');
const deleteOption = require('../../model/owner/deleteOption.js');
const requireCustom = require('../../model/owner/requireCustom.js');
const requireOption = require('../../model/owner/requireOption.js');
const updateCustom = require('../../model/owner/updateCustom.js');
const updateOption = require('../../model/owner/updateOption.js');

exports.postCustom = async function(req, res, next) {
    
    let custom = req.body.custom;
    let minOption = req.body.minOption;
    let maxOption = req.body.maxOption;
    let restaurantName = req.body.restaurantName;

    try {
        let result = await createCustom(custom, minOption, maxOption, restaurantName);
        res.send(result);
    } catch(error) {
        throw (500);
    }

}

exports.postOption = async function(req, res, next) {

    let custom = req.body.custom;
    let option = req.body.option;
    let price = req.body.price;
    let restaurantName = req.body.restaurantName;

    try {
        let result = await createOption(custom, option, price, restaurantName);
        res.send(result);
    } catch(error) {
        throw (500);
    }

}

exports.deleteCustom = async function(req, res, next) {

    let custom = req.body.custom;
    let restaurantName = req.body.restaurantName;

    try {
        let result = await deleteCustom(custom, restaurantName);
        res.send(result);
    } catch(error) {
        throw (500);
    }

}

exports.deleteOption = async function(req, res, next) {

    let custom = req.body.custom;
    let option = req.body.option;
    let restaurantName = req.body.restaurantName;

    try {
        let result = await deleteOption(custom, option, restaurantName);
        res.send(result);
    } catch(error) {
        throw (500);
    }

}

exports.getCustom = async function(req, res, next) {

    let restaurantName = req.body.restaurantName;

    try {
        let result = await requireCustom(restaurantName);
        console.log(result);
        res.send(result);
    } catch(error) {
        throw (500);
    }

}

exports.getOption = async function(req, res, next) {

    let custom = req.body.custom;
    let restaurantName = req.body.restaurantName;

    try {
        let result = await requireOption(custom, restaurantName);
        res.send(result);
    } catch(error) {
        throw (500);
    }

}

exports.putCustom = async function(req, res, next) {

    let oldCustom = req.body.oldCustom;
    let newCustom = req.body.newCustom;
    let minOption = req.body.minOption;
    let maxOption = req.body.maxOption;
    let restaurantName = req.body.restaurantName;

    try {
        let result = await updateCustom(oldCustom, newCustom, minOption, maxOption, restaurantName);
        res.send(result);
    } catch(error) {
        throw (500);
    }
}

exports.putOption = async function(req, res, next) {

    let custom = req.body.custom;
    let oldOption = req.body.oldOption;
    let newOption = req.body.newOption;
    let price = req.body.price;
    let restaurantName = req.body.restaurantName;
    
    try {
        let result = await updateOption(custom, oldOption, newOption, price, restaurantName);
        res.send(result);
    } catch(error) {
        throw (500);
    }
}