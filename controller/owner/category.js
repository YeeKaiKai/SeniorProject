const createCategory = require('../../model/owner/category/createCategory.js');
const deleteCategory = require('../../model/owner/category/deleteCategory.js');
const requireCategory = require('../../model/requireCategory.js');
const updateCategory = require('../../model/owner/category/updateCategory.js');

exports.postCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let category = req.body.category;
        await createCategory(category, restaurantName);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }

}

exports.getCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let results = await requireCategory(restaurantName);
        res.send(results);
    } catch (error) {
        res.status(500).send(error);
    }

}

exports.patchCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let newCategory = req.body.newCategory;
        let oldCategory = req.body.oldCategory;
        await updateCategory(newCategory, oldCategory, restaurantName);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.deleteCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let category = req.body.category;
        await deleteCategory(category, restaurantName);
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
}
