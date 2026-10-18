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

const AD_CONFIG = {
    providerUrl: 'https://a.magsrv.com/ad-provider.js',
    zoneId: '5688184',
    insClass: 'eas6a97888e10',
    width: 300,
    height: 100,
    autoCloseMs: 0,  // ← 0 = never auto-close, or set to 30000 for 30s
};

// ============================================================
// SITE ADS CONFIG (For main pages)
// ============================================================
const SITE_ADS = {
    desktop: {
        key: '46c115587562e876a39fd0c0a600ee66',
        src: 'https://bancadeltempoidea.org/22/46c115587562e876a39fd0c0a600ee66',
        width: 728,
        height: 90,
        format: 'iframe'
    },
    mobile: {
        key: 'ae520275bc841c0df62a9b581a262572',
        src: 'https://bancadeltempoidea.org/22/ae520275bc841c0df62a9b581a262572',
        width: 320,
        height: 50,
        format: 'iframe'
    }
};