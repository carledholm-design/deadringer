import './styles/tokens.css'
import './styles/app.css'
import './styles/convert.css'
import { iconHTML } from './components/icons.js'
import { TabBar } from './components/tab-bar.js'
import { ConvertScreen } from './screens/convert.js'

function placeholder(label) {
  const el = document.createElement('div')
  el.className = 'screen'
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;'
  el.innerHTML = `<p style="font-size:17px;font-weight:600;color:var(--text-3)">${label}</p>
                  <p style="font-size:13px;color:var(--text-3)">Coming soon</p>`
  return el
}

const SCREENS = {
  home:    () => placeholder('Home'),
  convert: () => ConvertScreen(),
  shows:   () => placeholder('Shows'),
  party:   () => placeholder('Party'),
  me:      () => placeholder('Me'),
}

let activeTab = 'convert'
let screenEl = null

const root = document.getElementById('app')

// Header
const header = document.createElement('header')
header.className = 'app-header'
header.innerHTML = `
  <span class="wordmark">deadringer</span>
  <button class="header-gear" aria-label="Settings">${iconHTML('gear', 22)}</button>
`

// Tab bar
const tabBar = TabBar({
  active: activeTab,
  onTab(id) {
    activeTab = id
    mountScreen(id)
  }
})

function mountScreen(id) {
  if (screenEl) screenEl.remove()
  screenEl = SCREENS[id]()
  root.insertBefore(screenEl, tabBar)
}

root.appendChild(header)
root.appendChild(tabBar)
mountScreen(activeTab)
