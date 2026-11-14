import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
const project = import.meta.dirname
const root = path.join(project, 'dist')
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8')
const raw = fs.readFileSync(path.join(project, 'content/company-profile.txt'), 'utf8')
// 此指纹对应用户本次消息原文；修改原文须取得新的逐字文本，不能通过改断言绕过。
assert.equal(
  crypto.createHash('sha256').update(raw).digest('hex'),
  '8e1a11fa89c6742fe49cdddfd4d4e854a3f597b2e9c6404619c1d6febbdf18d8',
  '保存的公司原文发生变化',
)
execFileSync(process.execPath, [path.join(project, 'render-verbatim.mjs'), '--check'], {
  stdio: 'inherit',
})
const blocks = [
  ...html.matchAll(
    /<div class="verbatim-copy" data-source-block="(\d+)" data-source-start="\d+" data-source-end="\d+">([\s\S]*?)<\/div>/g,
  ),
]
assert.equal(blocks.length, 8, '原文分区缺失')
const decode = (text) =>
  text
    .replace(/<[^>]*>/g, '')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
assert.equal(blocks.map((block) => decode(block[2])).join(''), raw, '网站文字与用户原文不一致')
new vm.Script(js)
new vm.Script(fs.readFileSync(path.join(root, 'sculpture.js'), 'utf8'))
assert(html.includes('<html lang="zh-CN">'))
assert(html.includes('<title>火炎焱多元化（广州）投资有限公司'))
// 用户最新明确要求全文逐字保留，原文内的全部业务表述照录；原文外不增写业务文案。
const surrounding = html.replace(
  /<div class="verbatim-copy" data-source-block="\d+" data-source-start="\d+" data-source-end="\d+">[\s\S]*?<\/div>/g,
  '',
)
assert(!/USDT|XRP|XMJ|下载|download|金管818|股权卡包|宝殿轮回/i.test(surrounding + js + css))
const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
const ids = new Set(allIds)
assert.equal(ids.size, allIds.length, '页面 ID 重复')
for (const [, fragment] of html.matchAll(/(?:href|aria-controls)="#?([^"]+)"/g))
  if (!fragment.startsWith('assets/') && !fragment.includes('.') && !fragment.includes(':'))
    assert(ids.has(fragment), `锚点缺失：${fragment}`)
for (const [, file] of html.matchAll(
  /(?:src|href)="((?:assets\/|styles\.css|app\.js|sculpture\.js)[^"]*)"/g,
))
  assert(fs.existsSync(path.join(root, file)), `资源缺失：${file}`)
assert(!/<form\b|type="password"|tel:|mailto:/i.test(html))
for (const label of [
  '公司概况',
  '产品与服务',
  '养老',
  '公益',
  '荣誉',
  '领导致辞',
  '火炎焱文化',
  '寄语',
])
  assert(html.includes(label), `原文板块缺失：${label}`)
console.log(
  `公司官网检查通过：${raw.length} 个原文字符逐字一致，保留标点、数字和空白；静态资源与脚本检查通过。`,
)
