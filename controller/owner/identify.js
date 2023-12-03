const bcrypt = require("bcrypt");
const registRestaurant = require("../../model/owner/registRestaurant.js");

exports.postRegist = async function(req, res, next) {
    try {
        let restaurantName = req.params.restaurantName;
        let restaurantName_zh_tw = req.body.restaurantName_zh_tw;
        let email = req.body.email;
        let password = req.body.password;
        let businessHours = req.body.businessHours;
        let tel = req.body.tel;
        
        let enPassword = bcrypt.hashSync(password, 10);
        await registRestaurant(restaurantName, restaurantName_zh_tw, email, enPassword, businessHours, tel);
    } catch(error) {
        res.status(500).send(error);
    }
}