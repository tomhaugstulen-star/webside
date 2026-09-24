const page = document.querySelector('.site-page')
function fitNarrowScreen() {
  if (!page) return
  const narrow = window.innerWidth < 390
  page.style.width = narrow ? '390px' : ''
  page.style.zoom = narrow ? String(window.innerWidth / 390) : ''
}
fitNarrowScreen()
window.addEventListener('resize', fitNarrowScreen)

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
