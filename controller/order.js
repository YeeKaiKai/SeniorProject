// const deleteOrder = require('../model/owner/deleteOrder.js');
const requireOrder = require('../model/owner/requireOrder.js');


exports.deleteOrder = async function(req, res, next) {
    
}

exports.getOrder = async function(req, res, next) {

    let customerID = req.body.customerID;
    let restaurantID = req.body.restaurantID;
    let restaurantName = req.body.restaurantName;

    let results = await requireOrder(restaurantID, restaurantName, customerID);
    res.send(results);

}