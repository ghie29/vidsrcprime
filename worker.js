export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // 1. Requests for real files (has extension) → serve them directly
        //    If the file doesn't exist, return 404 (do NOT fallback to index.html)
        if (/\.[a-zA-Z0-9]+$/.test(path)) {
            return env.ASSETS.fetch(request);
        }

        // 2. For extensionless paths (/movies, /embed/movie/969681),
        //    serve index.html while keeping the URL intact
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        return env.ASSETS.fetch(indexRequest);
    }
};