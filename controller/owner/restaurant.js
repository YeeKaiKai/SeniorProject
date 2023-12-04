const requireRestaurantInfo = require('../../model/owner/requireRestaurantInfo.js');

exports.getRestaurantInfo = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        
        let results = await requireRestaurantInfo(restaurantName);
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error);
    }

}
