// ============================================================
// TMDB API CONFIG
// ============================================================
const TMDB_KEY = 'a4cb84b760ef3fe3106dea86641cd8ba';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

// ============================================================
// STREAMING SERVERS
// ============================================================
// Sandbox rules (applied to both servers):
//   ✅ allow-scripts        → player needs JavaScript
//   ✅ allow-same-origin    → player needs its own cookies/storage
//   ✅ allow-forms          → some players submit hidden forms
//   ✅ allow-presentation   → Chromecast/AirPlay
//   ❌ allow-popups         → BLOCKED (no popup ads)
//   ❌ allow-top-navigation → BLOCKED (no site hijacking)
//   ❌ allow-modals         → BLOCKED (no alert/confirm)
//   ❌ allow-downloads      → BLOCKED (no forced downloads)
// ============================================================
const IFRAME_SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-presentation';

const SERVERS = {
    'pro': {
        name: 'PRO',
        movie: (id) => `https://web.nxsha.app/embed/movie/${id}/`,
        tv: (id, s, e) => `https://web.nxsha.app/embed/tv/${id}/${s}/${e}/`,
        sandbox: IFRAME_SANDBOX
    },
    'pro2': {
        name: 'PRO 2',
        movie: (id) => `https://cinesrc.st/embed/movie/${id}`,
        tv: (id, season, episode) => `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}`,
        sandbox: IFRAME_SANDBOX
    }
};

const DEFAULT_SERVER = 'pro';
const SERVER_KEYS = Object.keys(SERVERS);

function getMovieEmbedUrl(id, serverKey = DEFAULT_SERVER) {
    const server = SERVERS[serverKey] || SERVERS[DEFAULT_SERVER];
    return server.movie(id);
}

function getTVEmbedUrl(id, s, e, serverKey = DEFAULT_SERVER) {
    const server = SERVERS[serverKey] || SERVERS[DEFAULT_SERVER];
    return server.tv(id, s, e);
}

// ============================================================
// AD CONFIG
// ============================================================
const AD_CONFIG = {
    key: 'b37da1bcd9178d24489b639caf7cfdb7',
    width: 320,
    height: 50,
    format: 'iframe',
    src: 'https://biomanos.org/22/b37da1bcd9178d24489b639caf7cfdb7',
    // How long before the ad auto-closes (ms). Set 0 for no auto-close.
    autoCloseMs: 0,
};