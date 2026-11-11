'use strict'
;(() => {
  document.documentElement.classList.add('js')
  const menuButton = document.querySelector('.menu-button')
  const menu = document.querySelector('#site-nav')
  const closeMenu = () => {
    menu.classList.remove('is-open')
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.setAttribute('aria-label', '打开导航')
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true'
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航')
    menu.classList.toggle('is-open', open)
  })
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu()
      menuButton.focus()
    }
  })
  window.matchMedia('(min-width: 641px)').addEventListener('change', (e) => {
    if (e.matches) closeMenu()
  })
  const icon = (id, extra = '') =>
    `<svg class="icon ${extra}" aria-hidden="true"><use href="#${id}"/></svg>`
  const favorites = new Set()
  const products = [
    {
      id: 'morning',
      title: '日常器物灵感',
      note: '让每一天，多一点喜欢',
      alt: '陶瓷杯与亚麻的日常场景',
    },
    {
      id: 'journey',
      title: '随行生活灵感',
      note: '把心意，带在身边',
      alt: '暖棕色随行包的生活场景',
    },
  ]
  let currentScene = 'discover'
  const phone = document.querySelector('#app-preview')
  const content = document.querySelector('#phone-content')
  const headings = { discover: '精选商城', favorites: '我的收藏', orders: '订单服务' }
  const announcement = document.querySelector('#demo-announcement')
  const productMarkup = (product) =>
    `<article class="demo-product"><img src="assets/lifestyle-editorial.png" alt="${
      product.alt
    }" width="1122" height="1402" loading="lazy"><button class="demo-heart" data-favorite="${
      product.id
    }" aria-pressed="${favorites.has(product.id)}" aria-label="${
      favorites.has(product.id) ? '取消收藏' : '收藏'
    }${product.title}">${icon('heart')}</button><div class="demo-product-copy"><h4>${
      product.title
    }</h4><span>${product.note}</span></div></article>`
  function renderScene() {
    document.querySelector('#phone-heading').textContent = headings[currentScene]
    phone.setAttribute('aria-labelledby', `tab-${currentScene}`)
    if (currentScene === 'discover') {
      content.innerHTML = `<div class="demo-search">${icon(
        'search',
      )}<span>搜索商品或分类</span></div><div class="demo-banner"><small>FOR EVERY LITTLE MOMENT</small><h4>为每一份喜欢，<br>留个位置。</h4></div><div class="demo-tags"><span>精选推荐</span><span>新品灵感</span><span>心动收藏</span></div><div class="demo-products">${products
        .map(productMarkup)
        .join('')}</div><p class="demo-note">试试点击爱心，再切换到「我的收藏」。</p>`
    } else if (currentScene === 'favorites') {
      const selected = products.filter((product) => favorites.has(product.id))
      content.innerHTML = `<div class="demo-favorite-heading">${icon(
        'heart',
      )}<div><h4>把喜欢，放在一起。</h4><p>示例清单 · 已收藏 ${selected.length} 项</p></div></div>${
        selected.length
          ? `<div class="demo-products">${selected
              .map(productMarkup)
              .join('')}</div><p class="demo-note">这些心意，随时都能回来看看。</p>`
          : `<div class="demo-empty">${icon(
              'heart',
            )}<span>心动清单，等你来填满。</span><span>在「发现好物」演示中点击爱心即可体验。</span></div>`
      }`
    } else {
      content.innerHTML = `<div class="demo-banner"><small>EVERY STEP, AT EASE</small><h4>购物进度，<br>一目了然。</h4></div><div class="demo-order"><div class="demo-order-top"><span>示例订单</span><strong>待收货</strong></div><h4>每一份心意，都有迹可循。</h4><div class="demo-progress"><span class="done"><i></i>已下单</span><span class="done"><i></i>已发货</span><span><i></i>待收货</span></div><div class="demo-service-row"><span>订单状态</span><b>集中查看</b></div><div class="demo-service-row"><span>售后服务</span><b>清晰入口</b></div></div><p class="demo-note">此处为流程示意，不关联真实订单。</p>`
    }
    phone
      .querySelectorAll('.phone-bottom>span')
      .forEach((item, index) =>
        item.classList.toggle(
          'current',
          index === (currentScene === 'discover' ? 0 : currentScene === 'favorites' ? 1 : 2),
        ),
      )
  }
  function setScene(scene, announce = true) {
    if (!Object.hasOwn(headings, scene)) return
    currentScene = scene
    document.querySelectorAll('.scene-tab').forEach((tab) => {
      const active = tab.dataset.scene === scene
      tab.classList.toggle('active', active)
      tab.setAttribute('aria-selected', String(active))
      tab.tabIndex = active ? 0 : -1
    })
    renderScene()
    if (announce) announcement.textContent = `已切换到${headings[scene]}界面演示。`
  }
  const tabs = [...document.querySelectorAll('.scene-tab')]
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
  document
    .querySelectorAll('[data-scene-link]')
    .forEach((link) => link.addEventListener('click', () => setScene(link.dataset.sceneLink)))
  content.addEventListener('click', (event) => {
    const button = event.target.closest('[data-favorite]')
    if (!button) return
    const id = button.dataset.favorite
    if (!products.some((product) => product.id === id)) return
    const active = !favorites.has(id)
    active ? favorites.add(id) : favorites.delete(id)
    const product = products.find((product) => product.id === id)
    if (currentScene === 'favorites') renderScene()
    else {
      button.setAttribute('aria-pressed', String(active))
      button.setAttribute('aria-label', `${active ? '取消收藏' : '收藏'}${product.title}`)
    }
    announcement.textContent = `${active ? '已收藏' : '已取消收藏'}${
      product.title
    }。这是网站演示，不关联 App 账户。`
  })
  const modeButton = document.querySelector('.phone-mode')
  modeButton.addEventListener('click', () => {
    const dark = phone.dataset.mode !== 'dark'
    phone.dataset.mode = dark ? 'dark' : 'light'
    modeButton.setAttribute('aria-pressed', String(dark))
    modeButton.setAttribute('aria-label', `切换到${dark ? '浅色' : '深色'}界面演示`)
    announcement.textContent = `已切换到${dark ? '深色' : '浅色'}界面演示。`
  })
  document.querySelectorAll('.faq-list details').forEach((details) =>
    details.addEventListener('toggle', () => {
      if (details.open)
        document.querySelectorAll('.faq-list details').forEach((other) => {
          if (other !== details) other.open = false
        })
    }),
  )
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        }),
      { threshold: 0.08 },
    )
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
    const navObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            menu.querySelectorAll('a:not(.nav-cta)').forEach((link) => {
              if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'true')
              else link.removeAttribute('aria-current')
            })
        }),
      { rootMargin: '-25% 0px -55% 0px' },
    )
    ;['discover', 'experience', 'about', 'questions'].forEach((id) =>
      navObserver.observe(document.getElementById(id)),
    )
  } else
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'))
  setScene('discover', false)
})()
