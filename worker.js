export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 1. If the URL looks like a real file (has an extension), serve it directly.
        //    This prevents the SPA fallback from hijacking .js/.css/.png files.
        if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
            return env.ASSETS.fetch(request);
        }

        // 2. Try the real request first.
        let response = await env.ASSETS.fetch(request);

        // 3. If it 404s, serve index.html instead (SPA fallback).
        if (response.status === 404) {
            const indexRequest = new Request(new URL('/index.html', url.origin), request);
            response = await env.ASSETS.fetch(indexRequest);
        }

        return response;
    }
};