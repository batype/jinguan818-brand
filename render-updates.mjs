import fs from 'node:fs'
import path from 'node:path'

export function renderUpdates(root) {
  const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
  const items = JSON.parse(fs.readFileSync(path.join(root, 'content/latest-updates.json'), 'utf8'))
  const cards = items.map((item, index) => `<article class="update-card" aria-labelledby="${item.id}-title">
    <div class="update-card-meta"><span>${String(index + 1).padStart(2, '0')} / 公开资讯</span><time datetime="${item.date}">${item.date.replaceAll('-', '.')}</time></div>
    <h3 id="${item.id}-title">${escape(item.title)}</h3>
    <p class="update-description">${escape(item.description)}</p>
    <div class="update-player"><video controls playsinline webkit-playsinline preload="none" controlslist="nodownload" poster="assets/updates/${item.poster}" width="${item.width}" height="${item.height}" aria-label="${escape(item.title)}视频"><source src="assets/updates/${item.video}" type="video/mp4">当前浏览器不支持视频播放，请使用支持 MP4 的浏览器观看。</video><button type="button" class="update-play-cover" aria-label="播放：${escape(item.title)}" hidden><img src="assets/updates/${item.poster}" alt="" width="${item.width}" height="${item.height}" loading="lazy"><span class="update-play-badge"><span aria-hidden="true">▶</span><span class="update-play-label">播放视频</span></span></button></div>
    <div class="update-video-meta"><span>视频资料 · ${item.duration}</span><span>支持全屏观看</span></div>
    <a class="update-source" href="${escape(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(item.sourceLabel)} <span aria-hidden="true">↗</span></a>
  </article>`).join('\n')
  return `<section class="updates section verbatim-paper" id="updates" aria-labelledby="updates-title"><div class="shell"><div class="verbatim-layout">
    <aside class="verbatim-index" aria-hidden="true"><span>10</span><i></i><span>最新动态</span></aside>
    <div class="verbatim-article updates-article"><div class="updates-heading"><h2 class="verbatim-heading" id="updates-title">【最新动态】</h2></div><div class="updates-list">${cards}</div></div>
  </div></div></section>`
}
