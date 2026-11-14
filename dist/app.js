'use strict'
;(() => {
  document.documentElement.classList.add('js')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
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
  const mobile = window.matchMedia('(max-width: 640px)')
  const updateLayout = () => {
    document
      .querySelector('.portfolio-tabs')
      .setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical')
    if (!mobile.matches) closeMenu()
  }
  mobile.addEventListener('change', updateLayout)
  const sectors = {
    technology: {
      english: 'TECHNOLOGY & INDUSTRY',
      title: '让创新走向实际应用。',
      text: '以技术研发为核心，关注科学研究成果转化、项目投资与产业应用，探索技术、资本与实体经营的连接。',
      tags: ['技术研发', '科研成果转化', '项目投资'],
    },
    supply: {
      english: 'SUPPLY CHAIN & COMMERCE',
      title: '连接源头，也连接需求。',
      text: '围绕供应链管理与商品流通，布局网上购物、农副产品对接、珠宝贵金属源头供货及商品贸易，探索线上线下协同。',
      tags: ['供应链管理', '农副产品对接', '商品贸易'],
    },
    health: {
      english: 'HEALTH & SENIOR CARE',
      title: '让关怀贯穿更长的人生。',
      text: '以老有所依、老有所养、老有所安为关注方向，将养老健康产业与生物科技作为后续战略发展的重要议题。',
      tags: ['养老健康', '长者生活', '生物科技方向'],
    },
    energy: {
      english: 'ENERGY & MOBILITY',
      title: '面向更可持续的生活方式。',
      text: '关注能源节约与出行需求，布局汽车销售、充电桩安装及管理、旅游出行等领域，探索产业协同与服务创新。',
      tags: ['能源节约', '汽车与充电设施', '旅游出行'],
    },
    assets: {
      english: 'REAL ECONOMY & ALLOCATION',
      title: '以长期视野，审视产业价值。',
      text: '围绕企业自有资金投资、房地产投资与投资咨询，关注实体经营和资产配置的协同，重视专业研究与稳健运营。',
      tags: ['企业自有资金投资', '房地产投资', '投资咨询'],
    },
    culture: {
      english: 'CULTURE & PROFESSIONAL SERVICES',
      title: '让专业成为协同的支点。',
      text: '关注艺术品进出口、版权与专利服务、法律咨询和法律文书代理，以专业服务连接文化创新与企业发展。',
      tags: ['文化与艺术', '知识产权服务', '专业咨询'],
    },
  }
  const tabs = [...document.querySelectorAll('.portfolio-tab')]
  function selectSector(key) {
    if (!Object.hasOwn(sectors, key)) return
    const panel = document.getElementById('sector-panel')
    panel.classList.remove('is-switching')
    void panel.offsetWidth
    panel.classList.add('is-switching')
    const sector = sectors[key],
      index = tabs.findIndex((tab) => tab.dataset.sector === key)
    tabs.forEach((tab) => {
      const selected = tab.dataset.sector === key
      tab.classList.toggle('active', selected)
      tab.setAttribute('aria-selected', String(selected))
      tab.tabIndex = selected ? 0 : -1
    })
    document.getElementById('sector-panel').setAttribute('aria-labelledby', `tab-${key}`)
    document.querySelector('.sector-visual').dataset.sector = key
    document.querySelector('.sector-visual-label').textContent = sector.english
    const words = {
      technology: ['TECH', 'NOLOGY.'],
      supply: ['SUPPLY', 'CHAIN.'],
      health: ['HUMAN', 'CARE.'],
      energy: ['NEW', 'ENERGY.'],
      assets: ['LONG', 'VIEW.'],
      culture: ['CULT', 'URE.'],
    }
    const type = document.querySelector('.sector-type')
    type.replaceChildren(document.createTextNode(words[key][0]), document.createElement('br'))
    const outline = document.createElement('i')
    outline.textContent = words[key][1]
    type.append(outline)
    document.querySelector('.sector-serial').textContent = `0${index + 1} / 06`
    const copy = document.getElementById('sector-copy')
    copy.querySelector('.eyebrow').textContent = sector.english
    copy.querySelector('h3').textContent = sector.title
    copy.querySelector('p:not(.eyebrow)').textContent = sector.text
    copy.querySelector('.sector-tags').replaceChildren(
      ...sector.tags.map((tag) => {
        const node = document.createElement('span')
        node.textContent = tag
        return node
      }),
    )
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectSector(tab.dataset.sector))
    tab.addEventListener('keydown', (event) => {
      let next
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % tabs.length
      if (['ArrowUp', 'ArrowLeft'].includes(event.key))
        next = (index + tabs.length - 1) % tabs.length
      if (event.key === 'Home') next = 0
      if (event.key === 'End') next = tabs.length - 1
      if (next !== undefined) {
        event.preventDefault()
        selectSector(tabs[next].dataset.sector)
        tabs[next].focus()
      }
    })
  })
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        menu.querySelectorAll('a').forEach((link) => {
          if (link.hash === `#${visible.target.id}`) link.setAttribute('aria-current', 'location')
          else link.removeAttribute('aria-current')
        })
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: [0, 0.1, 0.3] },
    )
    ;['about', 'portfolio', 'innovation', 'responsibility', 'leadership'].forEach((id) =>
      observer.observe(document.getElementById(id)),
    )
  }
  updateLayout()
  initMotion()
  function initMotion() {
    const toggle = document.querySelector('.motion-toggle')
    let paused = reducedMotion.matches
    const applyMotion = () => {
      document.documentElement.classList.toggle('motion-paused', paused)
      toggle.setAttribute('aria-pressed', String(paused))
      toggle.querySelector('.motion-label').textContent = paused ? '开启动效' : '暂停动态效果'
      toggle.querySelector('.pause-glyph').textContent = paused ? '▷' : 'Ⅱ'
      toggle.disabled = reducedMotion.matches
      if (reducedMotion.matches)
        toggle.querySelector('.motion-label').textContent = '已减少动态效果'
      window.companySculpture?.setPaused(paused)
    }
    toggle.addEventListener('click', () => {
      paused = !paused
      applyMotion()
    })
    reducedMotion.addEventListener('change', () => {
      paused = reducedMotion.matches
      applyMotion()
    })
    applyMotion()

    const elements = [
      ...document.querySelectorAll(
        '.section-top, .about-layout>div, .foundation-grid article, .section-heading, .portfolio-layout, .innovation-copy, .methodology, .responsibility-copy, .care-grid article, .culture-heading, .values-grid article, .culture-statement, .leadership-layout>div, .closing h2',
      ),
    ]
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
      )
      elements.forEach((element, index) => {
        element.classList.add('reveal')
        element.style.setProperty(
          '--reveal-delay',
          `${
            element.parentElement.matches('.foundation-grid,.care-grid,.values-grid')
              ? (index % 3) * 80
              : 0
          }ms`,
        )
        observer.observe(element)
      })
    }
    const header = document.querySelector('.site-header')
    const progress = document.querySelector('.reading-progress>span')
    const city = document.querySelector('.city-chapter')
    const cityImage = document.querySelector('.city-image')
    let scheduled = false
    function renderScroll() {
      scheduled = false
      const y = window.scrollY,
        max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
      header.classList.toggle('is-scrolled', y > 160)
      progress.style.transform = `scaleX(${y / max})`
      if (!reducedMotion.matches && !paused) {
        const bounds = city.getBoundingClientRect()
        if (bounds.bottom > 0 && bounds.top < innerHeight)
          cityImage.style.setProperty(
            '--city-shift',
            `${Math.max(
              -75,
              Math.min(75, (innerHeight / 2 - bounds.top - bounds.height / 2) * 0.12),
            )}px`,
          )
      }
    }
    window.addEventListener(
      'scroll',
      () => {
        if (!scheduled) {
          scheduled = true
          requestAnimationFrame(renderScroll)
        }
      },
      { passive: true },
    )
    window.addEventListener('resize', renderScroll, { passive: true })
    renderScroll()
    if (window.matchMedia('(pointer: fine)').matches)
      document.querySelectorAll('.button').forEach((button) => {
        button.addEventListener('pointermove', (event) => {
          if (paused) return
          const rect = button.getBoundingClientRect()
          button.style.transform = `translate(${
            (event.clientX - rect.left - rect.width / 2) * 0.1
          }px,${(event.clientY - rect.top - rect.height / 2) * 0.15}px)`
        })
        button.addEventListener('pointerleave', () => {
          button.style.transform = 'translate(0,0)'
        })
      })
    const sectorVisual = document.querySelector('.sector-visual')
    sectorVisual.addEventListener('pointermove', (event) => {
      if (paused || event.pointerType === 'touch') return
      const rect = sectorVisual.getBoundingClientRect()
      sectorVisual.style.setProperty(
        '--sector-parallax',
        `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`,
      )
    })
    sectorVisual.addEventListener('pointerleave', () =>
      sectorVisual.style.setProperty('--sector-parallax', '0px'),
    )
  }
})()
