// ============================================================
// TMDB API SERVICE
// ============================================================
const tmdb = {
    async fetch(ep, p = {}) {
        const u = new URL(`${TMDB_BASE}${ep}`);
        u.searchParams.set('api_key', TMDB_KEY);
        Object.entries(p).forEach(([k, v]) => {
            if (v !== undefined && v !== null) u.searchParams.set(k, v);
        });
        const r = await fetch(u);
        if (!r.ok) throw new Error(`TMDB ${r.status}`);
        return r.json();
    },
    trendingMovie: (pg = 1) => tmdb.fetch('/trending/movie/week', { page: pg }),
    trendingTV: (pg = 1) => tmdb.fetch('/trending/tv/week', { page: pg }),
    popularMovie: (pg = 1) => tmdb.fetch('/movie/popular', { page: pg }),
    popularTV: (pg = 1) => tmdb.fetch('/tv/popular', { page: pg }),
    topRatedMovie: (pg = 1) => tmdb.fetch('/movie/top_rated', { page: pg }),
    topRatedTV: (pg = 1) => tmdb.fetch('/tv/top_rated', { page: pg }),
    upcomingMovie: (pg = 1) => tmdb.fetch('/movie/upcoming', { page: pg }),
    nowPlayingMovie: (pg = 1) => tmdb.fetch('/movie/now_playing', { page: pg }),
    onTheAirTV: (pg = 1) => tmdb.fetch('/tv/on_the_air', { page: pg }),
    movieDetails: (id) => tmdb.fetch(`/movie/${id}`, { append_to_response: 'credits,videos,similar,recommendations' }),
    tvDetails: (id) => tmdb.fetch(`/tv/${id}`, { append_to_response: 'credits,videos,similar,recommendations' }),
    seasonDetails: (tvId, s) => tmdb.fetch(`/tv/${tvId}/season/${s}`),
    searchMulti: (q, pg = 1) => tmdb.fetch('/search/multi', { query: q, page: pg }),
    searchMovie: (q, pg = 1) => tmdb.fetch('/search/movie', { query: q, page: pg }),
    searchTV: (q, pg = 1) => tmdb.fetch('/search/tv', { query: q, page: pg }),
    movieGenres: () => tmdb.fetch('/genre/movie/list'),
    tvGenres: () => tmdb.fetch('/genre/tv/list'),
    discoverMovie: (p = {}) => tmdb.fetch('/discover/movie', p),
    discoverTV: (p = {}) => tmdb.fetch('/discover/tv', p),
};