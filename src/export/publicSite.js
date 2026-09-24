const page = document.querySelector('.site-page')
function fitPageToViewport() {
  if (!page) return
  const viewport = document.documentElement.clientWidth || window.innerWidth
  const mobile = viewport < 768
  const baseWidth = mobile ? 390 : 1320
  const scale = Math.min(1, viewport / baseWidth)
  page.style.width = scale < 1 ? `${baseWidth}px` : ''
  page.style.maxWidth = scale < 1 ? 'none' : ''
  page.style.zoom = scale < 1 ? String(scale) : ''
}
fitPageToViewport()
window.addEventListener('resize', fitPageToViewport)

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('.site-menu-toggle,.site-submenu-toggle,.site-button-menu-toggle')
  if (!toggle) return
  const menu = toggle.nextElementSibling
  const open = toggle.getAttribute('aria-expanded') !== 'true'
  document.querySelectorAll('.site-button-menu-toggle[aria-expanded="true"]').forEach((button) => {
    if (button !== toggle) { button.setAttribute('aria-expanded', 'false'); button.nextElementSibling.hidden = true }
  })
  toggle.setAttribute('aria-expanded', String(open))
  if (toggle.classList.contains('site-menu-toggle')) menu.classList.toggle('is-open', open)
  else menu.hidden = !open
})
document.addEventListener('click', (event) => {
  if (event.target.closest('.site-button')) return
  document.querySelectorAll('.site-button-menu-toggle[aria-expanded="true"]').forEach((button) => {
    button.setAttribute('aria-expanded', 'false')
    button.nextElementSibling.hidden = true
  })
})
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  document.querySelectorAll('.site-menu-toggle[aria-expanded="true"],.site-submenu-toggle[aria-expanded="true"],.site-button-menu-toggle[aria-expanded="true"]').forEach((button) => {
    button.setAttribute('aria-expanded', 'false')
    if (button.classList.contains('site-menu-toggle')) button.nextElementSibling.classList.remove('is-open')
    else button.nextElementSibling.hidden = true
  })
})
