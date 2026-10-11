export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Try to serve the real file first
        let response = await env.ASSETS.fetch(request);

        // If 404 AND it's an extensionless path → fallback to index.html
        if (response.status === 404 && !url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
            const indexRequest = new Request(new URL('/index.html', url.origin), request);
            response = await env.ASSETS.fetch(indexRequest);
        }

        return response;
    }
};