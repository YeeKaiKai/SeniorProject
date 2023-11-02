const cartToOrder = require('../../model/customer/cartToOrder.js');
const requireOrder = require('../../model/customer/requireOrder.js');

exports.postCartToOrder = async function(req, res, next) {


    try {

        let customerID = req.body.customerID;
        let restaurantName = req.params.restaurantName;
        let totalSum = req.body.totalSum;

        let results = await cartToOrder(customerID, totalSum, restaurantName);
        res.send(results);
    } catch (error) {
        res.send(error);
    }

}

exports.getOrder = async function(req, res, next) {

    try {
        let customerID = req.query.customerID;
        let restaurantName = req.params.restaurantName;
        
        let results = await requireOrder(restaurantName, customerID)
        res.send(results);
    } catch (error) {
        res.send(error);
    }

}