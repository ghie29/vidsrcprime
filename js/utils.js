// ============================================================
// IMAGE HELPERS
// ============================================================
const img = (path, size = 'w500') => path ? `${IMG_BASE}${size}${path}` : null;
const posterImg = (p) => img(p, 'w500');
const backdropImg = (p) => img(p, 'w1280');
const profileImg = (p) => img(p, 'w185');
const stillImg = (p) => img(p, 'w400');

// ============================================================
// LOCAL STORAGE
// ============================================================
const LS = {
    get(k, d = null) {
        try {
            const v = localStorage.getItem(k);
            return v ? JSON.parse(v) : d;
        } catch { return d; }
    },
    set(k, v) {
        try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
    },
    remove(k) {
        try { localStorage.removeItem(k); } catch {}
    }
};

// ============================================================
// FORMATTERS
// ============================================================
function formatDate(d) {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function year(d) {
    if (!d) return '';
    return new Date(d).getFullYear();
}
function runtimeStr(m) {
    if (!m) return '';
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h ? `${h}h ${min}m` : `${min}m`;
}
function debounce(fn, ms) {
    let t;
    return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), ms);
    };
}

// ============================================================
// ITEM HELPERS
// ============================================================
function getTitle(item) { return item.title || item.name || 'Untitled'; }
function getYear(item) { return year(item.release_date || item.first_air_date); }
function getRating(item) { return item.vote_average ? item.vote_average.toFixed(1) : '—'; }

function slugify(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}