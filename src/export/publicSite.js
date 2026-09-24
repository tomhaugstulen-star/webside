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
  const toggle = event.target.closest('.site-menu-toggle,.site-submenu-toggle')
  if (!toggle) return
  const menu = toggle.nextElementSibling
  const open = toggle.getAttribute('aria-expanded') !== 'true'
  toggle.setAttribute('aria-expanded', String(open))
  if (toggle.classList.contains('site-menu-toggle')) menu.classList.toggle('is-open', open)
  else menu.hidden = !open
})
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  document.querySelectorAll('.site-menu-toggle[aria-expanded="true"],.site-submenu-toggle[aria-expanded="true"]').forEach((button) => {
    button.setAttribute('aria-expanded', 'false')
    if (button.classList.contains('site-menu-toggle')) button.nextElementSibling.classList.remove('is-open')
    else button.nextElementSibling.hidden = true
  })
})
