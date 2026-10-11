// ============================================================
// TMDB API CONFIG
// ============================================================
const TMDB_KEY = 'a4cb84b760ef3fe3106dea86641cd8ba';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/';

// ============================================================
// STREAMING SERVERS
// ============================================================
const SERVERS = {
    'vidsrc': {
        name: 'VidSrcWIKI',
        movie: (id) => `https://v1.vidsrc.wiki/embed/movie/${id}/`,
        tv: (id, s, e) => `https://v1.vidsrc.wiki/embed/tv/${id}/${s}/${e}/`
    },
    'pro': {
        name: 'PRO',
        movie: (id) => `https://web.nxsha.app/embed/movie/${id}/`,
        tv: (id, s, e) => `https://web.nxsha.app/embed/tv/${id}/${s}/${e}/`
    }
};

const DEFAULT_SERVER = 'vidsrc';
const SERVER_KEYS = Object.keys(SERVERS);

function getMovieEmbedUrl(id, serverKey = DEFAULT_SERVER) {
    const server = SERVERS[serverKey] || SERVERS[DEFAULT_SERVER];
    return server.movie(id);
}

function getTVEmbedUrl(id, s, e, serverKey = DEFAULT_SERVER) {
    const server = SERVERS[serverKey] || SERVERS[DEFAULT_SERVER];
    return server.tv(id, s, e);
}