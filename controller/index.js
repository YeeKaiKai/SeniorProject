const requireCustomerID = require("../model/requireCustomerID.js");
const requireRestaurant = require("../model/requireRestaurant.js");

exports.getCustomerID = async function (req, res, next) {

    try {
        let results = await requireCustomerID();
        res.send(results);
    } catch(error) {
        res.send(error);
    }

}

exports.getRestaurant = async function (req, res, next) {

    try {
        let results = await requireRestaurant();
        res.send(results);
    } catch(error) {
        res.send(error);
    }

}
