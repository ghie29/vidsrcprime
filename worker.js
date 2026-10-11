export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Try the real asset first
        let response = await env.ASSETS.fetch(request);

        // If it 404s and the path has no file extension, serve index.html (SPA)
        if (response.status === 404 && !url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
            const indexRequest = new Request(new URL('/index.html', url.origin), request);
            response = await env.ASSETS.fetch(indexRequest);
        }

        return response;
    }
};