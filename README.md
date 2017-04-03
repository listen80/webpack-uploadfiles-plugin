# webpack-uploadfiles-plugin


##Usage
<pre>
plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                screw_ie8: false
            },
            output: {
                screw_ie8: false //支持IE8
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new sftp({
            port: 'port',
            host: 'host',
            username: 'username',
            password: 'password',
            from: 'dist',
            to: 'remote_dir',
            msg: 'what you say!'
        })
    ]
</pre>