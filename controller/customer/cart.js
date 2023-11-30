const createCartAndCustomize = require('../../model/customer/cart/createCartAndCustomize.js');
const deleteSingleCart = require('../../model/customer/cart/deleteSingleCart.js');
const requireCart = require('../../model/customer/cart/requireCart.js');
const updateCartAndCustomize = require('../../model/customer/cart/updateCartAndCustomize.js');

exports.postCart = async function(req, res, next) {

    let amount = req.body.amount;
    let custom = req.body.custom;
    let option = req.body.option;
    let note = req.body.note;
    let food = req.body.food;
    let category = req.body.category;
    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName;

    try {
        let results = await createCartAndCustomize(amount, custom, option, note, food, category, customerID, restaurantName);
        res.send(results);
    } catch(error) {
        res.send(error);
    }
}

exports.getCart = async function(req, res, next) {
    
    let customerID = req.query.customerID;
    let restaurantName = req.params.restaurantName; 

    try {
        let results = await requireCart(restaurantName, customerID);
        res.send(results);
    } catch(error) {
        res.send(error);
    }

}

exports.patchCart = async function(req, res, next) {

    let amount = req.body.amount;
    let custom = req.body.custom;
    let oldOption = req.body.oldOption;
    let newOption = req.body.newOption;
    let note = req.body.note;
    let food = req.body.food;
    let category = req.body.category;
    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName;
    let customID = req.body.customID;

    try { 
        await updateCartAndCustomize(amount, custom, oldOption, newOption, note, food, category, customerID, customID, restaurantName);
    } catch(error) {
        res.send(error);
    }

}

exports.deleteCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName; 
    let customID = req.body.customID;
    let food = req.body.food;
    let category = req.body.category;

    try {
        await deleteSingleCart(customID, customerID, food, category, restaurantName);
    } catch(error) {
        res.send(error);
    }
    
}