import { TabBar } from './components/tab-bar.js'
import { ConvertScreen } from './screens/convert.js'

function placeholderScreen(label, icon) {
  const el = document.createElement('div')
  el.className = 'screen'
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;opacity:0.3;'
  el.innerHTML = `<i class="ph ${icon}" style="font-size:48px;color:var(--violet)"></i>
                  <p style="font-size:17px;font-weight:600;color:var(--text-2)">${label}</p>
                  <p style="font-size:13px;color:var(--text-3)">Coming soon</p>`
  return el
}

const SCREENS = {
  home:    () => placeholderScreen('Home', 'ph-house'),
  convert: () => ConvertScreen(),
  shows:   () => placeholderScreen('Shows', 'ph-microphone-stage'),
  party:   () => placeholderScreen('Party', 'ph-users-three'),
  me:      () => placeholderScreen('Me', 'ph-user-circle'),
}

const SCREEN_TITLES = {
  home:    'deadringer',
  convert: 'deadringer',
  shows:   'Shows',
  party:   'Party',
  me:      'Me',
}

function App() {
  let activeTab = 'convert'
  let screenEl = null

  const root = document.getElementById('app')

  // Header
  const header = document.createElement('header')
  header.className = 'screen-header'
  header.innerHTML = `
    <span class="wordmark" id="header-wordmark">deadringer</span>
    <button style="background:none;border:none;color:var(--text-3);cursor:pointer;padding:4px;" aria-label="Settings">
      <i class="ph ph-gear" style="font-size:22px;"></i>
    </button>
  `

  // Screen mount
  const screenMount = document.createElement('div')
  screenMount.style.cssText = 'display:contents'

  // Tab bar
  const tabBar = TabBar({
    activeTab,
    onTab(tab) {
      activeTab = tab
      mountScreen(tab)
      const wordmark = header.querySelector('#header-wordmark')
      wordmark.textContent = SCREEN_TITLES[tab] || tab
    }
  })

  function mountScreen(tab) {
    if (screenEl) screenEl.remove()
    screenEl = SCREENS[tab]()
    root.insertBefore(screenEl, tabBar)
  }

  root.appendChild(header)
  root.appendChild(tabBar)
  mountScreen(activeTab)
}

App()
