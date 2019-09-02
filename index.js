const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const {
    getAccount
} = require('./chain')
const {
    queryAccountLeastInfo,
    insertAccount
} = require('./db')

const token = '905473262:AAHw29brGbfXx9Rt-Gx6Yko6-GT5_-3NVjk'

const bot = new TelegramBot(token, {
    polling: true,
    interval: 1500,
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: '127.0.0.1',
            socksPort: '1086'
        }
    }
});

bot.getMe().then(console.log)
bot.on('message', msg => {
    console.log('----message------', msg)
    if (msg.text) {
        handleTextMsg(msg)
    }
    if (msg.new_chat_member) {
        handleWlecomeMsg(msg)
    }
});

function handleWlecomeMsg(msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'welcome ' + msg.new_chat_member.first_name + ' to fast super hero, the game address https://sh.fasteco.io ')
}

async function handleTextMsg(msg) {
    let text = msg.text.substr(1)
    const chatId = msg.chat.id;
    const userName = msg.from.user_name || msg.from.first_name
    const sendMsg = async function (id, msg) {
        const responsePrefix = '@' + userName + ', '
        bot.sendMessage(id, responsePrefix + msg);
    }
    // 粗略匹配格式
    const match = /superhero:[a-z]{1,12}[1-5\.]*/
    if (text.length < 11 || !match.test(text)) {
        const errroMsg = 'text format not correct,just send you eos account like:/superhero:eosio.token'
        sendMsg(chatId, errroMsg)
        return
    }
    const account = text.substr(10, 12)
    // 检查eos账号是否存在
    let accountResult = await getAccount(account)
    console.log('account exist -->', account, accountResult)
    if (!accountResult) {
        const errroMsg = 'maybe your eos account not exsit,check and try again'
        sendMsg(chatId, errroMsg)
        return
    }
    let res = await queryAccountLeastInfo(account)
    if (res.code < 0) {
        handleErrorCode(res.code)
        return
    }
    if (res.data.length > 0) {
        sendMsg(chatId, `There's only one chance in 24 hours. Thank you for your support`)
        return;
    }
    res = await insertAccount(account)
    if (res.code < 0) {
        handleErrorCode(res.code)
        return
    }
    sendMsg(chatId, "welcome super hero, send you 24 energy, address https://sh.fasteco.io")
}

function handleErrorCode(code) {
    if (code === -1) {
        sendMsg(chatId, "system error, please send wait a moment")
    } else if (code === -2) {
        sendMsg(chatId, "system error, please send wait a moment")
    }
}