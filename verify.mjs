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
// 2026-11-15 用户授权：仅将栏目条目“火炎焱文化：”改为“火炎焱纲领：”。
// 反向还原该处后仍须匹配原始指纹，保护其余每个字符。
assert.equal(raw.split('火炎焱纲领：').length - 1, 1)
const original = raw.replace('火炎焱纲领：', '火炎焱文化：')
assert.equal(
  crypto.createHash('sha256').update(original).digest('hex'),
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
const recommendation = fs.readFileSync(path.join(project, 'content/latest-recommendation.txt'), 'utf8').trimEnd()
const suppliedCopy = html.match(/<blockquote class="recommendation-copy"[\s\S]*?<h3>(.*?)<\/h3><ol>([\s\S]*?)<\/ol><\/blockquote>/)
assert(suppliedCopy, '推荐原文缺失')
const recommendationItems = [...suppliedCopy[2].matchAll(/<li>(.*?)<\/li>/g)]
assert.equal(recommendationItems.length, 10)
assert.equal(decode(suppliedCopy[1]) + '\n\n' + recommendationItems.map(item => decode(item[1])).join('\n'), recommendation, '推荐文案与提供方原文不一致')
assert(html.indexOf('id="culture"') < html.indexOf('id="recommendations"'))
assert(html.indexOf('id="recommendations"') < html.indexOf('id="message"'))
assert(html.indexOf('id="recommendations"') < html.indexOf('id="updates"'))
assert(html.indexOf('id="updates"') < html.indexOf('id="message"'))
const updates = JSON.parse(fs.readFileSync(path.join(project, 'content/latest-updates.json'), 'utf8'))
const updateDescriptions = [...html.matchAll(/<p class="update-description">(.*?)<\/p>/g)]
assert.equal(updateDescriptions.length, 2, '最新动态应包含两条资讯')
assert.equal([...html.matchAll(/<video controls playsinline webkit-playsinline preload="none"/g)].length, 2)
updates.forEach((item, index) => {
  assert.equal(decode(updateDescriptions[index][1]), item.description, '动态文字或视频顺序发生变化')
  for (const [file, hash] of [[item.video, item.videoSha256], [item.poster, item.posterSha256]]) {
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/updates', file))).digest('hex'), hash, '动态视频或封面发生变化')
  }
})
const gallery = [...html.matchAll(/class="recommendation-image-link" href="([^"]+)" data-gallery-index="(\d+)"/g)]
const recommendationImages = JSON.parse(fs.readFileSync(path.join(project, 'content/recommendation-images.json'), 'utf8'))
assert.equal(gallery.length, 8)
gallery.forEach((item, index) => {
  assert.equal(item[2], String(index))
  assert.equal(item[1], `assets/recommendations/${recommendationImages[index].file}`)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, item[1]))).digest('hex'), recommendationImages[index].sha256, '提供方原图发生变化')
})
new vm.Script(js)
new vm.Script(fs.readFileSync(path.join(root, 'sculpture.js'), 'utf8'))
assert(html.includes('<html lang="zh-CN">'))
assert(html.includes('<title>火炎焱多元化（广州）投资有限公司'))
// 用户最新明确要求全文逐字保留，原文内的全部业务表述照录；原文外不增写业务文案。
const surrounding = html.replace(
  /<div class="verbatim-copy" data-source-block="\d+" data-source-start="\d+" data-source-end="\d+">[\s\S]*?<\/div>/g,
  '',
)
// nodownload 用于禁用视频原生控件的下载项，不属于下载入口。
assert(!/USDT|XRP|XMJ|下载|download|金管818|股权卡包|宝殿轮回/i.test(surrounding.replaceAll('controlslist="nodownload"', '') + js + css))
const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
const ids = new Set(allIds)
assert.equal(ids.size, allIds.length, '页面 ID 重复')
for (const [, fragment] of html.matchAll(/(?:href|aria-controls)="#?([^"]+)"/g))
  if (!fragment.startsWith('assets/') && !fragment.includes('.') && !fragment.includes(':'))
    assert(ids.has(fragment), `锚点缺失：${fragment}`)
for (const [, file] of html.matchAll(
  /(?:src|href|poster)="((?:assets\/|styles\.css|app\.js|sculpture\.js)[^"]*)"/g,
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
  '火炎焱纲领',
  '寄语',
])
  assert(html.includes(label), `原文板块缺失：${label}`)
console.log(
  `公司官网检查通过：${raw.length} 个原文字符逐字一致，保留标点、数字和空白；静态资源与脚本检查通过。`,
)
