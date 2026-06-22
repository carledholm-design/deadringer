import { iconHTML } from '../components/icons.js'
import { MOCK_FIND, MOCK_SHARE_SONG, MOCK_SHARE_PLAYLIST, MOCK_SHARE_ALBUM } from '../mock-data.js'

export function ConvertScreen() {
  let mode = 'find'
  let type = 'song'

  const el = document.createElement('div')
  el.className = 'screen'

  // ── Render ────────────────────────────────────────────────────────────────

  function render() {
    const isFind = mode === 'find'
    el.innerHTML = `
      <div class="convert-screen">

        <div class="mode-toggle">
          <div class="toggle-track ${mode === 'share' ? 'share' : ''}"></div>
          <button class="toggle-btn ${isFind ? 'active' : ''}" data-mode="find">
            ${iconHTML('search', 14)} Find
          </button>
          <button class="toggle-btn ${!isFind ? 'active' : ''}" data-mode="share">
            ${iconHTML('arrow-up-right', 14)} Share
          </button>
        </div>

        <div class="type-selector">
          ${['song','playlist','album'].map(t => `
            <button class="type-btn ${type === t ? 'active' : ''}" data-type="${t}">
              ${iconHTML(t === 'song' ? 'music-note' : t === 'playlist' ? 'playlist' : 'vinyl', 13)}
              ${t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          `).join('')}
        </div>

        <div class="input-stack">
          <div class="input-row">
            ${iconHTML('search', 18)}
            <input id="search-input" type="search" placeholder="Search by name…" autocomplete="off" spellcheck="false" />
          </div>
          <div class="or-divider">or</div>
          <div class="input-row">
            ${iconHTML('link', 18)}
            <input id="paste-input" type="url" placeholder="Paste a Spotify, Apple, or YouTube link" autocomplete="off" spellcheck="false" />
          </div>
        </div>

        <button class="cta-btn" id="cta-btn">
          ${iconHTML(isFind ? 'search' : 'arrow-up-right', 18)}
          ${isFind ? 'Find it' : 'Share it'}
        </button>

        <div class="results" id="results">
          <div class="empty-state" id="empty-state">
            <div class="empty-icon">${iconHTML('music-notes', 32)}</div>
            <p class="empty-title" id="empty-title">${isFind ? 'Find on your platform' : 'Share to any platform'}</p>
            <p class="empty-body">${isFind
              ? "Search or paste a link. We'll find it on Spotify, Apple Music, and everywhere else."
              : "You'll get one link. Your friends open it in whatever app they use."
            }</p>
          </div>
          <div class="loading-state" id="loading-state">
            <div class="spinner"></div>
            <span class="loading-label">${isFind ? 'Searching all platforms…' : 'Generating your link…'}</span>
          </div>
          <div id="result-content"></div>
        </div>

      </div>
    `

    // Animate empty state in
    requestAnimationFrame(() => {
      el.querySelector('#empty-state')?.classList.add('show')
    })

    bindEvents()
  }

  // ── Events ────────────────────────────────────────────────────────────────

  function bindEvents() {
    el.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => { mode = btn.dataset.mode; render() })
    })

    el.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => { type = btn.dataset.type; render() })
    })

    el.querySelector('#cta-btn').addEventListener('click', runSearch)
    el.querySelector('#search-input').addEventListener('keydown', e => e.key === 'Enter' && runSearch())
    el.querySelector('#paste-input').addEventListener('keydown', e => e.key === 'Enter' && runSearch())
    el.querySelector('#paste-input').addEventListener('paste', () => setTimeout(runSearch, 50))
  }

  // ── Search flow ───────────────────────────────────────────────────────────

  function runSearch() {
    const q = el.querySelector('#search-input').value.trim()
    const p = el.querySelector('#paste-input').value.trim()
    if (!q && !p) return

    showLoading()

    setTimeout(() => {
      if (mode === 'find') {
        showFindResult(MOCK_FIND)
      } else {
        const data = type === 'playlist' ? MOCK_SHARE_PLAYLIST
                   : type === 'album'    ? MOCK_SHARE_ALBUM
                   : MOCK_SHARE_SONG
        showShareResult(data)
      }
    }, 1200)
  }

  function showLoading() {
    el.querySelector('#empty-state').classList.remove('show')
    el.querySelector('#loading-state').classList.add('show')
    el.querySelector('#result-content').innerHTML = ''
  }

  function showFindResult(data) {
    el.querySelector('#loading-state').classList.remove('show')
    const content = el.querySelector('#result-content')
    content.innerHTML = `
      <p class="results-label">Found on</p>
      ${trackCardHTML(data)}
      <div class="platform-list">
        ${data.platforms.map(p => platformRowHTML(p)).join('')}
      </div>
    `
  }

  function showShareResult(data) {
    el.querySelector('#loading-state').classList.remove('show')
    const content = el.querySelector('#result-content')
    content.innerHTML = `
      <p class="results-label">Your link</p>
      ${trackCardHTML(data)}
      <div class="share-card">
        <div class="share-link-row">
          <span class="share-link-text">${data.url}</span>
          <button class="copy-btn" id="copy-btn">Copy</button>
        </div>
        <div class="confidence-row">
          <div class="conf-bar-wrap"><div class="conf-bar-fill" data-target="${data.confidence}"></div></div>
          <span class="conf-pct">${data.confidence}%</span>
          <span class="conf-detail">${data.matched} songs</span>
        </div>
        ${data.missing.length ? `
          <div class="missing-row">
            ${iconHTML('warning', 14)}
            <span>${data.missing.length} song${data.missing.length > 1 ? 's' : ''} not everywhere: ${data.missing.join(', ')}</span>
          </div>` : ''}
        <div class="qr-row">
          <div class="qr-box">${iconHTML('qr-code', 40)}</div>
          <div class="qr-copy">
            <p>Anyone scans this — opens in their app automatically.</p>
            <button class="share-sheet-btn">${iconHTML('export', 15)} Share sheet</button>
          </div>
        </div>
      </div>
    `

    // Animate confidence bar
    requestAnimationFrame(() => setTimeout(() => {
      const bar = content.querySelector('.conf-bar-fill')
      if (bar) bar.style.width = bar.dataset.target + '%'
    }, 80))

    // Copy button
    content.querySelector('#copy-btn').addEventListener('click', e => {
      const btn = e.currentTarget
      navigator.clipboard?.writeText('https://' + data.url).catch(() => {})
      btn.textContent = 'Copied!'
      btn.classList.add('copied')
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied') }, 2000)
    })
  }

  // ── HTML helpers ──────────────────────────────────────────────────────────

  function trackCardHTML(data) {
    return `
      <div class="track-card">
        <div class="track-art" style="background:${data.artColor}">
          ${iconHTML('music-note', 28)}
        </div>
        <div class="track-info">
          <p class="track-title">${data.title}</p>
          <p class="track-sub">${data.subtitle}</p>
        </div>
      </div>
    `
  }

  function platformRowHTML(p) {
    const logoColor = p.available ? p.color : '#333340'
    return `
      <div class="platform-row ${p.detected ? 'detected' : ''} ${!p.available ? 'unavailable' : ''}">
        <div class="platform-dot" style="background:${p.color}"></div>
        <div class="platform-logo" style="background:${logoColor}">${p.abbr}</div>
        <span class="platform-name">${p.name}</span>
        ${p.detected ? '<span class="platform-badge">Your app</span>' : ''}
        ${!p.available ? '<span class="platform-unavail">Not available</span>' : ''}
        ${p.available ? `<span class="platform-arrow">${iconHTML('arrow-right', 16)}</span>` : ''}
      </div>
    `
  }

  render()
  return el
}
