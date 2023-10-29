const createOrderCustomOption = require('../../model/customer/createOrderCustomOption.js');
const requireCustomizeOption = require('../../model/customer/requireCustomizeOption.js');

exports.postOrderCustomOption = async function(req, res, next) {

    let amount = req.body.amount;
    let custom = req.body.amount;
    let option = req.body.option;
    let food = req.body.food;
    let customID = req.body.customID;
    let customerID = req.body.customerID;
    let restaurantName = req.params.restaurantName;
    
    try {
        let results = await createOrderCustomOption(amount, custom, option, food, customID, customerID, restaurantName);
        res.send(results);
    } catch(error) {
        res.send(error);
    }
}

exports.getCustomizeOption = async function(req, res, next) {

    let restaurantName = req.params.restaurantName;
    let food = req.query.food;

    try {
        let results = await requireCustomizeOption(restaurantName, food);
        res.send(results);
    } catch(error) {
        res.send(error);
    }
}