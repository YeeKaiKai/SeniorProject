const requireCategory = require("../model/requireCategory.js");
const requireMenu = require("../model/requireMenu.js");

exports.getCategory = async function (req, res, next) {

    let restaurantID = req.body.restaurantID;
    let restaurantName = req.body.restaurantName;

    requireCategory(restaurantID, restaurantName).then((results) => {
        res.send(results);
    })

}

exports.getMenu = async function (req, res, next) {

    let restaurantID = req.body.restaurantID;
    let restaurantName = req.body.restaurantName;

    let results = await requireMenu(restaurantID, restaurantName);
    res.send(results);

}