import got from 'got'
import crypto from 'crypto'
import webp from 'node-webpmux'
import { ffmpeg } from './Converter'

/**
 * Image to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 */
export async function sticker(img: Buffer, url?: string | URL) {
    if (url) {
        let res = await got(url)
        if (res.statusCode !== 200) throw res.body
        img = res.rawBody
    }
    return await ffmpeg(img, [
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
    ], 'jpeg', 'webp')
}

/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker 
 * @param {String} packname 
 * @param {String} author 
 * @param {String} categories 
 * @param {Object} extra 
 * @returns 
 */
export async function addExif(webpSticker: Buffer, packname: string, author: string, categories: string[] = [''], extra: Object = {}): Promise<Buffer> {
    const img = new webp.Image();
    const stickerPackId = crypto.randomBytes(32).toString('hex');
    const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, ...extra };
    let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    let exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    await img.load(webpSticker)
    img.exif = exif
    return await img.save(null)
}

/**
 * Image to Sticker
 */
export default async function Sticker(img: Buffer | string | URL, { packname = '', author = '', categories = [''], extra = {} }: {
    packname?: string
    author?: string
    categories?: string[]
    extra?: Object
}): Promise<Buffer> {
    let s
    if (Buffer.isBuffer(img)) s = await sticker(img)
    else s = await sticker(null, img)

    return await addExif(s, packname, author, categories, extra)

}