// ============================================================
// REACT ALIASES (declared here once, used everywhere below)
// ============================================================
const { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext, memo, Fragment } = React;
const html = htm.bind(React.createElement);

// ============================================================
// ICON PATHS
// ============================================================
const ICON_PATHS = {
    search: ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'],
    menu: ['M3 12h18', 'M3 6h18', 'M3 18h18'],
    x: ['M18 6L6 18', 'M6 6l12 12'],
    play: ['M5 3l14 9-14 9V3z'],
    'chevron-left': ['M15 19l-7-7 7-7'],
    'chevron-right': ['M9 5l7 7-7 7'],
    star: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
    heart: ['M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'],
    home: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
    film: ['M7 4v16', 'M17 4v16', 'M3 8h4m6 0h4m-4 8h4M3 16h4', 'M3 12h18', 'M3 4h18v16H3z'],
    tv: ['M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z', 'M2 8h20', 'M8 2v4', 'M16 2v4'],
    grid: ['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    clock: ['M12 6v6l4 2', 'M12 2a10 10 0 100 20 10 10 0 000-20z'],
    info: ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M12 16v-4', 'M12 8h.01'],
    'arrow-left': ['M19 12H5', 'M12 19l-7-7 7-7'],
    'arrow-right': ['M5 12h14', 'M12 5l7 7-7 7'],
    alert: ['M12 9v4', 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'],
    loader: ['M12 2v4', 'M12 18v4', 'M4.93 4.93l2.83 2.83', 'M16.24 16.24l2.83 2.83', 'M2 12h4', 'M18 12h4', 'M4.93 19.07l2.83-2.83', 'M16.24 7.76l2.83-2.83'],
    trending: ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
    calendar: ['M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
    users: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'],
    eye: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
    filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
    check: ['M20 6L9 17l-5-5'],
    bookmark: ['M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z'],
    trash: ['M3 6h18', 'M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6', 'M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2'],
    external: ['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', 'M15 3h6v6', 'M10 14L21 3'],
    server: ['M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9'],
};

// ============================================================
// ICON COMPONENT
// ============================================================
function Icon({ name, size = 20, className = '', fill = 'none', stroke = 'currentColor', strokeWidth = 2 }) {
    const paths = ICON_PATHS[name] || [];
    return html`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" strokeWidth="${strokeWidth}" strokeLinecap="round" strokeLinejoin="round" className="${className}" aria-hidden="true">
        ${paths.map((d, i) => html`<path key="${i}" d="${d}"/>`)}
    </svg>`;
}