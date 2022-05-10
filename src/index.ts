import { Connection, Plugins } from '@nurutomo/mahbod'
import path from 'path'

Plugins.addPluginFolder(path.join(__dirname, 'plugins'))
Plugins.addPluginFolder(path.join(__dirname, '../plugins'))

let bot = new Connection(process.argv[2] || 'default')
bot.start()
