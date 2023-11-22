const getPool = require('../../../connectionDB.js');

/**
 * 新增顧客訂單，如果已經有了就會變修改數量。
 * @param {*} customerID 
 * @param {*} quantity 
 * @param {*} food 
 * @param {*} restaurantName
 */

module.exports = async function (custom, oldOption, newOption, optionPrice, restaurantName) {

    return new Promise((resolve, reject) => {
        let result;
        const pool = getPool();
        
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                throw conn_err;
            }
            for (let num = 0; num < oldOption.length; num++) {
                let sql = 
                `
                UPDATE CUSTOM_OPTION
                SET \`Option\` = "${newOption[num]}",
                OptionPrice = "${optionPrice[num]}"
                WHERE Custom = "${custom}" 
                AND \`Option\` = "${oldOption[num]}"
                AND RestaurantName = "${restaurantName}";
                `;
                console.log(sql);
                connection.query(sql, (query_err, results) => {
                    if (query_err) {
                        throw query_err;
                    }
                    result = results;
                })
            }
            if (connection) {
                connection.release();
            }
            resolve(result);
        })
    }) 
}