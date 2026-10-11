export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 1. Real files (has extension) -> ask ASSETS
        if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
            return env.ASSETS.fetch(request);
        }

        // 2. Everything else -> serve index.html directly
        //    DO NOT ask ASSETS for the original path (it would 307 redirect)
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        return env.ASSETS.fetch(indexRequest);
    }
};