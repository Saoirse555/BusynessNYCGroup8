const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://511ny.org',
            changeOrigin: true
        })
    );

    // app.use(
    //     '/api/v1/parkingstations',
    //     createProxyMiddleware({
    //         target: 'http://localhost:8080/',
    //         changeOrigin: true
    //     })
    // );

    // app.use(
    //     '/api/v1/prediction',
    //     createProxyMiddleware({
    //         target: 'http://localhost:8080/',
    //         changeOrigin: true
    //     })
    // );
};
