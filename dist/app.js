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
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        menu.querySelectorAll('a').forEach((link) => {
          if (link.hash === `#${visible.target.id === 'charity' ? 'care' : visible.target.id}`)
            link.setAttribute('aria-current', 'location')
          else link.removeAttribute('aria-current')
        })
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: [0, 0.1, 0.3] },
    )
    ;['about', 'services', 'care', 'charity', 'honors', 'leadership', 'culture', 'message'].forEach(
      (id) => observer.observe(document.getElementById(id)),
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

    const elements = [...document.querySelectorAll('.verbatim-index, .verbatim-article')]
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
