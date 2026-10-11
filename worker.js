export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Serve real files directly (has extension like .js, .css, .png)
        // If they don't exist, return 404 - do NOT fallback to index.html
        if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
            return env.ASSETS.fetch(request);
        }

        // For extensionless paths (/movies, /embed/movie/969681),
        // serve index.html while keeping the URL intact
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        return env.ASSETS.fetch(indexRequest);
    }
};