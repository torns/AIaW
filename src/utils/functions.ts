import { Hct, hexFromArgb } from '@material/material-color-utilities'
import { Avatar } from './types'

function randomHash(digits = 64) {
  const array = new Uint8Array(digits / 8)
  crypto.getRandomValues(array)
  return Array.from(array).map(i => i.toString(16).padStart(2, '0')).join('')
}

function escapeRegex(str: string) {
  return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function defaultAvatar(text: string): Avatar {
  return {
    type: 'text',
    text,
    hue: Math.floor(Math.random() * 360)
  }
}

function hctToHex(h: number, c: number, t: number): string {
  return hexFromArgb(Hct.from(h, c, t).toInt())
}

let count = crypto.getRandomValues(new Uint32Array(1))[0]
function genId() {
  const timeHash = Date.now().toString(32).padStart(9, '0')
  const countHash = (count++ % 0x20000000).toString(32).padStart(6, '0')
  const randomHash = (crypto.getRandomValues(new Uint16Array(1))[0] % 0x8000).toString(32).padStart(3, '0')
  return timeHash + countHash + randomHash
}
function idTimestamp(id: string) {
  return parseInt(id.slice(0, 9), 32)
}

function JSONEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function mimeTypeMatch(mimeType: string, mimeTypes: string[]) {
  return mimeTypes.some(t => {
    if (t === '*' || t === mimeType) return true
    const [type, subtype] = t.split('/')
    if (!mimeType.startsWith(type + '/')) return false
    return subtype === '*'
  })
}

async function isTextFile(file: Blob) {
  if (file.size > 1024 * 1024) return false
  const array = new Uint8Array(await file.arrayBuffer())
  for (const byte of array) {
    // Allowed control characters:
    // 9  - Tab
    // 10 - Line feed (LF)
    // 13 - Carriage return (CR)
    if (byte < 32 && ![9, 10, 13].includes(byte)) {
      return false
    }
  }

  return true
}

function wrapCode(code: string, lang = '') {
  return '`````' + lang + '\n' + code + '\n`````'
}

function wrapQuote(text: string) {
  return '> ' + text.replace(/\n/g, '\n> ')
}

function parseSeconds(seconds: string) {
  return seconds.split(':').reduce((acc, cur) => acc * 60 + Number(cur), 0)
}

function caselessIncludes(a: string, b: string) {
  return a.toLowerCase().includes(b.toLowerCase())
}

function displayLength(text: string) {
  let length = 0
  for (const i of text) {
    length += (/[\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]/.test(i)) ? 2 : 1
  }
  return length
}

function parsePageRange(range: string) {
  return range.split(',').map(r => {
    const [start, end] = r.split('-').map(Number)
    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }).flat().map(p => p - 1)
}

const pageFhStyle = (offset: number, height: number) => ({
  height: `${height - offset}px`,
  overflowY: 'auto'
})

export { randomHash, escapeRegex, defaultAvatar, hctToHex, genId, idTimestamp, JSONEqual, mimeTypeMatch, isTextFile, wrapCode, wrapQuote, parseSeconds, caselessIncludes, displayLength, parsePageRange, pageFhStyle }
