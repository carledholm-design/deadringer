import { iconHTML } from './icons.js'

const TABS = [
  { id:'home',    label:'Home',    icon:'home-outline',  iconActive:'home'         },
  { id:'convert', label:'Convert', icon:'convert',       iconActive:'convert'      },
  { id:'shows',   label:'Shows',   icon:'shows-outline', iconActive:'shows'        },
  { id:'party',   label:'Party',   icon:'party-outline', iconActive:'party'        },
  { id:'me',      label:'Me',      icon:'me-outline',    iconActive:'me'           },
]

export function TabBar({ active, onTab }) {
  const el = document.createElement('nav')
  el.className = 'tab-bar'

  function render() {
    el.innerHTML = TABS.map(t => `
      <button class="tab ${t.id === active ? 'active' : ''}" data-id="${t.id}">
        ${iconHTML(t.id === active ? t.iconActive : t.icon, 24)}
        <span class="tab-label">${t.label}</span>
      </button>
    `).join('')

    el.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        active = btn.dataset.id
        render()
        onTab(active)
      })
    })
  }

  render()
  return el
}
