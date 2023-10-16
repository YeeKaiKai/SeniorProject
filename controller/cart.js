const createCart = require('../model/createCart.js');
const deleteSingleCart = require('../model/deleteSingleCart.js');
const requireCart = require('../model/requireCart.js');
const updateSingleCart = require('../model/updateSingleCart.js');

exports.postCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantID = req.body.restaurantID;
    let restaurantName = req.body.restaurantName;

    await createCart(customerID, quantity, food, restaurantID, restaurantName);

}

exports.getCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantID = req.body.restaurantID;
    let restaurantName = req.body.restaurantName;

    let results = await requireCart(restaurantID, restaurantName, customerID);
    res.send(results);

}

exports.updateCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantID = req.body.restaurantID;
    let restaurantName = req.body.restaurantName;
    let quantity = req.body.quantity;
    let food = req.body.food;

    await updateSingleCart(customerID, quantity, food, restaurantID, restaurantName);

}

exports.deleteCart = async function(req, res, next) {
    let customerID = req.body.customerID;
    let restaurantID = req.body.restaurantID;
    let restaurantName = req.body.restaurantName;
    let food = req.body.food;

    await deleteSingleCart(customerID, food, restaurantID, restaurantName);
    
}