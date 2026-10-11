export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // 1. If path has a file extension (js, css, png, jpg, woff, etc.), serve it directly
        //    If it 404s, that's a real 404 (don't fallback to index.html)
        if (/\.[a-zA-Z0-9]+$/.test(path)) {
            return env.ASSETS.fetch(request);
        }

        // 2. For extensionless paths (/movies, /embed/movie/969681, /tv/1396),
        //    try the real path first (unlikely to match, but just in case)
        let response = await env.ASSETS.fetch(request);

        // 3. If it 404s, serve index.html content WITHOUT redirecting
        if (response.status === 404) {
            const indexRequest = new Request(new URL('/index.html', url.origin), request);
            response = await env.ASSETS.fetch(indexRequest);
        }

        return response;
    }
};