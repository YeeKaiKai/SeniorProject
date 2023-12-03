const requireCustomizeOption = require('../../model/customer/custom/requireCustomizeOption.js');

exports.getCustomizeOption = async function(req, res, next) {

    let restaurantName = req.params.restaurantName;
    let food = req.params.food;

    try {
        let results = await requireCustomizeOption(restaurantName, food);
        res.status(200).send(results);
    } catch(error) {
        res.status(500).send(error);
    }
}