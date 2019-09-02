const {
    JsonRpc
} = require('eosjs')
const fetch = require("node-fetch");
const rpc = new JsonRpc('https://seed02.eosusa.news', {
    fetch
});

async function getAccount(name) {
    try {
        await rpc.get_account(name)
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    getAccount
}