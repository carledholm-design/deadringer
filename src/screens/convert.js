import { MOCK_FIND_RESULT, MOCK_SHARE_RESULT, MOCK_PLAYLIST_RESULT } from '../mock-data.js'

const PLATFORM_INITIALS = {
  spotify:    'S',
  apple:      '♪',
  youtube:    'YT',
  tidal:      'T',
  amazon:     'AM',
  deezer:     'DZ',
  soundcloud: 'SC',
  pandora:    'P',
}

export function ConvertScreen() {
  let mode = 'find'           // 'find' | 'share'
  let type = 'song'           // 'song' | 'playlist' | 'album'
  let resultsState = 'empty'  // 'empty' | 'loading' | 'find' | 'share'

  const el = document.createElement('div')
  el.className = 'screen'

  el.innerHTML = `
    <div class="convert-screen">

      <!-- Mode toggle -->
      <div class="mode-toggle" role="group" aria-label="Mode">
        <div class="mode-toggle__track" id="toggle-track"></div>
        <button class="mode-toggle__btn active" id="btn-find" aria-pressed="true">
          <i class="ph ph-magnifying-glass"></i> Find
        </button>
        <button class="mode-toggle__btn" id="btn-share" aria-pressed="false">
          <i class="ph ph-arrow-up-right"></i> Share
        </button>
      </div>

      <!-- Type selector -->
      <div class="type-selector" role="group" aria-label="Content type">
        <button class="type-btn active" data-type="song" aria-pressed="true">
          <i class="ph ph-music-note"></i> Song
        </button>
        <button class="type-btn" data-type="playlist" aria-pressed="false">
          <i class="ph ph-playlist"></i> Playlist
        </button>
        <button class="type-btn" data-type="album" aria-pressed="false">
          <i class="ph ph-vinyl-record"></i> Album
        </button>
      </div>

      <!-- Inputs -->
      <div class="input-group">
        <div class="input-wrap">
          <i class="ph ph-magnifying-glass input-icon"></i>
          <input
            class="search-input"
            id="search-input"
            type="search"
            placeholder="Search by name…"
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <div class="input-divider"><span>or</span></div>

        <div class="input-wrap">
          <i class="ph ph-link input-icon"></i>
          <input
            class="search-input"
            id="paste-input"
            type="url"
            placeholder="Paste a Spotify, Apple, or YouTube link"
            autocomplete="off"
            spellcheck="false"
          />
        </div>
      </div>

      <!-- CTA -->
      <button class="cta-btn" id="cta-btn">
        <i class="ph ph-magnifying-glass" id="cta-icon"></i>
        <span id="cta-label">Find it</span>
      </button>

      <!-- Results area -->
      <div class="results-area" id="results-area">

        <!-- Empty state (default) -->
        <div class="empty-state visible" id="empty-state">
          <div class="empty-icon"><i class="ph ph-music-notes-plus"></i></div>
          <p class="empty-title" id="empty-title">Find on your platform</p>
          <p class="empty-body" id="empty-body">Search or paste a link. We'll find it on Spotify, Apple Music, and everywhere else.</p>
        </div>

        <!-- Loading state -->
        <div class="loading-state" id="loading-state">
          <div class="spinner"></div>
          <span class="loading-label" id="loading-label">Searching all platforms…</span>
        </div>

        <!-- Find results -->
        <div id="find-results" style="display:none"></div>

        <!-- Share results -->
        <div id="share-results" style="display:none"></div>

      </div>
    </div>
  `

  // ── Wire up ───────────────────────────────────────────────────────────────

  function setMode(newMode) {
    mode = newMode
    const track  = el.querySelector('#toggle-track')
    const btnFind  = el.querySelector('#btn-find')
    const btnShare = el.querySelector('#btn-share')
    const ctaIcon  = el.querySelector('#cta-icon')
    const ctaLabel = el.querySelector('#cta-label')
    const emptyTitle = el.querySelector('#empty-title')
    const emptyBody  = el.querySelector('#empty-body')

    if (mode === 'find') {
      track.classList.remove('share')
      btnFind.classList.add('active')
      btnShare.classList.remove('active')
      btnFind.setAttribute('aria-pressed', 'true')
      btnShare.setAttribute('aria-pressed', 'false')
      ctaIcon.className = 'ph ph-magnifying-glass'
      ctaLabel.textContent = 'Find it'
      emptyTitle.textContent = 'Find on your platform'
      emptyBody.textContent = 'Search or paste a link. We\'ll find it on Spotify, Apple Music, and everywhere else.'
    } else {
      track.classList.add('share')
      btnShare.classList.add('active')
      btnFind.classList.remove('active')
      btnShare.setAttribute('aria-pressed', 'true')
      btnFind.setAttribute('aria-pressed', 'false')
      ctaIcon.className = 'ph ph-arrow-up-right'
      ctaLabel.textContent = 'Share it'
      emptyTitle.textContent = 'Share to any platform'
      emptyBody.textContent = 'You\'ll get one link. Your friends open it in whatever app they use.'
    }
    showState('empty')
  }

  function setType(newType) {
    type = newType
    el.querySelectorAll('.type-btn').forEach(btn => {
      const active = btn.dataset.type === type
      btn.classList.toggle('active', active)
      btn.setAttribute('aria-pressed', String(active))
    })
  }

  function showState(state) {
    resultsState = state
    el.querySelector('#empty-state').classList.toggle('visible', false)
    el.querySelector('#loading-state').classList.toggle('visible', false)
    el.querySelector('#find-results').style.display = 'none'
    el.querySelector('#share-results').style.display = 'none'

    if (state === 'empty') {
      setTimeout(() => el.querySelector('#empty-state').classList.add('visible'), 10)
    } else if (state === 'loading') {
      el.querySelector('#loading-state').classList.add('visible')
      const label = el.querySelector('#loading-label')
      label.textContent = mode === 'find' ? 'Searching all platforms…' : 'Generating your link…'
    } else if (state === 'find') {
      el.querySelector('#find-results').style.display = 'block'
    } else if (state === 'share') {
      el.querySelector('#share-results').style.display = 'block'
    }
  }

  function buildFindResults(data) {
    const wrap = el.querySelector('#find-results')
    wrap.innerHTML = `
      <p class="results-label">Found on</p>
      ${trackMetaHTML(data)}
      <div class="platform-list">
        ${data.platforms.map(p => platformRowHTML(p)).join('')}
      </div>
    `
    // Copy-to-platform click
    wrap.querySelectorAll('.platform-row[data-available="true"]').forEach(row => {
      row.addEventListener('click', () => {
        // In v1 this opens the deep link — mocked for now
      })
    })
  }

  function buildShareResults(data) {
    const wrap = el.querySelector('#share-results')
    const missingHTML = data.missing.length
      ? `<div class="missing-warning">
           <i class="ph ph-warning"></i>
           <span>${data.missing.length} song${data.missing.length > 1 ? 's' : ''} not available everywhere: ${data.missing.join(', ')}</span>
         </div>`
      : ''

    wrap.innerHTML = `
      <p class="results-label">Your link</p>
      ${trackMetaHTML(data)}
      <div class="share-result">
        <div class="share-link-row">
          <span class="share-link-text">${data.shareUrl}</span>
          <button class="copy-btn" id="copy-btn">Copy</button>
        </div>
        <div class="confidence-row">
          <div class="confidence-bar-wrap">
            <div class="confidence-bar-fill" style="width:0%" data-target="${data.confidence}"></div>
          </div>
          <span class="confidence-label">${data.confidence}% match</span>
          <span class="confidence-detail">${data.matched} songs</span>
        </div>
        ${missingHTML}
        <div class="qr-row">
          <div class="qr-box"><i class="ph ph-qr-code"></i></div>
          <div class="qr-copy-col">
            <p>Anyone scans this — opens in their app automatically.</p>
            <button class="share-btn">
              <i class="ph ph-export"></i> Share sheet
            </button>
          </div>
        </div>
      </div>
    `

    // Animate confidence bar
    requestAnimationFrame(() => {
      setTimeout(() => {
        const bar = wrap.querySelector('.confidence-bar-fill')
        if (bar) bar.style.width = bar.dataset.target + '%'
      }, 100)
    })

    // Copy button
    const copyBtn = wrap.querySelector('#copy-btn')
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText('https://' + data.shareUrl).catch(() => {})
      copyBtn.textContent = 'Copied!'
      copyBtn.classList.add('copied')
      setTimeout(() => {
        copyBtn.textContent = 'Copy'
        copyBtn.classList.remove('copied')
      }, 2000)
    })
  }

  function trackMetaHTML(data) {
    return `
      <div class="track-meta">
        <div class="track-art" style="background:${data.artColor}">
          <i class="ph ph-music-note"></i>
        </div>
        <div class="track-info">
          <p class="track-title">${data.title}</p>
          <p class="track-subtitle">${data.subtitle}</p>
        </div>
      </div>
    `
  }

  function platformRowHTML(p) {
    const initials = PLATFORM_INITIALS[p.id] || p.name.slice(0, 2)
    return `
      <div class="platform-row ${p.detected ? 'detected' : ''} ${!p.available ? 'unavailable' : ''}"
           data-available="${p.available}"
           role="button"
           tabindex="${p.available ? 0 : -1}">
        <div class="platform-dot" style="background:${p.color}"></div>
        <div class="platform-logo" style="background:${p.available ? p.color : '#333340'}">
          ${initials}
        </div>
        <span class="platform-name" style="color:${!p.available ? 'var(--text-3)' : ''}">${p.name}</span>
        ${p.detected ? '<span class="platform-badge">Your app</span>' : ''}
        ${!p.available ? '<span style="font-size:var(--text-xs);color:var(--text-3)">Not available</span>' : ''}
        ${p.available ? '<i class="ph ph-arrow-right platform-action"></i>' : ''}
      </div>
    `
  }

  function runSearch() {
    const search = el.querySelector('#search-input').value.trim()
    const paste  = el.querySelector('#paste-input').value.trim()
    if (!search && !paste) return

    showState('loading')

    setTimeout(() => {
      if (mode === 'find') {
        buildFindResults(MOCK_FIND_RESULT)
        showState('find')
      } else {
        const mockData = type === 'playlist'
          ? MOCK_PLAYLIST_RESULT
          : MOCK_SHARE_RESULT
        buildShareResults(mockData)
        showState('share')
      }
    }, 1200)
  }

  // ── Event binding ─────────────────────────────────────────────────────────
  el.querySelector('#btn-find').addEventListener('click', () => setMode('find'))
  el.querySelector('#btn-share').addEventListener('click', () => setMode('share'))

  el.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => setType(btn.dataset.type))
  })

  el.querySelector('#cta-btn').addEventListener('click', runSearch)

  el.querySelector('#search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch()
  })

  el.querySelector('#paste-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch()
  })

  // Trigger on paste
  el.querySelector('#paste-input').addEventListener('paste', () => {
    setTimeout(runSearch, 50)
  })

  return el
}
