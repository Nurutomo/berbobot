import { onCommand } from "@nurutomo/mahbod"
import Config from "../lib/ConfigLoader"
import { PluginClass } from "@nurutomo/mahbod/lib/util/PluginManager"
import Sticker from "../lib/Sticker"

export default class StickerMaker extends PluginClass {
    command: ['s', 'sticker', 'stiker', 'gifstiker', 'gifsticker', 'stikergif', 'stickergif']

    async onCommand({ m, command, args }: onCommand) {
        let sticker: Buffer
        try {
            let q = m.quoted ? m.quoted : m
            let mime = typeof q.msg === 'object' && 'mimetype' in q.msg ? q.msg.mimetype : ''
            if (/image|video|webp/.test(mime)) {
                let img = await q.download()
                if (!img || !Buffer.isBuffer(img)) throw `balas media dengan caption *${command}*`
                if (/video/.test(mime) && (typeof q.msg === 'object' && 'seconds' in q.msg ? q.msg.seconds : Infinity) > 10) throw `maksimal durasi video 10 detik`
                sticker = await Sticker(img, {
                    packname: Config.value.sticker.packname,
                    author: Config.value.sticker.author
                })
            } else if (args[0]) {
                if (isUrl(args[0])) sticker = await Sticker(args[0], {
                    packname: Config.value.sticker.packname,
                    author: Config.value.sticker.author
                })
                else throw 'URL tidak valid!'
            }
        } finally {
            if (sticker) m.reply({ sticker })
            else throw 'Conversion failed'
        }
    }
}

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
