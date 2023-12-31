const cartToOrder = require('../../model/customer/cartToOrder.js');
const requireOrder = require('../../model/customer/requireOrder.js');

exports.postCartToOrder = async function(req, res, next) {


    try {

        let customerID = req.body.customerID;
        let restaurantName = req.params.restaurantName;
        let totalSum = req.body.totalSum;
        let orderNote = req.body.orderNote;
        let orderDate = req.body.orderDate;
        let orderTime = req.body.orderTime;
        let forHere = req.body.forHere;
        let tableNumber = req.body.tableNumber;
        let phoneNumber = req.body.phoneNumber;

        await cartToOrder(customerID, totalSum, restaurantName, orderNote, orderDate, orderTime, forHere, tableNumber, phoneNumber);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }

}

exports.getOrder = async function(req, res, next) {

    try {
        let customerID = req.query.customerID;
        let restaurantName = req.params.restaurantName;
        
        let results = await requireOrder(restaurantName, customerID);
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error);
    }

}