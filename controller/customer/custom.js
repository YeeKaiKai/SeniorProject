const requireCustomizeOption = require('../../model/customer/requireCustomizeOption.js');

exports.getCustomizeOption = async function(req, res, next) {

    let restaurantName = req.params.restaurantName;
    let food = req.params.food;

    try {
        let results = await requireCustomizeOption(restaurantName, food);
        res.send(results);
    } catch(error) {
        res.send(error);
    }
}