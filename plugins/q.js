const { default: MessageParser } = require('@nurutomo/mahbod/lib/util/MessageParser')

module.exports = class Q {
    constructor () {
        this.command = ['q']
    }

    /**
     * 
     * @param {import('@nurutomo/mahbod').onCommand} param0 
     */
    async onCommand({ sock, m }) {
        return sock.forwardCopy(m.chat, MessageParser(sock, await m.getQuotedObj()).quoted.fakeObj)
    }
}