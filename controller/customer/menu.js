const requireCategory = require("../../model/requireCategory.js");
const requireMenu = require("../../model/requireMenu.js");

exports.getCategory = async function (req, res, next) {

    let restaurantName = req.params.restaurantName;
    
    requireCategory(restaurantName).then((results) => {
        res.send(results);
    })

}

exports.getMenu = async function (req, res, next) {

    let restaurantName = req.params.restaurantName;
    
    let results = await requireMenu(restaurantName);
    res.send(results);

}