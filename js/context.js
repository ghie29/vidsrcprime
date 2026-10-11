// ============================================================
// TOAST CONTEXT
// ============================================================
const ToastCtx = createContext(null);

function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((msg, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(p => [...p, { id, msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    }, []);
    return html`<${ToastCtx.Provider} value="${{ addToast }}">
        ${children}
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" role="status" aria-live="polite">
            ${toasts.map(t => html`<div key="${t.id}" className="${`toast-in pointer-events-auto px-4 py-3 rounded-lg text-sm font-medium shadow-xl ${t.type === 'success' ? 'bg-green-600' : 'bg-card border border-bdr'}`}">${t.msg}</div>`)}
        </div>
    <//>`;
}
function useToast() { return useContext(ToastCtx); }

// ============================================================
// APP CONTEXT
// ============================================================
const AppCtx = createContext(null);

function AppProvider({ children }) {
    const [favs, setFavs] = useState(() => LS.get('cine_favs', []));
    const [contW, setContW] = useState(() => LS.get('cine_continue', []));
    const [server, setServer] = useState(() => LS.get('cine_server', DEFAULT_SERVER));

    useEffect(() => { LS.set('cine_favs', favs); }, [favs]);
    useEffect(() => { LS.set('cine_continue', contW); }, [contW]);
    useEffect(() => { LS.set('cine_server', server); }, [server]);

    const toggleFav = useCallback((item) => {
        setFavs(p => {
            const exists = p.find(f => f.id === item.id && f.type === item.type);
            if (exists) return p.filter(f => !(f.id === item.id && f.type === item.type));
            return [...p, { id: item.id, type: item.type, title: getTitle(item), poster: item.poster_path, year: getYear(item) }];
        });
    }, []);
    const isFav = useCallback((id, type) => favs.some(f => f.id === id && f.type === type), [favs]);

    const addToContinue = useCallback((item) => {
        setContW(p => {
            const filtered = p.filter(c => !(c.id === item.id && c.type === item.type && (c.type !== 'tv' || (c.season === item.season && c.episode === item.episode))));
            const entry = {
                id: item.id,
                type: item.type,
                title: getTitle(item),
                poster: item.poster_path,
                year: getYear(item),
                season: item.season || null,
                episode: item.episode || null,
                ts: Date.now()
            };
            if (item.title) entry.title = item.title;
            if (item.name) entry.title = item.name;
            return [entry, ...filtered].slice(0, 20);
        });
    }, []);
    const removeFromContinue = useCallback((id, type, season, episode) => {
        setContW(p => p.filter(c => !(c.id === id && c.type === type && (type !== 'tv' || (c.season == season && c.episode == episode)))));
    }, []);

    return html`<${AppCtx.Provider} value="${{ favs, toggleFav, isFav, contW, addToContinue, removeFromContinue, server, setServer }}">${children}<//>`;
}
function useApp() { return useContext(AppCtx); }