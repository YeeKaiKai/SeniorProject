const requireCustomerID = require("../model/requireCustomerID.js");

exports.getCustomerID = async function (req, res, next) {

    try {
        let results = await requireCustomerID();
        console.log(results);
        res.send(results);
    } catch(error) {
        res.send(error);
    }

}