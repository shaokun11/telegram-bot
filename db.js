const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'shaokun'
});

const TABLE_NAME = 'super_hero_drop'
const ONE_DAY_OF_MILLSECONDS = 86400000

const sql_insert = account => `INSERT INTO ${TABLE_NAME} (account,create_time) VALUES ('${account}',now() )`
const sql_query = account => `SELECT * FROM ${TABLE_NAME} WHERE account = '${account}' AND create_time >= (now() - ${ONE_DAY_OF_MILLSECONDS})`

function exeSql(sql) {
    let res = {
        code: -1,
        data: 'system error'
    }
    return new Promise(function (resolve) {
        pool.getConnection(function (err, conn) {
            if (err) resolve(res)
            conn.query(sql, function (err, rows) {
                conn.release()
                res.code = -2
                if (err) resolve(res)
                res.code = 1
                res.data = rows
                resolve(res)
            })
        })
    })
}

function insertAccount(account) {
    return exeSql(sql_insert(account))
}

function queryAccountLeastInfo(account) {
    return exeSql(sql_query(account))
}

module.exports = {
    insertAccount,
    queryAccountLeastInfo
}