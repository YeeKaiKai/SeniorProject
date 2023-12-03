const createMenuAndToCustom = require('../../model/owner/menu/createMenuAndToCustom.js');
const updateMenu = require('../../model/owner/menu/updateMenu.js');
const requireMenu = require('../../model/requireMenu.js');
const deleteMenu = require('../../model/owner/menu/deleteMenu.js');

exports.postMenu = async function(req, res, next) {

    try {
        let food = req.body.food;
        let description = req.body.description;
        let quantity = req.body.quantity;
        let ingredient = req.body.ingredient;
        let price = req.body.price;
        let category = req.body.category;
        let custom = req.body.custom;
        let restaurantName = req.params.restaurantName;
        await createMenuAndToCustom(food, description, quantity, ingredient, price, category, custom, restaurantName);
    } catch (error) {
        res.send(error);
    }

}

exports.patchMenu = async function(req, res, next) {

    try {
        let food = req.body.food;
        let description = req.body.description;
        let quantity = req.body.quantity;
        let ingredient = req.body.ingredient;
        let price = req.body.price;
        let category = req.body.category;
        let custom = req.body.custom;
        let restaurantName = req.params.restaurantName;
        await updateMenu(food, description, quantity, ingredient, price, food, category, custom, restaurantName);
    } catch (error) {
        res.send(error);
    }

}

exports.getMenu = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        await requireMenu(restaurantName);
    } catch (error) {
        res.send(error);
    }

}

exports.deleteMenu = async function(req, res, next) {

    try {
        let food = req.query.food;
        let category = req.query.category;
        let restaurantName = req.params.restaurantName;
        await deleteMenu(food, category, restaurantName);
    } catch (error) {
        res.send(error);
    }

}