module.exports = {
    publicPath: './',
    devServer: {
        port: 8085,
        proxy: {
            '/*': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true
            }
        }
    }
}