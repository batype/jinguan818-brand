import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const root = path.join(import.meta.dirname, 'dist')
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8')
new vm.Script(js)
assert(html.includes('<html lang="zh-CN">'))
assert(html.includes('<title>火炎焱多元化（广州）投资有限公司'))
assert(
  !/USDT|XRP|XMJ|数字货币|数字资产|货币交易|货币开发|区块链|质押|钱包|收益|公排|奖池|彩票|下载|download|金管818|股权卡包|宝殿轮回/i.test(
    html + js + css,
  ),
)
const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
const ids = new Set(allIds)
assert.equal(ids.size, allIds.length, '页面 ID 重复')
for (const [, fragment] of html.matchAll(/(?:href|aria-controls)="#?([^"]+)"/g)) {
  if (!fragment.startsWith('assets/') && !fragment.includes('.') && !fragment.includes(':'))
    assert(ids.has(fragment), `锚点或控制目标缺失：${fragment}`)
}
for (const [, file] of html.matchAll(/(?:src|href)="((?:assets\/|styles\.css|app\.js)[^"]*)"/g))
  assert(fs.existsSync(path.join(root, file)), `资源缺失：${file}`)
assert(!/<form\b|type="password"|tel:|mailto:/i.test(html))
for (const name of ['公司概况', '战略布局', '科技与服务', '社会责任', '企业文化', '领导致辞'])
  assert(html.includes(name), `板块缺失：${name}`)
assert.equal((html.match(/role="tab"/g) || []).length, 6)
assert(
  !/中国最佳雇主|中国最佳企业公民|最佳服务品牌奖|管理资产.{0,12}[亿万]|年化|保本|稳赚|已获.{0,12}荣誉/.test(
    html + js,
  ),
)
console.log('公司官网检查通过：脚本语法、资源、锚点、六大战略布局及内容边界。')
