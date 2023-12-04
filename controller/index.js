const bcrypt = require("bcrypt");

const requireCustomerID = require("../model/index/requireCustomerID.js");
const requireRestaurant = require("../model/index/requireRestaurant.js");
const postRegistRestaurant = require("../model/index/registRestaurant.js");
const postLoginRestaurant = require("../model/index/loginRestaurant.js");

exports.getCustomerID = async function (req, res, next) {

    try {
        let results = await requireCustomerID();
        res.send(results);
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.getRestaurant = async function (req, res, next) {

    try {
        let results = await requireRestaurant();
        res.send(results);
    } catch(error) {
        res.status(500).send(error);
    }

}

exports.postRegistRestaurant = async function (req, res, next) {

    try {
        let restaurantName = req.body.restaurantName;
        let restaurantName_zh_tw = req.body.restaurantName_zh_tw;
        let email = req.body.email;
        let enPassword = bcrypt.hashSync(req.body.password, 10);
        let businessHours = req.body.businessHours;
        let tel = req.body.tel;
        let address = req.body.address
        let results = postRegistRestaurant(restaurantName, restaurantName_zh_tw, email, enPassword, businessHours, tel, address);
        res.status(200).send(results);
    } catch(error) {
        res.status(500).send(error);
    }
}

exports.postLoginRestaurant = async function (req, res, next) {

    try {
        let email = req.body.email;
        let password = req.body.password;
        let results = await postLoginRestaurant(email, password);
        res.status(200).send(results);
    } catch(error) {
        res.status(500).send(error);
    }
}