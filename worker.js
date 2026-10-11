export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 1. Serve real files (has extension) directly — no fallback
        if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
            return env.ASSETS.fetch(request);
        }

        // 2. For everything else (extensionless path), serve index.html
        //    WITHOUT redirecting, keep the URL intact
        const indexRequest = new Request(new URL('/index.html', url.origin), request);
        return env.ASSETS.fetch(indexRequest);
    }
};