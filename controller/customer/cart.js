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
        await createCartAndCustomize(amount, custom, option, note, food, category, customerID, restaurantName);
        res.status(204).send();
    } catch(error) {
        res.status(500).send(error);
    }
}

exports.getCart = async function(req, res, next) {
    
    let customerID = req.query.customerID;
    let restaurantName = req.params.restaurantName; 

    try {
        let results = await requireCart(restaurantName, customerID);
        res.status(200).send(results);
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.patchCart = async function(req, res, next) {

    let amount = req.body.amount;
    let custom = req.body.custom;
    let oldOption = req.body.oldOption;
    let newOption = req.body.newOption;
    let oldNote = req.body.oldNote;
    let newNote = req.body.newNote;
    let food = req.body.food;
    let category = req.body.category;
    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName;
    let customID = req.body.customID;

    try { 
        await updateCartAndCustomize(amount, custom, oldOption, newOption, oldNote, newNote, food, category, customerID, customID, restaurantName);
        res.status(204).send();
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.deleteCart = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName; 
    let customID = req.body.customID;
    let food = req.body.food;
    let note = req.body.note;
    let category = req.body.category;

    try {
        await deleteSingleCart(customID, customerID, food, note, category, restaurantName);
        res.status(204).send();
    } catch(error) {
        res.status(500).send(error);
    }
    
}