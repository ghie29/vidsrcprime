// ============================================================
// HOMEPAGE
// ============================================================
function HomePage() {
    const { navigate } = useRouter();
    const { contW, removeFromContinue } = useApp();
    const { data: trendM, loading: lm } = useFetch(() => tmdb.trendingMovie(), []);
    const { data: trendT, loading: lt } = useFetch(() => tmdb.trendingTV(), []);
    const { data: popM, loading: lpm } = useFetch(() => tmdb.popularMovie(), []);
    const { data: popT, loading: lpt } = useFetch(() => tmdb.popularTV(), []);
    const { data: topM, loading: ltm } = useFetch(() => tmdb.topRatedMovie(), []);
    const { data: topT, loading: ltt } = useFetch(() => tmdb.topRatedTV(), []);
    const { data: upM, loading: lum } = useFetch(() => tmdb.upcomingMovie(), []);

    useEffect(() => { document.title = 'VidsRcprime — Watch Movies & TV Shows Online'; }, []);

    const heroItems = trendM?.results?.slice(0, 5) || [];
    const card = (item, i) => html`<div key="${item.id}" className="w-[140px] sm:w-[160px] md:w-[180px]"><${MovieCard} item="${item}"/></div>`;
    const cwCard = (item) => {
        const itemWithPoster = { ...item, poster_path: item.poster || null, title: item.title || 'Untitled' };
        return html`<div key="${`${item.type}-${item.id}-${item.season || ''}-${item.episode || ''}`}" className="w-[140px] sm:w-[160px] md:w-[180px]">
            <${MovieCard} item="${itemWithPoster}" type="${item.type}" onRemove="${() => removeFromContinue(item.id, item.type, item.season, item.episode)}"/>
        </div>`;
    };

    return html`<div>
        <${Hero} items="${heroItems}"/>
        <div className="-mt-8 relative z-10">
            ${contW.length > 0 && html`<${Section} title="Continue Watching" items="${contW}" renderCard="${cwCard}" navigate="${navigate}"/>`}
            <${Section} title="Trending Movies" items="${trendM?.results || []}" renderCard="${card}" seeAllHref="/movies" navigate="${navigate}"/>
            ${lm && html`<div className="px-4 md:px-8 max-w-[1440px] mx-auto mb-8"><${SkelHero}/></div>`}
            <${Section} title="Popular Movies" items="${popM?.results || []}" renderCard="${card}" seeAllHref="/movies" navigate="${navigate}"/>
            <${Section} title="Popular TV Shows" items="${popT?.results || []}" renderCard="${card}" seeAllHref="/tvshows" navigate="${navigate}"/>
            <${Section} title="Top Rated Movies" items="${topM?.results || []}" renderCard="${card}" seeAllHref="/movies" navigate="${navigate}"/>
            <${Section} title="Top Rated TV Shows" items="${topT?.results || []}" renderCard="${card}" seeAllHref="/tvshows" navigate="${navigate}"/>
            <${Section} title="Upcoming Movies" items="${upM?.results || []}" renderCard="${card}" seeAllHref="/movies" navigate="${navigate}"/>
        </div>
    </div>`;
}

// ============================================================
// SEARCH PAGE
// ============================================================
function SearchPage() {
    const { params } = useRouter();
    const [query, setQuery] = useState(params.query || '');
    const [debounced, setDebounced] = useState(params.query || '');
    const [mediaType, setMediaType] = useState('all');
    const [genreId, setGenreId] = useState('');
    const [page, setPage] = useState(1);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]);

    useEffect(() => { tmdb.movieGenres().then(d => setGenres(d.genres || [])).catch(() => {}); }, []);

    const doSearch = useCallback(async (q, mt, gid, pg) => {
        if (!q || q.trim().length < 1) { setResults(null); return; }
        setLoading(true); setError(null);
        try {
            let data;
            if (gid) {
                const ep = mt === 'tv' ? 'discover/tv' : 'discover/movie';
                data = await tmdb.fetch(ep, { with_genres: gid, page: pg, sort_by: 'popularity.desc' });
            } else if (mt === 'movie') data = await tmdb.searchMovie(q, pg);
            else if (mt === 'tv') data = await tmdb.searchTV(q, pg);
            else data = await tmdb.searchMulti(q, pg);
            const filtered = (data.results || []).filter(r => r.media_type !== 'person');
            setResults({ ...data, results: filtered });
        } catch (e) { setError(e); }
        setLoading(false);
    }, []);

    const debouncedSearch = useCallback(debounce((q, mt, gid, pg) => doSearch(q, mt, gid, pg), 400), []);

    useEffect(() => { debouncedSearch(debounced, mediaType, genreId, page); }, [debounced, mediaType, genreId, page, debouncedSearch]);

    const handleQueryChange = (v) => { setQuery(v); setDebounced(v); setPage(1); };
    const handleTypeChange = (v) => { setMediaType(v); setPage(1); };
    const handleGenreChange = (v) => { setGenreId(v); setPage(1); };

    useEffect(() => { document.title = query ? `Search: ${query} — VidsRcprime` : 'Search — VidsRcprime'; }, [query]);

    const totalPages = results?.total_pages || 0;

    return html`<div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-16 anim-up">
        <h1 className="font-display text-3xl md:text-5xl tracking-wider text-center mb-8">SEARCH</h1>
        <${SearchBar} value="${query}" onChange="${handleQueryChange}"/>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            ${['all', 'movie', 'tv'].map(t => html`<button key="${t}" onClick="${() => handleTypeChange(t)}" className="${`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === t ? 'bg-accent text-white' : 'bg-card text-txt-s border border-bdr hover:bg-card-h hover:text-white'}`}">${t === 'all' ? 'All' : t === 'movie' ? 'Movies' : 'TV Shows'}</button>`)}
            <select value="${genreId}" onChange="${(e) => handleGenreChange(e.target.value)}" className="bg-card border border-bdr rounded-lg px-3 py-2 text-sm text-txt-s focus:outline-none focus:border-accent cursor-pointer" aria-label="Filter by genre">
                <option value="">All Genres</option>
                ${genres.map(g => html`<option key="${g.id}" value="${g.id}">${g.name}</option>`)}
            </select>
        </div>
        <div className="mt-8">
            ${loading && html`<${SkelGrid}/>`}
            ${error && html`<${ErrorState} msg="Search failed. Please try again." onRetry="${() => doSearch(debounced, mediaType, genreId, page)}"/>`}
            ${!loading && !error && !results && debounced && html`<${EmptyState} msg="Type something to search"/>`}
            ${!loading && !error && results && results.results.length === 0 && html`<${EmptyState} msg="No results found for your search."/>`}
            ${!loading && results && results.results.length > 0 && html`<${Fragment}>
                <p className="text-txt-m text-sm mb-4">${results.total_results} result${results.total_results !== 1 ? 's' : ''} found</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    ${results.results.map(item => html`<${MovieCard} key="${`${item.media_type || 'movie'}-${item.id}`}" item="${item}"/>`)}
                </div>
                ${totalPages > 1 && html`<div className="flex items-center justify-center gap-3 mt-10">
                    <button disabled="${page <= 1}" onClick="${() => setPage(p => p - 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"><${Icon} name="chevron-left" size="16"/> Previous</button>
                    <span className="text-txt-m text-sm">Page ${page} of ${Math.min(totalPages, 500)}</span>
                    <button disabled="${page >= Math.min(totalPages, 500)}" onClick="${() => setPage(p => p + 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">Next <${Icon} name="chevron-right" size="16"/></button>
                </div>`}
            <//>`}
        </div>
    </div>`;
}

// ============================================================
// MOVIE DETAIL PAGE
// ============================================================
function MovieDetailPage() {
    const { params, navigate } = useRouter();
    const { addToContinue } = useApp();
    const { data, loading, error, retry } = useFetch(() => tmdb.movieDetails(params.id), [params.id]);
    const [trailerKey, setTrailerKey] = useState(null);

    useEffect(() => {
        if (data) {
            const title = getTitle(data);
            const slug = slugify(title);
            document.title = `${title} — VidsRcprime`;
            const currentSlug = params.slug || '';
            const expectedSlug = `${data.id}-${slug}`;
            if (currentSlug !== expectedSlug && window.location.hash) {
                const newHash = window.location.hash.replace(/movie\/[^\/]+/, `movie/${expectedSlug}`);
                if (window.location.hash !== newHash) window.location.hash = newHash;
            }
        } else {
            document.title = 'Movie — VidsRcprime';
        }
    }, [data, params.slug, params.id]);

    if (loading) return html`<${SkelDetail}/>`;
    if (error) return html`<div className="pt-24"><${ErrorState} msg="Failed to load movie details." onRetry="${retry}"/></div>`;
    if (!data) return html`<div className="pt-24"><${EmptyState} msg="Movie not found." icon="film"/></div>`;

    const m = data;
    const trailer = (m.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const director = (m.credits?.crew || []).find(c => c.job === 'Director');
    const cast = m.credits?.cast || [];
    const similar = [...(m.recommendations?.results || []), ...(m.similar?.results || [])].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 12);

    const handleWatch = () => {
        const slug = slugify(getTitle(m));
        addToContinue({ id: m.id, type: 'movie', poster_path: m.poster_path, title: m.title, release_date: m.release_date });
        navigate(`/watch/movie/${m.id}-${slug}`);
    };
    const handleTrailer = () => { if (trailer) setTrailerKey(trailer.key); };

    return html`<div className="anim-fade">
        <div className="relative w-full h-[40vh] md:h-[55vh]">
            ${m.backdrop_path ? html`<img src="${backdropImg(m.backdrop_path)}" alt="" className="w-full h-full object-cover"/>` : html`<div className="w-full h-full bg-card"/>`}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent"/>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 -mt-32 md:-mt-40 relative z-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0 w-[160px] md:w-[240px] mx-auto md:mx-0">
                    <${PosterImg} src="${posterImg(m.poster_path)}" alt="${m.title}" className="w-full rounded-xl shadow-2xl"/>
                </div>
                <div className="flex-1">
                    <h1 className="font-display text-3xl md:text-5xl tracking-wider text-white">${m.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-txt-s">
                        ${m.release_date && html`<span className="flex items-center gap-1"><${Icon} name="calendar" size="14"/> ${formatDate(m.release_date)}</span>`}
                        ${m.runtime && html`<span className="flex items-center gap-1"><${Icon} name="clock" size="14"/> ${runtimeStr(m.runtime)}</span>`}
                        ${m.vote_average && html`<${RatingBadge} value="${m.vote_average.toFixed(1)}" size="md"/>`}
                        <span className="text-txt-m">${(m.vote_count || 0).toLocaleString()} votes</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        ${(m.genres || []).map(g => html`<span key="${g.id}" className="tag">${g.name}</span>`)}
                    </div>
                    <p className="text-txt-s text-sm md:text-base leading-relaxed mt-5 max-w-3xl">${m.overview || 'No description available.'}</p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <button onClick="${handleWatch}" className="btn-accent px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm"><${Icon} name="play" size="16" fill="white" stroke="none"/> Watch Now</button>
                        ${trailer && html`<button onClick="${handleTrailer}" className="btn-ghost px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm"><${Icon} name="play" size="16"/> Trailer</button>`}
                    </div>
                    ${director && html`<div className="mt-5 text-sm"><span className="text-txt-m">Director: </span><span className="text-white font-medium">${director.name}</span></div>`}
                    ${m.production_companies?.length > 0 && html`<div className="mt-2 text-sm"><span className="text-txt-m">Production: </span><span className="text-white">${m.production_companies.map(c => c.name).join(', ')}</span></div>`}
                </div>
            </div>
            <${CastList} cast="${cast}"/>
            ${similar.length > 0 && html`<div className="mt-10 mb-8">
                <h3 className="font-display text-xl md:text-2xl tracking-wider mb-4">YOU MAY ALSO LIKE</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    ${similar.map(item => html`<${MovieCard} key="${item.id}" item="${item}" type="movie"/>`)}
                </div>
            </div>`}
        </div>
        ${trailerKey && html`<${TrailerModal} videoKey="${trailerKey}" onClose="${() => setTrailerKey(null)}"/>`}
    </div>`;
}

// ============================================================
// TV DETAIL PAGE
// ============================================================
function TVDetailPage() {
    const { params, navigate } = useRouter();
    const { addToContinue } = useApp();
    const { data, loading, error, retry } = useFetch(() => tmdb.tvDetails(params.id), [params.id]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [trailerKey, setTrailerKey] = useState(null);
    const { data: seasonData, loading: seasonLoading } = useFetch(
        () => data && data.number_of_seasons ? tmdb.seasonDetails(params.id, selectedSeason) : Promise.resolve(null),
        [params.id, selectedSeason, data]
    );

    useEffect(() => {
        if (data) {
            const title = getTitle(data);
            const slug = slugify(title);
            document.title = `${title} — VidsRcprime`;
            setSelectedSeason(1);
            const currentSlug = params.slug || '';
            const expectedSlug = `${data.id}-${slug}`;
            if (currentSlug !== expectedSlug && window.location.hash) {
                const newHash = window.location.hash.replace(/tv\/[^\/]+/, `tv/${expectedSlug}`);
                if (window.location.hash !== newHash) window.location.hash = newHash;
            }
        } else {
            document.title = 'TV Show — VidsRcprime';
        }
    }, [data, params.slug, params.id]);

    if (loading) return html`<${SkelDetail}/>`;
    if (error) return html`<div className="pt-24"><${ErrorState} msg="Failed to load TV show details." onRetry="${retry}"/></div>`;
    if (!data) return html`<div className="pt-24"><${EmptyState} msg="TV show not found." icon="tv"/></div>`;

    const t = data;
    const trailer = (t.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const cast = t.credits?.cast || [];
    const similar = [...(t.recommendations?.results || []), ...(t.similar?.results || [])].filter((v, i, a) => a.findIndex(x => x.id === v.id) === i).slice(0, 12);
    const episodes = seasonData?.episodes || [];

    const handleWatchFirst = () => {
        if (episodes.length) {
            const slug = slugify(getTitle(t));
            addToContinue({ id: t.id, type: 'tv', poster_path: t.poster_path, name: t.name, first_air_date: t.first_air_date, season: selectedSeason, episode: episodes[0].episode_number });
            navigate(`/watch/tv/${t.id}-${slug}/${selectedSeason}/${episodes[0].episode_number}`);
        }
    };
    const handleTrailer = () => { if (trailer) setTrailerKey(trailer.key); };

    return html`<div className="anim-fade">
        <div className="relative w-full h-[40vh] md:h-[55vh]">
            ${t.backdrop_path ? html`<img src="${backdropImg(t.backdrop_path)}" alt="" className="w-full h-full object-cover"/>` : html`<div className="w-full h-full bg-card"/>`}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent"/>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 -mt-32 md:-mt-40 relative z-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0 w-[160px] md:w-[240px] mx-auto md:mx-0">
                    <${PosterImg} src="${posterImg(t.poster_path)}" alt="${t.name}" className="w-full rounded-xl shadow-2xl"/>
                </div>
                <div className="flex-1">
                    <h1 className="font-display text-3xl md:text-5xl tracking-wider text-white">${t.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-txt-s">
                        ${t.first_air_date && html`<span className="flex items-center gap-1"><${Icon} name="calendar" size="14"/> ${formatDate(t.first_air_date)}</span>`}
                        ${t.vote_average && html`<${RatingBadge} value="${t.vote_average.toFixed(1)}" size="md"/>`}
                        <span className="text-txt-m">${t.number_of_seasons || 0} Season${t.number_of_seasons !== 1 ? 's' : ''}</span>
                        <span className="text-txt-m">${t.number_of_episodes || 0} Episodes</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        ${(t.genres || []).map(g => html`<span key="${g.id}" className="tag">${g.name}</span>`)}
                    </div>
                    <p className="text-txt-s text-sm md:text-base leading-relaxed mt-5 max-w-3xl">${t.overview || 'No description available.'}</p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <button onClick="${handleWatchFirst}" className="btn-accent px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm"><${Icon} name="play" size="16" fill="white" stroke="none"/> Watch Now</button>
                        ${trailer && html`<button onClick="${handleTrailer}" className="btn-ghost px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm"><${Icon} name="play" size="16"/> Trailer</button>`}
                    </div>
                </div>
            </div>
            <${CastList} cast="${cast}"/>
            <div className="mt-10">
                <h3 className="font-display text-xl md:text-2xl tracking-wider mb-2">EPISODES</h3>
                <${SeasonSelector} totalSeasons="${t.number_of_seasons || 1}" selected="${selectedSeason}" onSelect="${setSelectedSeason}"/>
                ${seasonLoading
                    ? html`<div className="mt-4 space-y-3">${Array.from({ length: 5 }).map((_, i) => html`<div key="${i}" className="skeleton rounded-lg h-24"/>`)}</div>`
                    : html`<${EpisodeList} episodes="${episodes}" showId="${t.id}" seasonNum="${selectedSeason}" navigate="${navigate}" addToContinue="${addToContinue}"/>`}
            </div>
            ${similar.length > 0 && html`<div className="mt-10 mb-8">
                <h3 className="font-display text-xl md:text-2xl tracking-wider mb-4">SIMILAR SHOWS</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    ${similar.map(item => html`<${MovieCard} key="${item.id}" item="${item}" type="tv"/>`)}
                </div>
            </div>`}
        </div>
        ${trailerKey && html`<${TrailerModal} videoKey="${trailerKey}" onClose="${() => setTrailerKey(null)}"/>`}
    </div>`;
}

// ============================================================
// WATCH MOVIE PAGE
// ============================================================
function WatchMoviePage() {
    const { params } = useRouter();
    const { data } = useFetch(() => tmdb.movieDetails(params.id), [params.id]);
    const [iframeErr, setIframeErr] = useState(false);
    const { server, setServer } = useApp();
    const embedUrl = useMemo(() => getMovieEmbedUrl(params.id, server), [params.id, server]);

    useEffect(() => {
        if (data) {
            const title = getTitle(data);
            const slug = slugify(title);
            document.title = `Watch ${title} — VidsRcprime`;
            const currentSlug = params.slug || '';
            const expectedSlug = `${data.id}-${slug}`;
            if (currentSlug !== expectedSlug && window.location.hash) {
                const newHash = window.location.hash.replace(/watch\/movie\/[^\/]+/, `watch/movie/${expectedSlug}`);
                if (window.location.hash !== newHash) window.location.hash = newHash;
            }
        } else {
            document.title = 'Watch — VidsRcprime';
        }
    }, [data, params.slug, params.id]);

    const handleServerChange = (e) => { setServer(e.target.value); setIframeErr(false); };

    const renderIframe = () => {
        const iframeProps = {
            src: embedUrl,
            width: '100%',
            height: '100%',
            frameborder: '0',
            scrolling: 'no',
            allow: 'autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write;',
            allowFullScreen: true,
            title: 'Video player',
            referrerpolicy: 'no-referrer',
            loading: 'lazy',
            onError: () => setIframeErr(true)
        };
        if (server === 'pro') {
            return html`<iframe ...${iframeProps} sandbox="allow-scripts allow-same-origin allow-forms allow-modals"/>`;
        }
        return html`<iframe ...${iframeProps}/>`;
    };

    return html`<div className="min-h-screen bg-black anim-fade">
        <div className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-bdr">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-14 flex items-center"></div>
        </div>
        <div className="max-w-[1440px] mx-auto relative">
            <div className="player-wrap rounded-none md:rounded-b-xl overflow-hidden">
                ${!iframeErr ? renderIframe() : html`<div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-s text-center p-8">
                    <${Icon} name="alert" size="48" className="text-accent mb-4"/>
                    <p className="text-white text-lg font-semibold mb-2">Unable to load player</p>
                    <p className="text-txt-m text-sm mb-4">The streaming source may be temporarily unavailable. Try switching servers.</p>
                    <div className="flex gap-3">
                        <button onClick="${() => setIframeErr(false)}" className="btn-accent px-4 py-2 rounded-lg text-sm">Retry</button>
                        <button onClick="${() => { const newServer = SERVER_KEYS.find(k => k !== server) || 'vidsrc'; setServer(newServer); setIframeErr(false); }}" className="btn-ghost px-4 py-2 rounded-lg text-sm">Switch Server</button>
                    </div>
                </div>`}
                <div className="absolute top-3 left-3 z-[9999] flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-lg px-2 py-1.5 border border-white/15 shadow-lg">
                    <${Icon} name="server" size="14" className="text-txt-m flex-shrink-0"/>
                    <select value="${server}" onChange="${handleServerChange}" className="server-selector-overlay" aria-label="Select streaming server">
                        ${SERVER_KEYS.map(key => html`<option key="${key}" value="${key}">${SERVERS[key].name}</option>`)}
                    </select>
                </div>
            </div>
            ${data && html`<div className="px-4 md:px-8 py-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-txt-s">
                    ${data.release_date && html`<span>${year(data.release_date)}</span>`}
                    ${data.runtime && html`<span>${runtimeStr(data.runtime)}</span>`}
                    ${data.vote_average && html`<${RatingBadge} value="${data.vote_average.toFixed(1)}"/>`}
                    ${(data.genres || []).map(g => html`<span key="${g.id}" className="tag">${g.name}</span>`)}
                </div>
                <p className="text-txt-s text-sm mt-3 max-w-3xl">${data.overview || ''}</p>
            </div>`}
            ${data && (data.recommendations?.results?.length || data.similar?.results?.length) > 0 && html`<div className="px-4 md:px-8 pb-10">
                <h3 className="font-display text-xl tracking-wider mb-4">RECOMMENDED</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    ${[...(data.recommendations?.results || []), ...(data.similar?.results || [])].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 12).map(item => html`<${MovieCard} key="${item.id}" item="${item}" type="movie"/>`)}
                </div>
            </div>`}
        </div>
    </div>`;
}

// ============================================================
// WATCH TV PAGE
// ============================================================
function WatchTVPage() {
    const { params, navigate } = useRouter();
    const { addToContinue, server, setServer } = useApp();
    const { data } = useFetch(() => tmdb.tvDetails(params.id), [params.id]);
    const { data: seasonData, loading: sLoading } = useFetch(
        () => data ? tmdb.seasonDetails(params.id, params.season) : Promise.resolve(null),
        [params.id, params.season, data]
    );
    const [iframeErr, setIframeErr] = useState(false);
    const sNum = parseInt(params.season);
    const eNum = parseInt(params.episode);
    const embedUrl = useMemo(() => getTVEmbedUrl(params.id, sNum, eNum, server), [params.id, sNum, eNum, server]);
    const episodes = seasonData?.episodes || [];
    const currentEp = episodes.find(e => e.episode_number === eNum);
    const prevEp = episodes.find(e => e.episode_number === eNum - 1);
    const nextEp = episodes.find(e => e.episode_number === eNum + 1);

    useEffect(() => {
        if (data) {
            const title = getTitle(data);
            const slug = slugify(title);
            document.title = `Watch ${title} S${sNum}E${eNum} — VidsRcprime`;
            const currentSlug = params.slug || '';
            const expectedSlug = `${data.id}-${slug}`;
            if (currentSlug !== expectedSlug && window.location.hash) {
                const newHash = window.location.hash.replace(/watch\/tv\/[^\/]+/, `watch/tv/${expectedSlug}`);
                if (window.location.hash !== newHash) window.location.hash = newHash;
            }
            addToContinue({ id: data.id, type: 'tv', poster_path: data.poster_path, name: data.name, first_air_date: data.first_air_date, season: sNum, episode: eNum });
        } else {
            document.title = 'Watch — VidsRcprime';
        }
    }, [data, params.slug, params.id]);

    const goEp = (s, e) => {
        const slug = slugify(getTitle(data));
        navigate(`/watch/tv/${data.id}-${slug}/${s}/${e}`);
    };
    const handleServerChange = (e) => { setServer(e.target.value); setIframeErr(false); };

    const renderIframe = () => {
        const iframeProps = {
            src: embedUrl,
            width: '100%',
            height: '100%',
            frameborder: '0',
            scrolling: 'no',
            allow: 'autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write;',
            allowFullScreen: true,
            title: 'Video player',
            referrerpolicy: 'no-referrer',
            loading: 'lazy',
            onError: () => setIframeErr(true)
        };
        if (server === 'pro') {
            return html`<iframe ...${iframeProps} sandbox="allow-scripts allow-same-origin allow-forms allow-modals"/>`;
        }
        return html`<iframe ...${iframeProps}/>`;
    };

    return html`<div className="min-h-screen bg-black anim-fade">
        <div className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-bdr">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-14 flex items-center justify-end">
                <div className="flex items-center gap-2">
                    ${prevEp && html`<button onClick="${() => goEp(sNum, eNum - 1)}" className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"><${Icon} name="chevron-left" size="14"/> Previous</button>`}
                    ${nextEp && html`<button onClick="${() => goEp(sNum, eNum + 1)}" className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">Next <${Icon} name="chevron-right" size="14"/></button>`}
                </div>
            </div>
        </div>
        <div className="max-w-[1440px] mx-auto relative">
            <div className="player-wrap rounded-none md:rounded-b-xl overflow-hidden">
                ${!iframeErr ? renderIframe() : html`<div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-s text-center p-8">
                    <${Icon} name="alert" size="48" className="text-accent mb-4"/>
                    <p className="text-white text-lg font-semibold mb-2">Unable to load player</p>
                    <p className="text-txt-m text-sm mb-4">The streaming source may be temporarily unavailable. Try switching servers.</p>
                    <div className="flex gap-3">
                        <button onClick="${() => setIframeErr(false)}" className="btn-accent px-4 py-2 rounded-lg text-sm">Retry</button>
                        <button onClick="${() => { const newServer = SERVER_KEYS.find(k => k !== server) || 'vidsrc'; setServer(newServer); setIframeErr(false); }}" className="btn-ghost px-4 py-2 rounded-lg text-sm">Switch Server</button>
                    </div>
                </div>`}
                <div className="absolute top-3 left-3 z-[9999] flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-lg px-2 py-1.5 border border-white/15 shadow-lg">
                    <${Icon} name="server" size="14" className="text-txt-m flex-shrink-0"/>
                    <select value="${server}" onChange="${handleServerChange}" className="server-selector-overlay" aria-label="Select streaming server">
                        ${SERVER_KEYS.map(key => html`<option key="${key}" value="${key}">${SERVERS[key].name}</option>`)}
                    </select>
                </div>
            </div>
            ${currentEp && html`<div className="px-4 md:px-8 py-6">
                <h2 className="text-lg font-semibold text-white">S${String(sNum).padStart(2, '0')}E${String(eNum).padStart(2, '0')} — ${currentEp.name || 'Untitled'}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-txt-s mt-2">
                    ${currentEp.air_date && html`<span>${formatDate(currentEp.air_date)}</span>`}
                    ${currentEp.runtime && html`<span>${currentEp.runtime}m</span>`}
                    ${currentEp.vote_average && html`<${RatingBadge} value="${currentEp.vote_average.toFixed(1)}"/>`}
                </div>
                <p className="text-txt-s text-sm mt-3 max-w-3xl">${currentEp.overview || ''}</p>
            </div>`}
            <div className="px-4 md:px-8 pb-10">
                <h3 className="font-display text-xl tracking-wider mb-4">SEASON ${sNum} EPISODES</h3>
                ${sLoading
                    ? html`<div className="space-y-2">${Array.from({ length: 5 }).map((_, i) => html`<div key="${i}" className="skeleton rounded-lg h-20"/>`)}</div>`
                    : html`<div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                        ${episodes.map(ep => {
                            const active = ep.episode_number === eNum;
                            return html`<button key="${ep.id}" onClick="${() => goEp(sNum, ep.episode_number)}" className="${`ep-card flex items-center gap-4 p-3 rounded-lg border text-left transition-all ${active ? 'border-accent bg-accent/10' : 'border-bdr hover:bg-card-h'}`}">
                                <span className="${`text-sm font-bold w-8 text-center ${active ? 'text-accent' : 'text-txt-m'}`}">${ep.episode_number}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="${`text-sm font-medium truncate ${active ? 'text-white' : 'text-txt-s'}`}">${ep.name || 'Untitled'}</p>
                                    <p className="text-xs text-txt-m mt-0.5">${ep.runtime ? ep.runtime + 'm' : ''}</p>
                                </div>
                                ${active && html`<${Icon} name="play" size="14" className="text-accent flex-shrink-0"/>`}
                            </button>`;
                        })}
                    </div>`}
            </div>
        </div>
    </div>`;
}

// ============================================================
// FAVORITES PAGE
// ============================================================
function FavoritesPage() {
    const { favs } = useApp();
    useEffect(() => { document.title = 'Favorites — VidsRcprime'; }, []);

    return html`<div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-16 anim-up">
        <h1 className="font-display text-3xl md:text-5xl tracking-wider mb-8">FAVORITES</h1>
        ${favs.length === 0
            ? html`<${EmptyState} msg="Your favorites list is empty. Browse movies and TV shows to add some." icon="heart"/>`
            : html`<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                ${favs.map(f => html`<${MovieCard} key="${`${f.type}-${f.id}`}" item="${{ ...f, media_type: f.type, title: f.title, poster_path: f.poster, release_date: f.year ? `${f.year}-01-01` : null }}" type="${f.type}"/>`)}
            </div>`}
    </div>`;
}

// ============================================================
// GENRES PAGE
// ============================================================
function GenresPage() {
    const { navigate } = useRouter();
    const { data: movieG, loading: lm } = useFetch(() => tmdb.movieGenres(), []);
    const { data: tvG, loading: lt } = useFetch(() => tmdb.tvGenres(), []);

    useEffect(() => { document.title = 'Genres — VidsRcprime'; }, []);

    const colors = ['from-red-900/40 to-red-950/60', 'from-blue-900/40 to-blue-950/60', 'from-green-900/40 to-green-950/60', 'from-purple-900/40 to-purple-950/60', 'from-yellow-900/40 to-yellow-950/60', 'from-pink-900/40 to-pink-950/60', 'from-cyan-900/40 to-cyan-950/60', 'from-orange-900/40 to-orange-950/60'];

    return html`<div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-16 anim-up">
        <h1 className="font-display text-3xl md:text-5xl tracking-wider mb-2">GENRES</h1>
        <p className="text-txt-s mb-8">Browse movies and TV shows by genre</p>
        <div className="mb-10">
            <h2 className="font-display text-xl tracking-wider text-accent mb-4">MOVIE GENRES</h2>
            ${lm
                ? html`<${SkelGrid} n={6}/>`
                : html`<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    ${(movieG?.genres || []).map((g, i) => html`<button key="${g.id}" onClick="${() => navigate(`/genre/movie/${g.id}`)}" className="${`genre-card bg-gradient-to-br ${colors[i % colors.length]} border border-bdr rounded-xl p-5 text-left`}">
                        <p className="font-display text-2xl tracking-wider text-white">${g.name}</p>
                        <p className="text-xs text-txt-m mt-1">${g.name} Movies</p>
                    </button>`)}
                </div>`}
        </div>
        <div>
            <h2 className="font-display text-xl tracking-wider text-accent mb-4">TV GENRES</h2>
            ${lt
                ? html`<${SkelGrid} n={6}/>`
                : html`<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    ${(tvG?.genres || []).map((g, i) => html`<button key="${g.id}" onClick="${() => navigate(`/genre/tv/${g.id}`)}" className="${`genre-card bg-gradient-to-br ${colors[(i + 3) % colors.length]} border border-bdr rounded-xl p-5 text-left`}">
                        <p className="font-display text-2xl tracking-wider text-white">${g.name}</p>
                        <p className="text-xs text-txt-m mt-1">${g.name} TV Shows</p>
                    </button>`)}
                </div>`}
        </div>
    </div>`;
}

// ============================================================
// GENRE DETAIL PAGE
// ============================================================
function GenreDetailPage() {
    const { params, navigate } = useRouter();
    const [page, setPage] = useState(1);
    const isTV = params.type === 'tv';
    const { data, loading, error, retry } = useFetch(() => isTV ? tmdb.discoverTV({ with_genres: params.id, page }) : tmdb.discoverMovie({ with_genres: params.id, page }), [params.type, params.id, page]);

    useEffect(() => { setPage(1); }, [params.id, params.type]);
    useEffect(() => { document.title = 'Genre — VidsRcprime'; }, []);

    const total = data?.total_pages || 0;

    return html`<div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-16 anim-up">
        <button onClick="${() => navigate('/genres')}" className="flex items-center gap-2 text-txt-s hover:text-white transition-colors text-sm mb-4"><${Icon} name="arrow-left" size="16"/> Back to Genres</button>
        <h1 className="font-display text-3xl md:text-5xl tracking-wider mb-8">${isTV ? 'TV SHOWS' : 'MOVIES'}</h1>
        ${loading && html`<${SkelGrid}/>`}
        ${error && html`<${ErrorState} msg="Failed to load genre content." onRetry="${retry}"/>`}
        ${!loading && data && data.results?.length === 0 && html`<${EmptyState} msg="No content found in this genre."/>`}
        ${!loading && data && data.results?.length > 0 && html`<${Fragment}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                ${data.results.map(item => html`<${MovieCard} key="${item.id}" item="${item}" type="${params.type}"/>`)}
            </div>
            ${total > 1 && html`<div className="flex items-center justify-center gap-3 mt-10">
                <button disabled="${page <= 1}" onClick="${() => setPage(p => p - 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"><${Icon} name="chevron-left" size="16"/> Previous</button>
                <span className="text-txt-m text-sm">Page ${page} of ${Math.min(total, 500)}</span>
                <button disabled="${page >= Math.min(total, 500)}" onClick="${() => setPage(p => p + 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">Next <${Icon} name="chevron-right" size="16"/></button>
            </div>`}
        <//>`}
    </div>`;
}

// ============================================================
// MOVIES PAGE
// ============================================================
function MoviesPage() {
    const [sort, setSort] = useState('popular');
    const [genreId, setGenreId] = useState('');
    const [page, setPage] = useState(1);
    const [genres, setGenres] = useState([]);

    useEffect(() => { tmdb.movieGenres().then(d => setGenres(d.genres || [])).catch(() => {}); }, []);

    const sortMap = { popular: () => tmdb.popularMovie(page), top_rated: () => tmdb.topRatedMovie(page), now_playing: () => tmdb.nowPlayingMovie(page), upcoming: () => tmdb.upcomingMovie(page) };
    const { data, loading, error, retry } = useFetch(() => genreId ? tmdb.discoverMovie({ with_genres: genreId, page, sort_by: 'popularity.desc' }) : sortMap[sort](), [sort, genreId, page]);

    useEffect(() => { document.title = 'Movies — VidsRcprime'; setPage(1); }, [sort, genreId]);
    const total = data?.total_pages || 0;

    return html`<div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-16 anim-up">
        <h1 className="font-display text-3xl md:text-5xl tracking-wider mb-8">MOVIES</h1>
        <div className="flex flex-wrap items-center gap-3 mb-8">
            ${[{ k: 'popular', l: 'Popular' }, { k: 'top_rated', l: 'Top Rated' }, { k: 'now_playing', l: 'Now Playing' }, { k: 'upcoming', l: 'Upcoming' }].map(s => html`<button key="${s.k}" onClick="${() => { setSort(s.k); setGenreId(''); }}" className="${`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sort === s.k && !genreId ? 'bg-accent text-white' : 'bg-card text-txt-s border border-bdr hover:bg-card-h hover:text-white'}`}">${s.l}</button>`)}
            <select value="${genreId}" onChange="${(e) => { setGenreId(e.target.value); setPage(1); }}" className="bg-card border border-bdr rounded-lg px-3 py-2 text-sm text-txt-s focus:outline-none focus:border-accent cursor-pointer" aria-label="Filter by genre">
                <option value="">All Genres</option>
                ${genres.map(g => html`<option key="${g.id}" value="${g.id}">${g.name}</option>`)}
            </select>
        </div>
        ${loading && html`<${SkelGrid}/>`}
        ${error && html`<${ErrorState} msg="Failed to load movies." onRetry="${retry}"/>`}
        ${!loading && data && html`<${Fragment}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                ${data.results.map(item => html`<${MovieCard} key="${item.id}" item="${item}" type="movie"/>`)}
            </div>
            ${total > 1 && html`<div className="flex items-center justify-center gap-3 mt-10">
                <button disabled="${page <= 1}" onClick="${() => setPage(p => p - 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"><${Icon} name="chevron-left" size="16"/> Previous</button>
                <span className="text-txt-m text-sm">Page ${page} of ${Math.min(total, 500)}</span>
                <button disabled="${page >= Math.min(total, 500)}" onClick="${() => setPage(p => p + 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">Next <${Icon} name="chevron-right" size="16"/></button>
            </div>`}
        <//>`}
    </div>`;
}

// ============================================================
// TV SHOWS PAGE
// ============================================================
function TVShowsPage() {
    const [sort, setSort] = useState('popular');
    const [genreId, setGenreId] = useState('');
    const [page, setPage] = useState(1);
    const [genres, setGenres] = useState([]);

    useEffect(() => { tmdb.tvGenres().then(d => setGenres(d.genres || [])).catch(() => {}); }, []);

    const sortMap = { popular: () => tmdb.popularTV(page), top_rated: () => tmdb.topRatedTV(page), on_the_air: () => tmdb.onTheAirTV(page) };
    const { data, loading, error, retry } = useFetch(() => genreId ? tmdb.discoverTV({ with_genres: genreId, page, sort_by: 'popularity.desc' }) : sortMap[sort](), [sort, genreId, page]);

    useEffect(() => { document.title = 'TV Shows — VidsRcprime'; setPage(1); }, [sort, genreId]);
    const total = data?.total_pages || 0;

    return html`<div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 pb-16 anim-up">
        <h1 className="font-display text-3xl md:text-5xl tracking-wider mb-8">TV SHOWS</h1>
        <div className="flex flex-wrap items-center gap-3 mb-8">
            ${[{ k: 'popular', l: 'Popular' }, { k: 'top_rated', l: 'Top Rated' }, { k: 'on_the_air', l: 'On The Air' }].map(s => html`<button key="${s.k}" onClick="${() => { setSort(s.k); setGenreId(''); }}" className="${`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sort === s.k && !genreId ? 'bg-accent text-white' : 'bg-card text-txt-s border border-bdr hover:bg-card-h hover:text-white'}`}">${s.l}</button>`)}
            <select value="${genreId}" onChange="${(e) => { setGenreId(e.target.value); setPage(1); }}" className="bg-card border border-bdr rounded-lg px-3 py-2 text-sm text-txt-s focus:outline-none focus:border-accent cursor-pointer" aria-label="Filter by genre">
                <option value="">All Genres</option>
                ${genres.map(g => html`<option key="${g.id}" value="${g.id}">${g.name}</option>`)}
            </select>
        </div>
        ${loading && html`<${SkelGrid}/>`}
        ${error && html`<${ErrorState} msg="Failed to load TV shows." onRetry="${retry}"/>`}
        ${!loading && data && html`<${Fragment}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                ${data.results.map(item => html`<${MovieCard} key="${item.id}" item="${item}" type="tv"/>`)}
            </div>
            ${total > 1 && html`<div className="flex items-center justify-center gap-3 mt-10">
                <button disabled="${page <= 1}" onClick="${() => setPage(p => p - 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"><${Icon} name="chevron-left" size="16"/> Previous</button>
                <span className="text-txt-m text-sm">Page ${page} of ${Math.min(total, 500)}</span>
                <button disabled="${page >= Math.min(total, 500)}" onClick="${() => setPage(p => p + 1)}" className="btn-ghost px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">Next <${Icon} name="chevron-right" size="16"/></button>
            </div>`}
        <//>`}
    </div>`;
}

// ============================================================
// 404 PAGE
// ============================================================
function NotFoundPage() {
    const { navigate } = useRouter();
    useEffect(() => { document.title = 'Page Not Found — VidsRcprime'; }, []);
    return html`<div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 anim-up">
        <span className="font-display text-8xl md:text-[120px] text-accent leading-none">404</span>
        <h1 className="font-display text-2xl md:text-4xl tracking-wider mt-4">PAGE NOT FOUND</h1>
        <p className="text-txt-s mt-3 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        <button onClick="${() => navigate('/')}" className="btn-accent px-6 py-3 rounded-lg font-semibold mt-6 flex items-center gap-2 text-sm"><${Icon} name="home" size="16"/> Go Home</button>
    </div>`;
}