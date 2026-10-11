export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Serve real files (has extension) directly
        if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
            return env.ASSETS.fetch(request);
        }

        // For all extensionless paths, serve index.html directly
        // Never ask ASSETS for the original path (it would 307 to /index.html)
        const indexUrl = new URL('/index.html', url.origin);
        // Preserve query string
        indexUrl.search = url.search;
        const indexRequest = new Request(indexUrl, {
            method: 'GET',
            headers: request.headers
        });
        return env.ASSETS.fetch(indexRequest);
    }
};