import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const source = fs.readFileSync(path.join(root, 'content/company-profile.txt'), 'utf8')
const file = path.join(root, 'dist/index.html')
const escape = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const sections = [
  { id: 'about', label: '公司概况', marker: null, theme: 'paper', heading: '公司概况' },
  { id: 'services', label: '产品与服务', marker: '【产品与服务】', theme: 'dark' },
  { id: 'care', label: '养老', marker: '【养老】', theme: 'paper' },
  { id: 'charity', label: '公益', marker: '【公益】', theme: 'dark' },
  { id: 'honors', label: '荣誉', marker: '【荣誉】', theme: 'paper' },
  { id: 'leadership', label: '领导致辞', marker: '【领导致辞】', theme: 'dark' },
  {
    id: 'culture',
    label: '火炎焱文化',
    marker: '火炎焱方向：',
    theme: 'paper',
    heading: '火炎焱文化',
  },
  { id: 'message', label: '寄语', marker: '【寄语】', theme: 'dark' },
]
const offsets = sections.map((section) => (section.marker ? source.indexOf(section.marker) : 0))
offsets.forEach((offset, index) =>
  assert(
    offset >= 0 && (index === 0 || offset > offsets[index - 1]),
    `原文段落边界异常：${sections[index].label}`,
  ),
)
let rebuilt = ''
const rendered = sections
  .map((section, index) => {
    const text = source.slice(offsets[index], offsets[index + 1] ?? source.length)
    rebuilt += text
    let copy = escape(text)
    if (section.marker?.startsWith('【'))
      copy = copy.replace(
        escape(section.marker),
        `<h2 id="${section.id}-title" class="verbatim-heading">${escape(section.marker)}</h2>`,
      )
    if (section.id === 'culture')
      copy = copy.replace(
        /(^|\n)(火炎焱[^：\n]*：|核心价值观：)/g,
        '$1<strong class="verbatim-term">$2</strong>',
      )
    const title = section.heading
      ? `<h2 id="${section.id}-title" class="verbatim-heading">${section.heading}</h2>`
      : ''
    const city =
      index === 0
        ? `<section class="city-chapter" aria-label="广州城市影像"><div class="city-image" aria-hidden="true"></div><div class="city-copy shell"><p class="eyebrow">火炎焱多元化（广州）投资有限公司</p><h2>和合各方利益，<br>实现多赢共好</h2><span class="city-location">中国 · 广州 / 城市影像</span></div></section>`
        : ''
    return `<section class="verbatim-section section verbatim-${section.theme}" id="${
      section.id
    }" aria-labelledby="${
      section.id
    }-title"><div class="shell"><div class="verbatim-layout"><aside class="verbatim-index" aria-hidden="true"><span>${String(
      index + 1,
    ).padStart(2, '0')}</span><i></i><span>${
      section.label
    }</span></aside><div class="verbatim-article">${title}<div class="verbatim-copy" data-source-block="${index}" data-source-start="${
      offsets[index]
    }" data-source-end="${
      offsets[index + 1] ?? source.length
    }">${copy}</div></div></div></div></section>${city}`
  })
  .join('\n')
assert.equal(rebuilt, source, '原文切分后内容发生变化')
const html = fs.readFileSync(file, 'utf8')
const expected = html.replace(
  /(?<=<!-- COMPANY_COPY_START -->)[\s\S]*?(?=<!-- COMPANY_COPY_END -->)/,
  `\n${rendered}\n      `,
)
if (process.argv.includes('--check'))
  assert.equal(html, expected, '官网原文生成内容不一致，请执行 node render-verbatim.mjs')
else fs.writeFileSync(file, expected)
console.log(
  `官网原文${process.argv.includes('--check') ? '校验' : '渲染'}通过：${source.length} 个字符，${
    sections.length
  } 个原文段落。`,
)
