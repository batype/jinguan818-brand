'use strict'
;(() => {
  const menuButton = document.querySelector('.menu-button')
  const menu = document.getElementById('site-nav')
  const closeMenu = () => {
    menu.classList.remove('is-open')
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.setAttribute('aria-label', '打开导航')
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true'
    menu.classList.toggle('is-open', open)
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航')
  })
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu()
      menuButton.focus()
    }
  })
  window.matchMedia('(min-width: 641px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu()
  })
  const announcement = document.getElementById('demo-announcement')
  const materials = {
    gold: { name: '鎏金切面', description: '原始股本' },
    amethyst: { name: '紫晶轨道', description: '原始股权' },
    jade: { name: '青玉', description: '原始股票' },
    platinum: { name: '星银', description: '金管同创' },
  }
  document.querySelectorAll('.material-picker button').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.material
      if (!Object.hasOwn(materials, key)) return
      document.getElementById('material-card').dataset.material = key
      document.getElementById('material-name').textContent = materials[key].name
      document.getElementById('material-description').textContent = materials[key].description
      document.querySelectorAll('.material-picker button').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button))
      })
      announcement.textContent = `已切换到${materials[key].name}卡面展示。`
    })
  })
  const scenes = {
    shopping: {
      title: '商城与订单',
      content:
        '<h3 class="scene-content-title">选购与订单，一处衔接。</h3><p class="scene-subtitle">从找到商品，到跟进订单</p><div class="demo-tools"><span>分类搜索</span><span>我的收藏</span><span>购物车</span></div><div class="demo-block"><h4>我的订单</h4><div class="demo-row"><span>付款进度</span><span>查看付款与确认状态</span></div><div class="demo-row"><span>物流进度</span><span>查看发货与收货状态</span></div><div class="demo-row"><span>退款售后</span><span>按订单状态提供操作</span></div></div><p class="demo-list-label">订单详情集中展示商品、收货和支付信息。</p>',
    },
    community: {
      title: '会员与社区',
      content:
        '<h3 class="scene-content-title">连接有迹，服务有期。</h3><p class="scene-subtitle">查看分享关系、成员与会员服务</p><div class="demo-path"><span>我的推荐</span><span>↔</span><span>我的社区</span></div><div class="demo-block"><h4>成员信息</h4><div class="demo-row"><span>成员资料</span><span>昵称与账号</span></div><div class="demo-row"><span>服务状态</span><span>已开通 / 未开通</span></div><div class="demo-row"><span>会员服务</span><span>查看有效期与续费入口</span></div></div><p class="demo-list-label">成员信息与服务状态，在个人中心统一查看。</p>',
    },
    equity: {
      title: '我的股权',
      content:
        '<h3 class="scene-content-title">专属卡片，清晰收纳。</h3><p class="scene-subtitle">分组概览 → 展开明细 → 独立转让入口</p><div class="demo-card-mini"><small>◇ ORIGINAL EQUITY · 卡面示意</small><strong>专属股权卡包</strong><p>分组查看 · 独立编号 · 整张持有</p></div><div class="demo-block"><div class="demo-row"><span>卡片明细</span><span>编号 / 来源 / 状态</span></div><div class="demo-row"><span>转让页面</span><span>选择卡片 / 查看记录</span></div></div><p class="demo-list-label">持有数量和可用状态以账户内实际展示为准。</p>',
    },
  }
  const tabs = [...document.querySelectorAll('.scene-tab')]
  const panel = document.getElementById('scene-panel')
  function setScene(key, announce = true) {
    if (!Object.hasOwn(scenes, key)) return
    tabs.forEach((tab) => {
      const selected = tab.dataset.scene === key
      tab.classList.toggle('active', selected)
      tab.setAttribute('aria-selected', String(selected))
      tab.tabIndex = selected ? 0 : -1
    })
    panel.setAttribute('aria-labelledby', `tab-${key}`)
    document.getElementById('scene-content').innerHTML = scenes[key].content
    if (announce) announcement.textContent = `已切换到${scenes[key].title}功能示意。`
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setScene(tab.dataset.scene))
    tab.addEventListener('keydown', (event) => {
      let next
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
        next = (index + tabs.length - 1) % tabs.length
      if (event.key === 'Home') next = 0
      if (event.key === 'End') next = tabs.length - 1
      if (next !== undefined) {
        event.preventDefault()
        setScene(tabs[next].dataset.scene)
        tabs[next].focus()
      }
    })
  })
  const orientation = window.matchMedia('(max-width: 640px)')
  const setOrientation = () =>
    document
      .querySelector('.scene-tabs')
      .setAttribute('aria-orientation', orientation.matches ? 'horizontal' : 'vertical')
  orientation.addEventListener('change', setOrientation)
  setOrientation()
  document.querySelectorAll('.faq-list details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open)
        document.querySelectorAll('.faq-list details').forEach((other) => {
          if (other !== details) other.open = false
        })
    })
  })
  setScene('shopping', false)
})()
