import { parse, stringify } from 'yaml'
import path from 'path'
import fs from 'fs'

export class ConfigLoader {
    _configPath: string
    value: {
        owner?: string[]
        sticker?: {
            packname: string
            author: string
        }
    } = {}

    constructor() {
        this._configPath = path.join(__dirname, '../../config.yml')
        this.load()
        setInterval(this.save, 30000)
    }


    load() {
        this._configPath = path.join(__dirname, '../../config.yml')
        try {
            this.value = parse(fs.readFileSync(this._configPath, 'utf-8'))
        } catch (e) {
            this.value = {}
            console.error(e)
        }
    }

    save() {
        this._configPath = path.join(__dirname, '../../config.yml')
        console.log(this._configPath)
        fs.writeFile(this._configPath, stringify(this.value) || '', err => {
            if (err) console.error(err)
        })
    }
}
const Config = new ConfigLoader
export default Config
