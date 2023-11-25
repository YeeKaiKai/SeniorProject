const createCategory = require('../../model/owner/category/createCategory.js');
const deleteCategory = require('../../model/owner/category/deleteCategory.js');
const requireCategory = require('../../model/owner/category/requireCategory.js');
const updateCategory = require('../../model/owner/category/updateCategory.js');

exports.postCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let category = req.body.category;
        let results = await createCategory(category, restaurantName);
        res.send(results);
    } catch (error) {
        res.send(error);
    }

}

exports.getCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let results = await requireCategory(restaurantName);
        res.send(results);
    } catch (error) {
        res.send(error);
    }

}

exports.patchCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let newCategory = req.body.newCategory;
        let oldCategory = req.body.oldCategory;
        await updateCategory(newCategory, oldCategory, restaurantName);
        res.send();
    } catch (error) {
        res.send(error);
    }
}

exports.deleteCategory = async function(req, res, next) {

    try {
        let restaurantName = req.params.restaurantName;
        let newCategory = req.body.newCategory;
        let oldCategory = req.body.oldCategory;
        await deleteCategory(newCategory, oldCategory, restaurantName);
        res.send();
    } catch (error) {
        res.send(error);
    }
}
