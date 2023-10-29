const createSingleCart = require('../../model/customer/createSingleCart.js');
const deleteSingleCart = require('../../model/customer/deleteSingleCart.js');
const requireCart = require('../../model/customer/requireCart.js');
const updateSingleCart = require('../../model/customer/updateSingleCart.js');

exports.postCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantName = req.body.restaurantName; 
    let food = req.body.food;
    let quantity = req.body.quantity;
    let note = req.body.note;

    let results = await createSingleCart(customerID, quantity, food, note, restaurantName);
    res.send(results);
}

exports.getCart = async function(req, res, next) {
    
    let customerID = req.body.customerID;
    let restaurantName = req.body.restaurantName; 

    let results = await requireCart(restaurantName, customerID);
    res.send(results);

}

exports.patchCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantName = req.body.restaurantName; 
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