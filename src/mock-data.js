export const MOCK_FIND_RESULT = {
  title: 'Black',
  subtitle: 'Pearl Jam · Ten (1991)',
  artColor: 'linear-gradient(135deg, #2c1654, #7F77DD)',
  platforms: [
    { id: 'spotify',    name: 'Spotify',     color: '#1DB954', detected: true,  available: true  },
    { id: 'apple',      name: 'Apple Music', color: '#FC3C44', detected: false, available: true  },
    { id: 'youtube',    name: 'YouTube Music',color: '#FF0000', detected: false, available: true  },
    { id: 'tidal',      name: 'Tidal',       color: '#00CDCD', detected: false, available: true  },
    { id: 'amazon',     name: 'Amazon Music',color: '#00A8E1', detected: false, available: true  },
    { id: 'deezer',     name: 'Deezer',      color: '#A238FF', detected: false, available: true  },
    { id: 'soundcloud', name: 'SoundCloud',  color: '#FF5500', detected: false, available: false },
    { id: 'pandora',    name: 'Pandora',     color: '#3668FF', detected: false, available: false },
  ],
}

export const MOCK_SHARE_RESULT = {
  title: 'Vs. — Pearl Jam',
  subtitle: 'Album · 12 songs',
  artColor: 'linear-gradient(135deg, #1a0a3c, #534AB7)',
  shareUrl: 'deadringer.app/s/pj-vs-94k2',
  confidence: 95,
  matched: '11/12',
  missing: ['Rats'],
}

export const MOCK_PLAYLIST_RESULT = {
  title: 'Grunge Essentials',
  subtitle: 'Playlist · 40 songs',
  artColor: 'linear-gradient(135deg, #0e1a2c, #3668FF)',
  shareUrl: 'deadringer.app/s/grunge-3xq7',
  confidence: 88,
  matched: '35/40',
  missing: ['Dirt', 'Down in a Hole', 'Would?', 'Them Bones', 'Rooster'],
}
