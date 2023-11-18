exports.getConnection = async function (pool) {
    return new Promise((resolve, reject) => {
        pool.getConnection((conn_err, connection) => {
            if (conn_err) {
                return reject(conn_err);
            }
            resolve(connection);
        });
    });
}

exports.beginTransaction = async function (connection) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((tran_err) => {
            if (tran_err) {
                return reject(tran_err);
            }
            resolve();
        });
    });
}

exports.query = async function (connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (query_err, results) => {
            if (query_err) {
                return reject(query_err);
            }
            resolve(results);
        });
    });
}

exports.rollback = async function (connection) {
    return new Promise((resolve, reject) => {
        connection.rollback((roll_err) => {
            if (roll_err) {
                return reject(roll_err);
            }
            resolve();
        });
    })
}

exports.commit = async function (connection) {
    return new Promise((resolve, reject) => {
        connection.commit((commit_err) => {
            if (commit_err) {
                return reject(commit_err);
            }
            resolve();
        });
    })
}