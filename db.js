const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'shaokun'
});


// CREATE TABLE `super_hero_drop` (
//     `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
//     `account` varchar(15) NOT NULL DEFAULT '',
//     `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;


const TABLE_NAME = 'super_hero_drop'

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
    const sql = `INSERT INTO ${TABLE_NAME} (account) VALUES ('${account}')`
    return exeSql(sql)
}

function queryAccountLeastInfo(account) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE account = '${account}' order by create_time desc limit 0, 1`
    return exeSql(sql)
}

module.exports = {
    insertAccount,
    queryAccountLeastInfo
}