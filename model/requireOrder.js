const getPool = require("./connectionDB.js");

module.exports = async function (restaurantName) {

    return new Promise((resolve, reject) => {
        let sql = 
        `
        SELECT * 
        FROM \`ORDER\`
        WHERE Confirmed = TRUE
        `;
        const pool = getPool(restaurantName);
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                reject(conn_err);
            } 
            connection.query(sql, (query_err, results) => {
                if (query_err) {
                    reject(query_err);
                } 

                // 兩次轉換會變乾淨
                results = JSON.stringify(results);
                results = JSON.parse(results);
                
                // 取出純文字內容
                let text = "";
                for (let i = 0; i < results.length; i++) {
                    text = text + results[i].Content + "\n";
                }
                resolve(text);
            })
            if (connection) {
                connection.release();
            }
        })
    })

} 