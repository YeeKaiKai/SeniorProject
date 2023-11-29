const requireCategory = require("../../model/requireCategory.js");
const requireMenu = require("../../model/requireMenu.js");

exports.getCategory = async function (req, res, next) {

    let restaurantName = req.params.restaurantName;
    
    try {
        let results = await requireCategory(restaurantName);
        res.send(results);
    } catch(error) {
        res.send(error);
    }

}

exports.getMenu = async function (req, res, next) {

    let restaurantName = req.params.restaurantName;
    
    try {
        let results = await requireMenu(restaurantName);
        res.send(results);
    } catch(error) {
        res.send(error);
    }

}