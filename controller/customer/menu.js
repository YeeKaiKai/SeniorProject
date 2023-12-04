const requireCategory = require("../../model/requireCategory.js");
const requireMenu = require("../../model/customer/requireMenu.js");

exports.getCategory = async function (req, res, next) {

    let restaurantName = req.params.restaurantName;
    
    try {
        let results = await requireCategory(restaurantName);
        res.status(200).send(results);
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.getMenu = async function (req, res, next) {

    let restaurantName = req.params.restaurantName;
    
    try {
        let results = await requireMenu(restaurantName);
        res.status(200).send(results);
    } catch(error) {
        res.status(500).send(error);
    }

}