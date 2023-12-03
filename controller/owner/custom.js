const createCustom = require('../../model/owner/custom/createCustom.js');
const deleteCustom = require('../../model/owner/custom/deleteCustom.js');
const requireCustom = require('../../model/owner/custom/requireCustom.js');
const updateCustom = require('../../model/owner/custom/updateCustom.js');

exports.postCustom = async function(req, res, next) {
    
    let custom = req.body.custom;
    let minOption = req.body.minOption;
    let maxOption = req.body.maxOption;
    let option = req.body.option;
    let optionPrice = req.body.optionPrice;
    let restaurantName = req.params.restaurantName;

    try {
        await createCustom(custom, minOption, maxOption, option, optionPrice, restaurantName);
        res.status(204).send();
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.deleteCustom = async function(req, res, next) {

    let custom = req.body.custom;
    let restaurantName = req.params.restaurantName;

    try {
        await deleteCustom(custom, restaurantName);
        res.status(204).send();
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.getCustom = async function(req, res, next) {

    let restaurantName = req.params.restaurantName;

    try {
        let result = await requireCustom(restaurantName);
        res.status(200).send(result);
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.patchCustom = async function(req, res, next) {

    let oldCustom = req.body.oldCustom;
    let newCustom = req.body.newCustom;
    let minOption = req.body.minOption;
    let maxOption = req.body.maxOption;
    let oldOption = req.body.oldOption;
    let newOption = req.body.newOption;
    let optionPrice = req.body.optionPrice;
    let restaurantName = req.params.restaurantName;

    try {
        await updateCustom(oldCustom, newCustom, minOption, maxOption, oldOption, newOption, optionPrice, restaurantName);
        res.status(204).send();
    } catch(error) {
        res.status(500).send(error);
    }
}