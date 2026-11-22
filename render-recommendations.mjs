import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

export function renderRecommendations(root) {
  const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const source = fs.readFileSync(path.join(root, 'content/latest-recommendation.txt'), 'utf8').trimEnd()
  const [title, ...lines] = source.split('\n').filter(Boolean)
  assert.equal(lines.length, 10, '推荐文案须完整保留十条')
  const images = JSON.parse(fs.readFileSync(path.join(root, 'content/recommendation-images.json'), 'utf8'))
  assert.equal(images.length, 8, '推荐图片须完整保留八张')
  const gallery = images.map((item, index) => {
    const number = String(index + 1).padStart(2, '0')
    const url = `assets/recommendations/${item.file}`
    return `<figure class="recommendation-image"><a class="recommendation-image-link" href="${url}" data-gallery-index="${index}" aria-label="放大查看：${item.title}"><img src="${url}" alt="提供方宣传资料 ${number}：${item.title}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"><span class="recommendation-enlarge" aria-hidden="true">↗</span></a><figcaption><span>${number} / ${item.title}</span><span>点击查看大图</span></figcaption></figure>`
  }).join('\n')
  return `<section class="recommendations section" id="recommendations" aria-labelledby="recommendations-title">
  <div class="shell"><div class="verbatim-layout">
    <aside class="verbatim-index" aria-hidden="true"><span>09</span><i></i><span>最新推荐</span></aside>
    <div class="verbatim-article recommendations-article">
      <div class="recommendations-heading"><p>SELECTED MATERIALS</p><h2 class="verbatim-heading" id="recommendations-title">最新推荐</h2></div>
      <blockquote class="recommendation-copy" cite="#recommendation-source"><span class="recommendation-source" id="recommendation-source">提供方宣传文案 · 原文</span><h3>${escape(title)}</h3><ol>${lines.map(line => `<li>${escape(line)}</li>`).join('\n')}</ol></blockquote>
      <div class="recommendation-gallery-heading"><h3>图文资料</h3><p>共 8 张 · 按提供顺序展示</p></div>
      <div class="recommendation-gallery">${gallery}</div>
    </div>
  </div></div>
  <dialog class="recommendation-viewer" aria-labelledby="recommendation-viewer-title">
    <div class="recommendation-viewer-toolbar"><h3 id="recommendation-viewer-title">图文资料</h3><button type="button" data-gallery-close aria-label="关闭图片预览">关闭 ×</button></div>
    <div class="recommendation-viewer-body"><img alt=""></div>
    <div class="recommendation-viewer-footer"><button type="button" data-gallery-prev aria-label="上一张图片">← 上一张</button><span data-gallery-count aria-live="polite"></span><button type="button" data-gallery-next aria-label="下一张图片">下一张 →</button></div>
  </dialog>
</section>`
}
