module.exports = class Delete {
    constructor () {
        this.command = ['del', 'delete']
    }

    /**
     * 
     * @param {import('@nurutomo/mahbod').onCommand} param0 
     */
    async onCommand({ sock, m }) {
        if (m.quoted.fromMe) return sock.sendMessage(m.quoted.chat || m.chat, { delete: m.quoted.fakeObj.key })
    }
}