// ============================================================
// ROUTER — Clean URLs (History API, no #)
// ============================================================
function parseRoute() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const [pth, qstr] = path.split('?');
    const qp = new URLSearchParams(qstr || window.location.search);
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
    // ============ EMBED ROUTES (for third-party iframes) ============
    else if (s[0] === 'embed' && s[1] === 'movie' && s.length >= 3) {
        page = 'embedMovie';
        const idMatch = s[2].match(/^(\d+)/);
        rp.id = idMatch ? idMatch[1] : s[2];
        rp.server = qp.get('server') || null;
    }
    else if (s[0] === 'embed' && s[1] === 'tv' && s.length >= 5) {
        page = 'embedTV';
        const idMatch = s[2].match(/^(\d+)/);
        rp.id = idMatch ? idMatch[1] : s[2];
        rp.season = s[3];
        rp.episode = s[4];
        rp.server = qp.get('server') || null;
    }
    // ================================================================
    else if (s[0] === 'favorites') page = 'favorites';
    else if (s[0] === 'genres') page = 'genres';
    else if (s[0] === 'genre' && s.length === 3) { page = 'genreDetail'; rp.type = s[1]; rp.id = s[2]; }
    else if (s[0] === 'movies') page = 'movies';
    else if (s[0] === 'tvshows') page = 'tvShows';
    else page = 'notFound';

    return { page, params: rp, query: qp };
}

function useRouter() {
    const [route, setRoute] = useState(parseRoute);

    useEffect(() => {
        const handlePop = () => setRoute(parseRoute());
        window.addEventListener('popstate', handlePop);
        window.addEventListener('app:navigate', handlePop);
        return () => {
            window.removeEventListener('popstate', handlePop);
            window.removeEventListener('app:navigate', handlePop);
        };
    }, []);

    const nav = useCallback((p) => {
        let target = p;
        if (target.startsWith('#/')) target = target.slice(1);
        if (target.startsWith('#')) target = target.slice(1);
        if (!target.startsWith('/')) target = '/' + target;

        const current = window.location.pathname + window.location.search;
        if (current === target) return;

        window.history.pushState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }, []);

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
        Promise.resolve(fn())
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

    // Embed pages render WITHOUT navbar/footer (for third-party sites)
    if (page === 'embedMovie') return html`<${EmbedMoviePage}/>`;
    if (page === 'embedTV') return html`<${EmbedTVPage}/>`;

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