// ============================================================
// SKELETONS
// ============================================================
function SkelLine({ w = '100%', h = 16, className = '' }) {
    return html`<div className="${`skeleton rounded ${className}`}" style="${{ width: w, height: h }}"/>`;
}
function SkelCard() {
    return html`<div className="w-[140px] sm:w-[160px] md:w-[180px]">
        <div className="skeleton rounded-lg" style="${{ aspectRatio: '2/3' }}"/>
        <div className="mt-2 skeleton rounded" style="${{ width: '80%', height: 14 }}"/>
        <div className="mt-1 skeleton rounded" style="${{ width: '50%', height: 12 }}"/>
    </div>`;
}
function SkelHero() {
    return html`<div className="relative w-full h-[60vh] md:h-[75vh] skeleton"/>`;
}
function SkelDetail() {
    return html`<div className="max-w-6xl mx-auto px-4 pt-24">
        <div className="skeleton rounded-lg w-full" style="${{ height: 400 }}"/>
        <div className="mt-6 skeleton rounded" style="${{ width: '60%', height: 40 }}"/>
        <div className="mt-3 skeleton rounded" style="${{ width: '90%', height: 16 }}"/>
        <div className="mt-2 skeleton rounded" style="${{ width: '80%', height: 16 }}"/>
    </div>`;
}
function SkelGrid({ n = 12 }) {
    return html`<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        ${Array.from({ length: n }).map((_, i) => html`<${SkelCard} key="${i}"/>`)}
    </div>`;
}
function SkelCast({ n = 8 }) {
    return html`<div className="flex gap-4 overflow-x-auto scroll-row">
        ${Array.from({ length: n }).map((_, i) => html`<div key="${i}" className="flex-shrink-0 w-[100px] text-center">
            <div className="skeleton rounded-full mx-auto" style="${{ width: 64, height: 64 }}"/>
            <div className="mt-2 skeleton rounded mx-auto" style="${{ width: 70, height: 12 }}"/>
        </div>`)}
    </div>`;
}

// ============================================================
// ERROR & EMPTY STATES
// ============================================================
function ErrorState({ msg = 'Something went wrong', onRetry }) {
    return html`<div className="flex flex-col items-center justify-center py-20 text-center anim-fade">
        <${Icon} name="alert" size="48" className="text-accent mb-4"/>
        <p className="text-txt-s text-lg mb-4">${msg}</p>
        ${onRetry && html`<button onClick="${onRetry}" className="btn-accent px-6 py-2 rounded-lg font-medium">Try Again</button>`}
    </div>`;
}
function EmptyState({ msg = 'Nothing found', icon = 'search' }) {
    return html`<div className="flex flex-col items-center justify-center py-20 text-center anim-fade">
        <${Icon} name="${icon}" size="48" className="text-txt-m mb-4"/>
        <p className="text-txt-s text-lg">${msg}</p>
    </div>`;
}

// ============================================================
// RATING BADGE
// ============================================================
function RatingBadge({ value, size = 'sm' }) {
    if (!value || value === '—') return null;
    const v = parseFloat(value);
    const color = v >= 7 ? 'text-green-400' : v >= 5 ? 'text-yellow-400' : 'text-red-400';
    const sz = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';
    return html`<span className="${`inline-flex items-center gap-1 rounded ${sz} bg-black/60 ${color} font-semibold`}">
        <${Icon} name="star" size="${size === 'sm' ? 10 : 12}" fill="currentColor" stroke="none"/>
        ${value}
    </span>`;
}

// ============================================================
// POSTER IMAGE WITH FALLBACK
// ============================================================
function PosterImg({ src, alt, className = '', aspect = '2/3' }) {
    const [err, setErr] = useState(false);
    const fallback = html`<div className="${`bg-card flex items-center justify-center rounded-lg ${className}`}" style="${{ aspectRatio: aspect }}">
        <${Icon} name="film" size="32" className="text-txt-m"/>
    </div>`;
    if (!src || err) return fallback;
    return html`<img src="${src}" alt="${alt || 'Poster'}" className="${`object-cover rounded-lg ${className}`}" style="${{ aspectRatio: aspect }}" loading="lazy" onError="${() => setErr(true)}"/>`;
}

// ============================================================
// NAVBAR
// ============================================================
const LOGO_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEij9mcJHx1xZm4GBR9iAhyphenhyphenOWLdHrJWbzRgjgSQnfh3mGjlZmLSSGAW0d_DKBtMjJ3NsQsguXrhmAvWXLN5x2I_ZPLvLvMTHm1bilcjv_SlWJL4MBi_9XkfZKjUHJfZ7AC0GdNVrPCzyAUOCcWmCHq9woPr_3I67TQ1Ug_sSF2xbQSyz8Wn2YhwM1wknDXEd/s1600/vidsrcprime_logo.png';

function Navbar() {
    const { navigate } = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { favs } = useApp();

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);

    const links = [
    { label: 'Home', href: '/' },
    { label: 'Movies', href: '/movies' },
    { label: 'TV Shows', href: '/tvshows' },
    { label: 'Genres', href: '/genres' },
    { label: 'Search', href: '/search' },
    { label: 'API Docs', href: '/api' },
];

    const closeMobile = useCallback(() => setMobileOpen(false), []);

    return html`<nav className="${`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}" role="navigation" aria-label="Main navigation">
        <div className="max-w-[1440px] mx-auto px-4 md:px-5 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group" aria-label="VidsRcprime Home" onClick="${(e) => { e.preventDefault(); navigate('/'); }}">
                <img src="${LOGO_URL}" alt="VidsRcprime" className="h-16 w-auto object-contain"/>
            </a>
            <div className="hidden md:flex items-center gap-1">
                ${links.map(l => html`<a key="${l.href}" href="${l.href}" className="px-3 py-2 rounded-lg text-sm font-medium text-txt-s hover:text-white hover:bg-white/5 transition-all" onClick="${(e) => { e.preventDefault(); navigate(l.href); }}">${l.label}</a>`)}
                <a href="/favorites" className="relative ml-2 p-2 rounded-lg text-txt-s hover:text-white hover:bg-white/5 transition-all" onClick="${(e) => { e.preventDefault(); navigate('/favorites'); }}" aria-label="Favorites">
                    <${Icon} name="heart" size="18"/>
                    ${favs.length > 0 && html`<span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full text-[10px] font-bold flex items-center justify-center">${favs.length}</span>`}
                </a>
            </div>
            <button className="md:hidden p-2 rounded-lg text-txt-s hover:text-white" onClick="${() => setMobileOpen(true)}" aria-label="Open menu">
                <${Icon} name="menu" size="22"/>
            </button>
        </div>
        ${mobileOpen && html`<${MobileMenu} links="${links}" favs="${favs.length}" onClose="${closeMobile}" navigate="${navigate}"/>`}
    </nav>`;
}

function MobileMenu({ links, favs, onClose, navigate }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return html`<div className="fixed inset-0 z-[100] md:hidden anim-fade">
        {/* Backdrop — solid dark overlay */}
        <div
            className="absolute inset-0"
            style="${{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}"
            onClick="${onClose}"
        />
        {/* Drawer panel — solid background */}
        <div
            className="absolute top-0 right-0 w-72 h-full border-l border-bdr anim-down"
            style="${{ background: '#111111', boxShadow: '-8px 0 24px rgba(0,0,0,0.5)' }}"
        >
            <div className="flex items-center justify-between p-4 border-b border-bdr">
                <div className="flex items-center gap-2">
                    <img src="${LOGO_URL}" alt="VidsRcprime" className="h-6 w-auto object-contain"/>
                </div>
                <button
                    onClick="${onClose}"
                    className="p-2 rounded-lg text-txt-s hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                >
                    <${Icon} name="x" size="20"/>
                </button>
            </div>
            <div className="p-4 flex flex-col gap-1" style="${{ background: '#111111' }}">
                ${links.map(l => html`
                    <a
                        key="${l.href}"
                        href="${l.href}"
                        className="px-4 py-3 rounded-lg text-txt-s hover:text-white hover:bg-white/5 transition-all font-medium"
                        onClick="${(e) => { e.preventDefault(); navigate(l.href); onClose(); }}"
                    >${l.label}</a>
                `)}
                <a
                    href="/favorites"
                    className="px-4 py-3 rounded-lg text-txt-s hover:text-white hover:bg-white/5 transition-all font-medium flex items-center gap-2"
                    onClick="${(e) => { e.preventDefault(); navigate('/favorites'); onClose(); }}"
                >
                    <${Icon} name="heart" size="16"/> Favorites
                    ${favs > 0 ? html`<span className="ml-auto bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">${favs}</span>` : null}
                </a>
            </div>
        </div>
    </div>`;
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
    const { navigate } = useRouter();
    const cols = [
    { title: 'Browse', links: [{ l: 'Movies', h: '/movies' }, { l: 'TV Shows', h: '/tvshows' }, { l: 'Genres', h: '/genres' }, { l: 'Search', h: '/search' }] },
    { title: 'Library', links: [{ l: 'Favorites', h: '/favorites' }, { l: 'Continue Watching', h: '/' }] },
    { title: 'Developers', links: [{ l: 'API Docs', h: '/api' }, { l: 'Embed Guide', h: '/api' }] },
];
    return html`<footer className="border-t border-bdr mt-16" role="contentinfo">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="col-span-2 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <img src="${LOGO_URL}" alt="" className="h-7 w-auto object-contain"/>
                    </div>
                    <p className="text-txt-m text-sm leading-relaxed max-w-md">Your destination for movies and TV shows. Browse, discover, and watch your favorite content with a premium cinematic experience.</p>
                </div>
                ${cols.map(c => html`<div key="${c.title}">
                    <h4 className="font-semibold text-sm text-txt-s mb-3 uppercase tracking-wider">${c.title}</h4>
                    <ul className="flex flex-col gap-2">
                        ${c.links.map(l => html`<li key="${l.h}"><a href="${l.h}" className="text-txt-m text-sm hover:text-white transition-colors" onClick="${(e) => { e.preventDefault(); navigate(l.h); }}">${l.l}</a></li>`)}
                    </ul>
                </div>`)}
            </div>
            <div className="mt-10 pt-6 border-t border-bdr flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p className="text-txt-m text-xs">Disclaimer: This is a demo frontend interface. Content availability depends on configured third-party streaming sources.</p>
                <p className="text-txt-m text-xs">${new Date().getFullYear()} VidsRcprime. All rights reserved.</p>
            </div>
        </div>
    </footer>`;
}

// ============================================================
// MOVIE CARD
// ============================================================
const MovieCard = memo(function MovieCard({ item, type, onRemove }) {
    const { navigate } = useRouter();
    const { isFav, toggleFav } = useApp();
    const { addToast } = useToast();
    const t = type || (item.media_type === 'tv' ? 'tv' : 'movie');
    const title = getTitle(item);
    const yr = getYear(item);
    const rating = getRating(item);
    const fav = isFav(item.id, t);

    const handleClick = () => {
        const slug = slugify(title);
        if (t === 'tv') navigate(`/tv/${item.id}-${slug}`);
        else navigate(`/movie/${item.id}-${slug}`);
    };
    const handleFav = (e) => {
        e.stopPropagation();
        toggleFav({ ...item, media_type: t });
        addToast(fav ? 'Removed from favorites' : 'Added to favorites', 'success');
    };
    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove) onRemove();
    };

    return html`<div className="relative group cursor-pointer card-hover" onClick="${handleClick}" role="button" tabIndex="0" aria-label="${`Watch ${title}`}" onKeyDown="${(e) => { if (e.key === 'Enter') handleClick(); }}">
        <div className="relative overflow-hidden rounded-lg">
            <${PosterImg} src="${posterImg(item.poster_path || item.poster)}" alt="${title}" className="w-full"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            <div className="absolute top-2 left-2">
                <span className="${`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${t === 'tv' ? 'bg-blue-600/90' : 'bg-accent/90'}`}">${t === 'tv' ? 'TV' : 'Movie'}</span>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                ${onRemove
                    ? html`<button onClick="${handleRemove}" className="w-7 h-7 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="Remove"><${Icon} name="trash" size="12"/></button>`
                    : html`<button onClick="${handleFav}" className="${`w-7 h-7 rounded-full bg-black/70 flex items-center justify-center hover:bg-accent transition-colors ${fav ? 'text-accent' : 'text-white'}`}" aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}"><${Icon} name="heart" size="12" fill="${fav ? 'currentColor' : 'none'}"/></button>`}
            </div>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <${RatingBadge} value="${rating}"/>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center shadow-lg"><${Icon} name="play" size="20" fill="white" stroke="none"/></div>
            </div>
        </div>
        <div className="mt-2 px-0.5">
            <p className="text-sm font-medium text-white truncate">${title}</p>
            <p className="text-xs text-txt-m mt-0.5">${yr}</p>
        </div>
    </div>`;
});

// ============================================================
// SECTION (horizontal scroll row)
// ============================================================
function Section({ title, items, renderCard, seeAllHref, navigate }) {
    const scrollRef = useRef(null);
    const [canL, setCanL] = useState(false);
    const [canR, setCanR] = useState(true);
    const dragRef = useRef({ dragging: false, startX: 0, scrollL: 0 });

    const checkScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanL(scrollLeft > 10);
        setCanR(scrollLeft < scrollWidth - clientWidth - 10);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll, { passive: true });
            checkScroll();
            return () => el.removeEventListener('scroll', checkScroll);
        }
    }, [items, checkScroll]);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    };

    const onMouseDown = (e) => { dragRef.current = { dragging: true, startX: e.pageX, scrollL: scrollRef.current.scrollLeft }; };
    const onMouseMove = (e) => {
        if (!dragRef.current.dragging) return;
        e.preventDefault();
        const dx = e.pageX - dragRef.current.startX;
        scrollRef.current.scrollLeft = dragRef.current.scrollL - dx;
    };
    const onMouseUp = () => { dragRef.current.dragging = false; };

    if (!items || !items.length) return null;

    return html`<section className="mb-8 anim-up">
        <div className="flex items-center justify-between mb-3 px-4 md:px-8 max-w-[1440px] mx-auto">
            <h2 className="font-display text-xl md:text-2xl tracking-wider text-white">${title}</h2>
            ${seeAllHref && html`<button onClick="${() => navigate(seeAllHref)}" className="text-xs text-txt-m hover:text-accent transition-colors font-medium uppercase tracking-wider flex items-center gap-1">See All <${Icon} name="chevron-right" size="14"/></button>`}
        </div>
        <div className="relative max-w-[1440px] mx-auto group/sec">
            ${canL && html`<button onClick="${() => scroll(-1)}" className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-bg to-transparent flex items-center justify-center opacity-0 group-hover/sec:opacity-100 transition-opacity" aria-label="Scroll left"><${Icon} name="chevron-left" size="20"/></button>`}
            ${canR && html`<button onClick="${() => scroll(1)}" className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-bg to-transparent flex items-center justify-center opacity-0 group-hover/sec:opacity-100 transition-opacity" aria-label="Scroll right"><${Icon} name="chevron-right" size="20"/></button>`}
            <div ref="${scrollRef}" className="scroll-row px-4 md:px-8 select-none" onMouseDown="${onMouseDown}" onMouseMove="${onMouseMove}" onMouseUp="${onMouseUp}" onMouseLeave="${onMouseUp}">
                ${items.map((item, i) => renderCard(item, i))}
            </div>
        </div>
    </section>`;
}

// ============================================================
// HERO
// ============================================================
function Hero({ items }) {
    const [idx, setIdx] = useState(0);
    const { navigate } = useRouter();
    const item = items && items[idx];

    useEffect(() => {
        if (!items || items.length <= 1) return;
        const t = setInterval(() => setIdx(p => (p + 1) % items.length), 8000);
        return () => clearInterval(t);
    }, [items]);

    if (!item) return html`<${SkelHero}/>`;
    const bg = backdropImg(item.backdrop_path);
    const t = item.title || item.name;
    const yr = getYear(item);
    const rt = item.runtime ? runtimeStr(item.runtime) : '';
    const genres = (item.genres || []).slice(0, 3).map(g => g.name).join(' / ');
    const type = item.first_air_date ? 'tv' : 'movie';
    const rating = getRating(item);
    const slug = slugify(t);

    return html`<div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden anim-fade" key="${item.id}">
        ${bg && html`<img src="${bg}" alt="" className="absolute inset-0 w-full h-full object-cover"/>`}
        <div className="hero-grad absolute inset-0"/>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 h-full flex items-end pb-16 md:pb-20">
            <div className="max-w-2xl anim-up">
                <div className="flex items-center gap-3 mb-3">
                    ${rating && rating !== '—' && html`<${RatingBadge} value="${rating}" size="md"/>`}
                    <span className="${`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${type === 'tv' ? 'bg-blue-600/80' : 'bg-accent/80'}`}">${type === 'tv' ? 'TV Series' : 'Movie'}</span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-wider text-white leading-[0.95] mb-4">${t}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-txt-s mb-4">
                    ${yr && html`<span className="flex items-center gap-1"><${Icon} name="calendar" size="14"/> ${yr}</span>`}
                    ${rt && html`<span className="flex items-center gap-1"><${Icon} name="clock" size="14"/> ${rt}</span>`}
                    ${genres && html`<span>${genres}</span>`}
                </div>
                <p className="text-txt-s text-sm md:text-base leading-relaxed mb-6 line-clamp-3">${item.overview || 'No description available.'}</p>
                <div className="flex flex-wrap gap-3">
                    <button onClick="${() => navigate(type === 'tv' ? `/tv/${item.id}-${slug}` : `/movie/${item.id}-${slug}`)}" className="btn-accent px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm">
                        <${Icon} name="play" size="16" fill="white" stroke="none"/> Watch Now
                    </button>
                    <button onClick="${() => navigate(type === 'tv' ? `/tv/${item.id}-${slug}` : `/movie/${item.id}-${slug}`)}" className="btn-ghost px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm">
                        <${Icon} name="info" size="16"/> More Info
                    </button>
                </div>
            </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            ${items.map((_, i) => html`<button key="${i}" onClick="${() => setIdx(i)}" className="${`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-accent w-6' : 'bg-white/30 hover:bg-white/50'}`}" aria-label="${`Slide ${i + 1}`}"/>`)}
        </div>
    </div>`;
}

// ============================================================
// TRAILER MODAL
// ============================================================
function TrailerModal({ videoKey, onClose }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);
    if (!videoKey) return null;
    return html`<div className="fixed inset-0 z-[80] flex items-center justify-center p-4 anim-fade" onClick="${onClose}">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"/>
        <div className="relative w-full max-w-4xl z-10" onClick="${(e) => e.stopPropagation()}">
            <button onClick="${onClose}" className="absolute -top-10 right-0 p-2 text-txt-s hover:text-white transition-colors" aria-label="Close trailer"><${Icon} name="x" size="24"/></button>
            <div className="player-wrap rounded-xl overflow-hidden shadow-2xl">
                <iframe src="${`https://www.youtube.com/embed/${videoKey}?autoplay=1`}" allow="autoplay;encrypted-media" allowFullScreen title="Trailer"/>
            </div>
        </div>
    </div>`;
}

// ============================================================
// CAST LIST
// ============================================================
function CastList({ cast }) {
    if (!cast || !cast.length) return null;
    const visible = cast.slice(0, 20);
    return html`<div className="mt-8">
        <h3 className="font-display text-xl tracking-wider mb-4">CAST</h3>
        <div className="scroll-row">
            ${visible.map(c => html`<div key="${c.id}" className="flex-shrink-0 w-[90px] md:w-[100px] text-center group">
                <${PosterImg} src="${profileImg(c.profile_path)}" alt="${c.name}" aspect="1/1" className="w-full rounded-full"/>
                <p className="text-xs font-medium text-white mt-2 truncate">${c.name}</p>
                <p className="text-[10px] text-txt-m truncate">${c.character || ''}</p>
            </div>`)}
        </div>
    </div>`;
}

// ============================================================
// SEASON SELECTOR
// ============================================================
function SeasonSelector({ totalSeasons, selected, onSelect }) {
    if (totalSeasons <= 1) return null;
    const seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);
    return html`<div className="flex flex-wrap gap-2 mt-6">
        ${seasons.map(s => html`<button key="${s}" onClick="${() => onSelect(s)}" className="${`px-4 py-2 rounded-lg text-sm font-medium transition-all ${s === selected ? 'bg-accent text-white' : 'bg-card text-txt-s hover:bg-card-h hover:text-white border border-bdr'}`}">Season ${s}</button>`)}
    </div>`;
}

// ============================================================
// EPISODE LIST
// ============================================================
function EpisodeList({ episodes, showId, seasonNum, navigate, addToContinue, tvSlug }) {
    if (!episodes || !episodes.length) return html`<p className="text-txt-m text-sm mt-4">No episodes available.</p>`;
    return html`<div className="mt-4 flex flex-col gap-2">
        ${episodes.map((ep) => {
            const still = stillImg(ep.still_path);
            const slug = tvSlug || '';
            return html`<div key="${ep.id}" className="ep-card flex gap-4 p-3 rounded-lg border border-bdr cursor-pointer" onClick="${() => { addToContinue({ id: showId, type: 'tv', poster_path: null, name: null, first_air_date: null, season: seasonNum, episode: ep.episode_number }); navigate(`/watch/tv/${showId}-${slug}/${seasonNum}/${ep.episode_number}`); }}">
                <div className="relative w-[160px] sm:w-[200px] flex-shrink-0 rounded overflow-hidden" style="${{ aspectRatio: '16/9' }}">
                    ${still ? html`<img src="${still}" alt="" className="w-full h-full object-cover" loading="lazy"/>` : html`<div className="w-full h-full bg-card flex items-center justify-center"><${Icon} name="tv" size="24" className="text-txt-m"/></div>`}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-accent/90 flex items-center justify-center"><${Icon} name="play" size="16" fill="white" stroke="none"/></div>
                    </div>
                </div>
                <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-txt-m font-medium">E${ep.episode_number}</span>
                        <h4 className="text-sm font-semibold text-white truncate">${ep.name || 'Untitled'}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-txt-m mb-2">
                        ${ep.air_date && html`<span>${formatDate(ep.air_date)}</span>`}
                        ${ep.runtime && html`<span>${ep.runtime}m</span>`}
                        ${ep.vote_average && ep.vote_average > 0 && html`<${RatingBadge} value="${ep.vote_average.toFixed(1)}"/>`}
                    </div>
                    <p className="text-xs text-txt-s line-clamp-2 leading-relaxed">${ep.overview || 'No description available.'}</p>
                </div>
            </div>`;
        })}
    </div>`;
}

// ============================================================
// SEARCH BAR
// ============================================================
function SearchBar({ value, onChange, placeholder = 'Search movies and TV shows...' }) {
    return html`<div className="relative max-w-2xl mx-auto">
        <${Icon} name="search" size="20" className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-m"/>
        <input type="text" value="${value}" onInput="${(e) => onChange(e.target.value)}" placeholder="${placeholder}" className="w-full pl-12 pr-4 py-4 bg-card border border-bdr rounded-xl text-white placeholder:text-txt-m focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-base transition-all" aria-label="Search"/>
        ${value && html`<button onClick="${() => onChange('')}" className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-m hover:text-white transition-colors" aria-label="Clear search"><${Icon} name="x" size="18"/></button>`}
    </div>`;
}


// ============================================================
// AD BANNER — floating banner with close button
// ============================================================
function AdBanner({ position = 'bottom' }) {
    const [visible, setVisible] = useState(true);
    const containerRef = useRef(null);
    const adKey = useRef(`ad-${Date.now()}-${Math.random().toString(36).slice(2)}`);

    useEffect(() => {
        if (!visible || !containerRef.current) return;

        const container = containerRef.current;
        const id = adKey.current;
        container.id = id;

        // Clean up previous ad script if any (from a previous mount)
        container.innerHTML = '';

        // Injects atOptions + ad script in the right order
        try {
            // 1. atOptions must be defined BEFORE the ad script loads
            const optsScript = document.createElement('script');
            optsScript.type = 'text/javascript';
            optsScript.text = `
                window.atOptions = {
                    'key': '${AD_CONFIG.key}',
                    'format': '${AD_CONFIG.format}',
                    'height': ${AD_CONFIG.height},
                    'width': ${AD_CONFIG.width},
                    'params': {}
                };
            `;
            document.body.appendChild(optsScript);

            // 2. Load the ad script (it reads window.atOptions)
            const adScript = document.createElement('script');
            adScript.type = 'text/javascript';
            adScript.src = AD_CONFIG.src;
            adScript.async = true;
            adScript.onerror = () => {
                console.warn('[AdBanner] Failed to load ad script');
            };
            document.body.appendChild(adScript);

            return () => {
                // Cleanup on unmount
                try { document.body.removeChild(optsScript); } catch {}
                try { document.body.removeChild(adScript); } catch {}
                try { delete window.atOptions; } catch {}
            };
        } catch (err) {
            console.warn('[AdBanner] Error:', err);
        }
    }, [visible]);

    if (!visible) return null;

    const positionStyle = position === 'bottom'
        ? { bottom: 16, left: '50%', transform: 'translateX(-50%)' }
        : { top: 60, left: '50%', transform: 'translateX(-50%)' };

    return html`
        <div
            className="fixed z-[9999] flex items-start"
            style="${{
                ...positionStyle,
                gap: 0,
                filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))',
            }}"
        >
            <div style="${{ position: 'relative', background: '#000', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}">
                {/* Ad container — the ad script renders inside this */}
                <div
                    ref="${containerRef}"
                    style="${{
                        width: AD_CONFIG.width,
                        height: AD_CONFIG.height,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#111',
                    }}"
                >
                    <span style="${{ color: '#666', fontSize: 11 }}">Loading ad...</span>
                </div>
                {/* Close button — top right corner */}
                <button
                    onClick="${() => setVisible(false)}"
                    aria-label="Close ad"
                    style="${{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'rgba(220,38,38,0.95)',
                        color: '#fff',
                        border: '2px solid #000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1,
                        padding: 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        transition: 'transform 0.15s',
                    }}"
                    onMouseEnter="${(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}"
                    onMouseLeave="${(e) => { e.currentTarget.style.transform = 'scale(1)'; }}"
                >
                    ×
                </button>
            </div>
        </div>
    `;
}

// ============================================================
// SITE AD — Responsive banner for main website pages
// ============================================================
function SiteAd() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loaded, setLoaded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const container = containerRef.current;
        const config = isMobile ? SITE_ADS.mobile : SITE_ADS.desktop;
        
        container.innerHTML = '';
        setLoaded(false);

        try {
            // 1. Define window.atOptions
            const optsScript = document.createElement('script');
            optsScript.type = 'text/javascript';
            optsScript.text = `
                window.atOptions = {
                    'key': '${config.key}',
                    'format': '${config.format}',
                    'height': ${config.height},
                    'width': ${config.width},
                    'params': {}
                };
            `;
            document.head.appendChild(optsScript);

            // 2. Load the ad script
            const adScript = document.createElement('script');
            adScript.type = 'text/javascript';
            adScript.src = config.src;
            adScript.async = true;
            
            adScript.onload = () => {
                setTimeout(() => {
                    if (container.querySelector('iframe, img, ins')) {
                        setLoaded(true);
                    }
                }, 500);
            };

            document.head.appendChild(adScript);

            return () => {
                try { optsScript.remove(); } catch {}
                try { adScript.remove(); } catch {}
                try { delete window.atOptions; } catch {}
            };
        } catch (err) {
            console.warn('[SiteAd] Error:', err);
        }
    }, [isMobile]);

    const config = isMobile ? SITE_ADS.mobile : SITE_ADS.desktop;

    return html`
        <div className="flex flex-col items-center justify-center my-8 w-full overflow-hidden">
            <span className="text-[10px] text-txt-m uppercase tracking-widest mb-2">Advertisement</span>
            <div 
                className="relative bg-bg-s border border-bdr rounded-lg overflow-hidden flex items-center justify-center"
                style="${{
                    width: config.width + 'px',
                    height: config.height + 'px',
                    maxWidth: '100%'
                }}"
            >
                <div 
                    ref="${containerRef}" 
                    style="${{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: loaded ? 'transparent' : '#171717',
                    }}"
                >
                    ${!loaded && html`<span className="text-txt-m text-xs animate-pulse">Loading ad...</span>`}
                </div>
            </div>
        </div>
    `;
}