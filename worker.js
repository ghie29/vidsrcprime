export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
            return env.ASSETS.fetch(request);
        }
        let response = await env.ASSETS.fetch(request);
        if (response.status === 404) {
            const indexRequest = new Request(new URL('/index.html', url.origin), request);
            response = await env.ASSETS.fetch(indexRequest);
        }
        return response;
    }
};