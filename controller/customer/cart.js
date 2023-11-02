const createCartAndCustomize = require('../../model/customer/createCartAndCustomize.js');
const deleteSingleCart = require('../../model/customer/deleteSingleCart.js');
const requireCart = require('../../model/customer/requireCart.js');
const updateSingleCart = require('../../model/customer/updateSingleCart.js');

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

    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName; 
    let quantity = req.body.quantity;
    let food = req.body.food;

    await updateSingleCart(customerID, quantity, food, restaurantName);

}

exports.deleteCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantName = req.body.restaurantName; 
    let food = req.body.food;

    await deleteSingleCart(customerID, food, restaurantName);
    
}