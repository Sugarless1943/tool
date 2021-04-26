module.exports = {
    publicPath: './',
    devServer: {
        port: 8085,
        proxy: {
            '/*': {
                target: 'http://192.168.1.59:8080',
                changeOrigin: true
            }
        }
    }
}