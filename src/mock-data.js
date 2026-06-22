export const MOCK_FIND = {
  title: 'Black',
  subtitle: 'Pearl Jam · Ten (1991)',
  artColor: 'linear-gradient(135deg,#2c1654,#7F77DD)',
  platforms: [
    { id:'spotify',    name:'Spotify',      abbr:'S',   color:'#1DB954', detected:true,  available:true  },
    { id:'apple',      name:'Apple Music',  abbr:'♪',   color:'#FC3C44', detected:false, available:true  },
    { id:'youtube',    name:'YouTube Music',abbr:'YT',  color:'#FF0000', detected:false, available:true  },
    { id:'tidal',      name:'Tidal',        abbr:'T',   color:'#00CDCD', detected:false, available:true  },
    { id:'amazon',     name:'Amazon Music', abbr:'AM',  color:'#00A8E1', detected:false, available:true  },
    { id:'deezer',     name:'Deezer',       abbr:'DZ',  color:'#A238FF', detected:false, available:true  },
    { id:'soundcloud', name:'SoundCloud',   abbr:'SC',  color:'#FF5500', detected:false, available:false },
    { id:'pandora',    name:'Pandora',      abbr:'P',   color:'#3668FF', detected:false, available:false },
  ]
}

export const MOCK_SHARE_SONG = {
  title: 'Black',
  subtitle: 'Pearl Jam · Ten (1991)',
  artColor: 'linear-gradient(135deg,#2c1654,#7F77DD)',
  url: 'deadringer.app/s/black-pj-94k2',
  confidence: 95,
  matched: '1/1',
  missing: [],
}

export const MOCK_SHARE_PLAYLIST = {
  title: 'Grunge Essentials',
  subtitle: 'Playlist · 40 songs',
  artColor: 'linear-gradient(135deg,#0e1a2c,#3668FF)',
  url: 'deadringer.app/s/grunge-3xq7',
  confidence: 88,
  matched: '35/40',
  missing: ['Dirt','Down in a Hole','Would?','Them Bones','Rooster'],
}

export const MOCK_SHARE_ALBUM = {
  title: 'Vs.',
  subtitle: 'Pearl Jam · Album · 12 songs',
  artColor: 'linear-gradient(135deg,#1a0a3c,#534AB7)',
  url: 'deadringer.app/s/pj-vs-94k2',
  confidence: 92,
  matched: '11/12',
  missing: ['Rats'],
}
