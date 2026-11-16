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
  const mobile = window.matchMedia('(max-width: 820px)')
  const updateLayout = () => {
    if (!mobile.matches) closeMenu()
  }
  mobile.addEventListener('change', updateLayout)
  initSectionNavigation()
  updateLayout()
  initRecommendationGallery()
  initUpdateVideos()
  initMotion()
  function initSectionNavigation() {
    const links = [...menu.querySelectorAll('a')]
    const header = document.querySelector('.site-header')
    const sections = ['about', 'services', 'care', 'charity', 'honors', 'leadership', 'culture', 'message', 'recommendations', 'updates']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    let frame = 0
    let currentId = null
    const update = () => {
      frame = 0
      // 按导航栏下方的阅读位置确定栏目，不依赖长图区块的可见比例。
      const readingLine = Math.min(header.getBoundingClientRect().bottom + 32, innerHeight - 1)
      let activeId = ''
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break
        activeId = section.id === 'charity' ? 'care' : section.id
      }
      if (activeId === currentId) return
      currentId = activeId
      links.forEach((link) => {
        if (link.hash === `#${activeId}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    window.addEventListener('hashchange', scheduleUpdate)
    window.addEventListener('pageshow', scheduleUpdate)
    window.addEventListener('load', scheduleUpdate, { once: true })
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(scheduleUpdate)
      observer.observe(document.querySelector('main'))
      observer.observe(header)
    }
    document.fonts?.ready.then(scheduleUpdate)
    scheduleUpdate()
  }
  function initUpdateVideos() {
    const videos = [...document.querySelectorAll('.update-player video')]
    videos.forEach((video) => {
      const cover = video.parentElement.querySelector('.update-play-cover')
      const showRetry = () => {
        cover.hidden = false
        cover.querySelector('.update-play-label').textContent = '重试播放'
      }
      cover.hidden = false
      cover.addEventListener('click', () => {
        if (video.error) video.load()
        cover.hidden = true
        video.play().catch(showRetry)
      })
      video.addEventListener('error', showRetry)
      video.addEventListener('play', () => {
        cover.hidden = true
        videos.forEach((other) => {
          if (other !== video && !other.paused) other.pause()
        })
      })
    })
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) videos.forEach((video) => video.pause())
    })
  }
  function initRecommendationGallery() {
    const viewer = document.querySelector('.recommendation-viewer')
    if (!viewer || typeof viewer.showModal !== 'function') return
    const links = [...document.querySelectorAll('[data-gallery-index]')]
    const image = viewer.querySelector('img')
    const title = viewer.querySelector('h3')
    const counter = viewer.querySelector('[data-gallery-count]')
    const closeButton = viewer.querySelector('[data-gallery-close]')
    const previous = viewer.querySelector('[data-gallery-prev]')
    const next = viewer.querySelector('[data-gallery-next]')
    let current = 0
    let opener
    let previousOverflow = ''
    const showImage = (index) => {
      current = index
      const source = links[current].querySelector('img')
      image.src = source.currentSrc || source.src
      image.alt = source.alt
      title.textContent = source.alt
      counter.textContent = `${current + 1} / ${links.length}`
      previous.disabled = current === 0
      next.disabled = current === links.length - 1
      viewer.querySelector('.recommendation-viewer-body').scrollTop = 0
    }
    const move = (step) => {
      const index = current + step
      if (index >= 0 && index < links.length) showImage(index)
    }
    links.forEach((link, index) => link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      opener = link
      showImage(index)
      previousOverflow = document.documentElement.style.overflow
      viewer.showModal()
      document.documentElement.style.overflow = 'hidden'
      closeButton.focus()
    }))
    closeButton.addEventListener('click', () => viewer.close())
    viewer.addEventListener('click', (event) => {
      const bounds = viewer.getBoundingClientRect()
      if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close()
    })
    viewer.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow
      opener?.focus({ preventScroll: true })
    })
    previous.addEventListener('click', () => move(-1))
    next.addEventListener('click', () => move(1))
    viewer.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        move(event.key === 'ArrowLeft' ? -1 : 1)
      }
    })
  }
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

    // 长图栏目逐项进入视口；整个长栏目可能永远达不到整块的显示比例阈值。
    const elements = [...document.querySelectorAll('.verbatim-index, .verbatim-article:not(.recommendations-article):not(.updates-article), .recommendations-heading, .recommendation-copy, .recommendation-image, .updates-heading, .update-card')]
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
  }
})()
