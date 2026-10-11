// ============================================================
// ROUTER
// ============================================================
function parseRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [pth, qstr] = hash.split('?');
    const qp = new URLSearchParams(qstr || '');
    const s = pth.split('/').filter(Boolean);
    let page = 'home', rp = {};

    if (!s.length) page = 'home';
    else if (s[0] === 'search') { page = 'search'; rp.query = qp.get('q') || ''; }
    else if (s[0] === 'movie' && s.length >= 2) {
        page = 'movieDetail';
        const idMatch = s[1].match(/^(\d+)/);
        rp.id = idMatch ? idMatch[1] : s[1];
        rp.slug = s[1];
    }
    else if (s[0] === 'tv' && s.length >= 2) {
        page = 'tvDetail';
        const idMatch = s[1].match(/^(\d+)/);
        rp.id = idMatch ? idMatch[1] : s[1];
        rp.slug = s[1];
    }
    else if (s[0] === 'watch' && s[1] === 'movie' && s.length >= 3) {
        page = 'watchMovie';
        const idMatch = s[2].match(/^(\d+)/);
        rp.id = idMatch ? idMatch[1] : s[2];
        rp.slug = s[2];
    }
    else if (s[0] === 'watch' && s[1] === 'tv' && s.length >= 5) {
        page = 'watchTV';
        const idMatch = s[2].match(/^(\d+)/);
        rp.id = idMatch ? idMatch[1] : s[2];
        rp.slug = s[2];
        rp.season = s[3];
        rp.episode = s[4];
    }
    else if (s[0] === 'favorites') page = 'favorites';
    else if (s[0] === 'genres') page = 'genres';
    else if (s[0] === 'genre' && s.length === 3) { page = 'genreDetail'; rp.type = s[1]; rp.id = s[2]; }
    else if (s[0] === 'movies') page = 'movies';
    else if (s[0] === 'tvshows') page = 'tvShows';

    return { page, params: rp, query: qp };
}

function useRouter() {
    const [route, setRoute] = useState(parseRoute);
    useEffect(() => {
        const h = () => setRoute(parseRoute());
        window.addEventListener('hashchange', h);
        return () => window.removeEventListener('hashchange', h);
    }, []);
    const nav = useCallback((p) => { window.location.hash = p; }, []);
    return { ...route, navigate: nav };
}

// ============================================================
// DATA FETCHING HOOK
// ============================================================
function useFetch(fn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true); setError(null); setData(null);
        fn()
            .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
            .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });
        return () => { cancelled = true; };
    }, [...deps, retryCount]);

    const retry = useCallback(() => setRetryCount(c => c + 1), []);
    return { data, loading, error, retry };
}

// ============================================================
// SCROLL TO TOP
// ============================================================
function ScrollToTop() {
    const { page } = useRouter();
    useEffect(() => { window.scrollTo(0, 0); }, [page]);
    return null;
}

// ============================================================
// APP
// ============================================================
function App() {
    const { page } = useRouter();
    const renderPage = () => {
        switch (page) {
            case 'home': return html`<${HomePage}/>`;
            case 'search': return html`<${SearchPage}/>`;
            case 'movieDetail': return html`<${MovieDetailPage}/>`;
            case 'tvDetail': return html`<${TVDetailPage}/>`;
            case 'watchMovie': return html`<${WatchMoviePage}/>`;
            case 'watchTV': return html`<${WatchTVPage}/>`;
            case 'favorites': return html`<${FavoritesPage}/>`;
            case 'genres': return html`<${GenresPage}/>`;
            case 'genreDetail': return html`<${GenreDetailPage}/>`;
            case 'movies': return html`<${MoviesPage}/>`;
            case 'tvShows': return html`<${TVShowsPage}/>`;
            default: return html`<${NotFoundPage}/>`;
        }
    };
    return html`<${ToastProvider}>
        <${AppProvider}>
            <${ScrollToTop}/>
            <div className="min-h-screen bg-bg text-txt font-body">
                <${Navbar}/>
                <main>${renderPage()}</main>
                <${Footer}/>
            </div>
        <//>
    <//>`;
}

// ============================================================
// MOUNT
// ============================================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(html`<${App}/>`);