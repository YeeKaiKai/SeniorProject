const createCartAndCustomize = require('../../model/customer/cart/createCartAndCustomize.js');
const deleteSingleCart = require('../../model/customer/cart/deleteSingleCart.js');
const requireCart = require('../../model/customer/requireCart.js');
const updateCartAndCustomize = require('../../model/customer/updateCartAndCustomize.js');

exports.postCart = async function(req, res, next) {

    let amount = req.body.amount;
    let custom = req.body.custom;
    let option = req.body.option;
    let note = req.body.note;
    let food = req.body.food;
    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName;

    try {
        let results = await createCartAndCustomize(amount, custom, option, note, food, customerID, restaurantName);
        res.send(results);
    } catch(error) {
        res.send(error);
    }
}

exports.getCart = async function(req, res, next) {
    
    let customerID = req.query.customerID;
    let restaurantName = req.params.restaurantName; 

    let results = await requireCart(restaurantName, customerID);
    res.send(results);

}

exports.patchCart = async function(req, res, next) {

    let amount = req.body.amount;
    let custom = req.body.custom;
    let oldOption = req.body.oldOption;
    let newOption = req.body.newOption;
    let note = req.body.note;
    let food = req.body.food;
    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName;
    let customID = req.body.customID;

    await updateCartAndCustomize(amount, custom, oldOption, newOption, note, food, customerID, customID, restaurantName);

}

exports.deleteCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantName = req.body.restaurantName; 
    let food = req.body.food;

    await deleteSingleCart(customerID, food, restaurantName);
    
}