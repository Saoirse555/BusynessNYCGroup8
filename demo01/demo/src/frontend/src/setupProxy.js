const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api/getevents?key=5fcac6b5dc2c4372a0416f46929d4cc1&format=json',
        createProxyMiddleware({
            target: 'https://511ny.org',
            changeOrigin: true
        })
    );

    app.use(
        '/api/v1',
        createProxyMiddleware({
            target: 'http://localhost:8080/',
            changeOrigin: true
        })
    );
};
