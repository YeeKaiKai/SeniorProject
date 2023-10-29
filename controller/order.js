// const deleteOrder = require('../model/owner/deleteOrder.js');
const requireOrder = require('../model/owner/requireOrder.js');


exports.deleteOrder = async function(req, res, next) {
    
}

exports.getOrder = async function(req, res, next) {

    let restaurantName = req.body.restaurantName;

    let results = await requireOrder(restaurantName);
    res.send(results);

}