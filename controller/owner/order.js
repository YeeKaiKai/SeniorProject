const requireOrder = require('../../model/owner/order/requireOrder.js');
const updateOrder = require('../../model/owner/updatePaid.js');

exports.getOrder = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        
        let results = await requireOrder(restaurantName);
        res.send(results);
    } catch (error) {
        res.send(error);
    }

}

exports.deleteOrder = async function(req, res, next) {

}

exports.patchOrder = async function(req, res, next) {
    try {

        let restaurantName = req.params.restaurantName;
        let orderID = req.body.orderID;
        await updateOrder(restaurantName, orderID);
        res.send();
    } catch (error) {
        res.send(error);
    }
}