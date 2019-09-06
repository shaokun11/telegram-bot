const {
    JsonRpc
} = require('eosjs')
const fetch = require("node-fetch");
const rpc = new JsonRpc('https://api.main.alohaeos.com', {
    fetch
});

async function getAccount(name) {
    try {
        const res = await rpc.get_account(name)
        console.log("check account res ", res)
        return true
    } catch (error) {
        console.log("check account error ", error)
        return false
    }
}

module.exports = {
    getAccount
}