const createMenuAndToCustom = require('../../model/owner/menu/createMenuAndToCustom.js');
const updateMenu = require('../../model/owner/menu/updateMenu.js');
const requireMenu = require('../../model/requireMenu.js');
const deleteMenu = require('../../model/owner/menu/deleteMenu.js');

exports.postMenu = async function(req, res, next) {

    try {
        let food = req.body.food;
        let description = req.body.description;
        let defaultQuantity = req.body.defaultQuantity;
        let quantity = req.body.quantity;
        let ingredient = req.body.ingredient;
        let price = req.body.price;
        let category = req.body.category;
        let custom = req.body.custom;
        let restaurantName = req.params.restaurantName;
        await createMenuAndToCustom(food, description, defaultQuantity, quantity, ingredient, price, category, custom, restaurantName);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }

}

exports.patchMenu = async function(req, res, next) {

    try {
        let food = req.body.food;
        let description = req.body.description;
        let defaultQuantity = req.body.defaultQuantity;
        let quantity = req.body.quantity;
        let ingredient = req.body.ingredient;
        let price = req.body.price;
        let category = req.body.category;
        let custom = req.body.custom;
        let restaurantName = req.params.restaurantName;
        await updateMenu(food, description, defaultQuantity, quantity, ingredient, price, food, category, custom, restaurantName);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }

}

exports.getMenu = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let results = await requireMenu(restaurantName);
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error);
    }

}

exports.deleteMenu = async function(req, res, next) {

    try {
        let food = req.query.food;
        let category = req.query.category;
        let restaurantName = req.params.restaurantName;
        await deleteMenu(food, category, restaurantName);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }

}