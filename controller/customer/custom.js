const createOrderCustomOption = require('../../model/customer/createOrderCustomOption.js');

exports.postOrderCustomOption = async function(req, res, next) {

    try {
        let result = await createOrderCustomOption(amount, custom, option, food, customID, customerID, restaurantID, restaurantName);
        res.send(result);
    } catch {
        res.send(new Error(400));
    }
}