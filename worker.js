export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 1. Real files (with extensions) → serve directly, no fallback
        if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
            return env.ASSETS.fetch(request);
        }

        // 2. Try the real request first
        let response = await env.ASSETS.fetch(request);

        // 3. If 404 → serve index.html WITHOUT redirecting
        if (response.status === 404) {
            const indexRequest = new Request(new URL('/index.html', url.origin), request);
            response = await env.ASSETS.fetch(indexRequest);
        }

        return response;
    }
};