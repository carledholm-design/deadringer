export function TabBar({ activeTab, onTab }) {
  const tabs = [
    { id: 'home',    icon: 'ph-house',          label: 'Home'    },
    { id: 'convert', icon: 'ph-arrows-left-right', label: 'Convert' },
    { id: 'shows',   icon: 'ph-microphone-stage', label: 'Shows'   },
    { id: 'party',   icon: 'ph-users-three',     label: 'Party'   },
    { id: 'me',      icon: 'ph-user-circle',     label: 'Me'      },
  ]

  const el = document.createElement('nav')
  el.className = 'tab-bar'
  el.setAttribute('role', 'tablist')
  el.setAttribute('aria-label', 'Main navigation')

  function render() {
    el.innerHTML = tabs.map(t => `
      <button
        class="tab ${t.id === activeTab ? 'active' : ''}"
        data-tab="${t.id}"
        role="tab"
        aria-selected="${t.id === activeTab}"
        aria-label="${t.label}"
      >
        <i class="ph ${t.id === activeTab ? t.icon.replace('ph-', 'ph-fill ph-') : t.icon}"></i>
        <span>${t.label}</span>
      </button>
    `).join('')

    el.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab
        render()
        onTab(activeTab)
      })
    })
  }

  render()
  return el
}
