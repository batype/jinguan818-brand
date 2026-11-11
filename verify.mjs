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
assert(html.includes('<title>金管818'))
assert(
  !/USDT|XRP|XMJ|数字货币|区块链|质押|钱包|收益|公排|奖池|彩票|下载|download/i.test(
    html + js + css,
  ),
)
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))
for (const [, fragment] of html.matchAll(/<a\b[^>]*href="#([^"]+)"/g))
  assert(ids.has(fragment), `锚点缺失：${fragment}`)
for (const [, file] of html.matchAll(/(?:src|href)="((?:assets\/|styles\.css|app\.js)[^"]*)"/g))
  assert(fs.existsSync(path.join(root, file)), `资源缺失：${file}`)
assert(!/<form\b|type="password"|tel:|mailto:/i.test(html))
assert(fs.statSync(path.join(root, 'assets/qijing-poster.png')).size > 1000)
for (const name of ['商城购物', '会员社区', '专属股权卡包', '活动公告'])
  assert(html.includes(name), `主要模块缺失：${name}`)
assert(!/lifestyle-editorial|phone-bottom|日常器物灵感|随行生活灵感/.test(html + js + css))
console.log('宣传站检查通过：脚本语法、静态资源、内部锚点、内容边界与无个人信息收集表单。')
