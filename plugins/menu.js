module.exports = class Menu {
    constructor () {
        this.command = ['?', 'menu', 'help']
    }

    /**
     * 
     * @param {import('@nurutomo/mahbod').onCommand} param0 
     */
    onCommand({ m }) {
        return m.reply({ text: 'nggk ada' })
    }
}