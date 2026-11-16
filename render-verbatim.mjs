import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { renderRecommendations } from './render-recommendations.mjs'
import { renderUpdates } from './render-updates.mjs'

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
    label: '火炎焱纲领',
    marker: '火炎焱方向：',
    theme: 'paper',
    heading: '火炎焱纲领',
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
    if (section.id === 'leadership') {
      copy = copy.replace(
        /^([ \u00a0\u3000]*)(携手共发展，华夏永相伴)([ \u00a0\u3000]*)$/m,
        (_, before, motto, after) => `<span class="verbatim-leadership-motto"><span class="verbatim-source-space" aria-hidden="true">${before}</span>${motto}<span class="verbatim-source-space" aria-hidden="true">${after}</span></span>`,
      )
    }
    if (section.id === 'culture') {
      const renderProse = (value) => {
        const clauses = value.match(/[^，、。！；]+[，、。！；]?/g) || []
        assert.equal(clauses.join(''), value, '说明文字排版不得改变原文')
        return `<span class="verbatim-prose">${clauses
          .map((clause) => `<span class="verbatim-clause">${clause}</span>`)
          .join('')}</span>`
      }
      const renderPairs = (value, pattern = /[^，、。！；]+[，、。！；]?/g, phrasesPerLine = 2) => {
        const phrases = value.match(pattern) || []
        assert.equal(phrases.join(''), value, '词组排版不得改变原文')
        const lines = []
        for (let i = 0; i < phrases.length; i += phrasesPerLine) {
          const pair = phrases
            .slice(i, i + phrasesPerLine)
            .map((phrase) => `<span class="verbatim-phrase">${phrase}</span>`)
            .join('')
          lines.push(`<span class="verbatim-pair-line">${pair}</span>`)
        }
        return `<span class="verbatim-pair-lines">${lines.join('')}</span>`
      }
      copy = copy.replace(
        /(^|\n)(火炎焱[^：\n]*：|核心价值观：)([^\n]+)/g,
        (_, prefix, label, value) => {
          let content
          let paired = true
          if (label === '火炎焱方向：') {
            content = renderPairs(value, /\s*♦[^♦]+/g)
          } else if (label === '核心价值观：') {
            const end = value.indexOf('。') + 1
            assert(end > 0, '核心价值观首句边界缺失')
            content = renderPairs(value.slice(0, end)) + renderProse(value.slice(end))
          } else if (label === '火炎焱精神：') {
            content = renderPairs(value, undefined, 4)
          } else if (/火炎焱(?:文化|风格|导训|宣言|使命)：/.test(label)) {
            content = renderPairs(value)
          } else {
            paired = false
            content = renderProse(value)
          }
          return `${prefix}<span class="verbatim-entry${paired ? ' verbatim-paired' : ''}${label === '火炎焱精神：' ? ' verbatim-spirit' : ''}"><strong class="verbatim-term">${label}</strong><span class="verbatim-content">${content}</span></span>`
        },
      )
    }
    if (section.id === 'message') {
      copy = copy.replace(/(^|\n)我们一定会做到：([^\n]+)/, (_, prefix, value) => {
        const items = value.match(/\S+\s*/g) || []
        assert.equal(items.length, 4, '寄语承诺须完整保留四项')
        assert.equal(items.join(''), value, '寄语承诺排版不得改变文字或空白')
        const rows = []
        for (let i = 0; i < items.length; i += 2) {
          rows.push(`<span class="verbatim-pair-line">${items.slice(i, i + 2).map(item => `<span class="verbatim-phrase">${item}</span>`).join('')}</span>`)
        }
        return `${prefix}<span class="verbatim-entry verbatim-pledge"><strong class="verbatim-term"><span>我们一定</span><span>会做到：</span></strong><span class="verbatim-content"><span class="verbatim-pair-lines">${rows.join('')}</span></span></span>`
      })
    }
    copy = copy.replaceAll('♦', '<span class="verbatim-diamond">♦</span>')
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
    }">${copy}</div></div></div></div></section>${city}${section.id === 'message' ? renderRecommendations(root) + renderUpdates(root) : ''}`
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
