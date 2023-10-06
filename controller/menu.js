const requireCategory = require("../model/requireCategory.js");
const requireMenu = require("../model/requireMenu.js");

exports.getCategory = async function (req, res, next) {

    let restaurantID = "001";
    let restaurantName = "MORNING001";

    requireCategory(restaurantID, restaurantName).then((results) => {
        res.send(results);
    })

}

exports.getMenu = async function (req, res, next) {

    let restaurantID = "001";
    let restaurantName = "MORNING001";

    requireMenu(restaurantID, restaurantName).then((results) => {
        res.send(results);
    })

}