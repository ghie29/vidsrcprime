// ============================================================
// ROUTER — Clean URLs (History API, no #)
// ============================================================
function parseRoute() {
    // Use pathname instead of hash
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

        // Also listen to custom 'navigate' event so anchor clicks work
        window.addEventListener('app:navigate', handlePop);

        return () => {
            window.removeEventListener('popstate', handlePop);
            window.removeEventListener('app:navigate', handlePop);
        };
    }, []);

    const nav = useCallback((p) => {
        // Normalize: strip a leading '#/' if someone passes it
        let target = p;
        if (target.startsWith('#/')) target = target.slice(1);
        if (target.startsWith('#')) target = target.slice(1);
        if (!target.startsWith('/')) target = '/' + target;

        // If it's the same path, do nothing
        const current = window.location.pathname + window.location.search;
        if (current === target) return;

        window.history.pushState({}, '', target);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }, []);

    return { ...route, navigate: nav };
}