# webpack-uploadfiles-plugin

`in your webpack.conf.js`


<pre>
var webpackUploadfilesPlugin = require('webpack-uploadfiles-plugin');

plugins: [
    //...
    new webpackUploadfilesPlugin({
        port: 'port',
        host: 'host',
        username: 'username',
        password: 'password',
        from: 'dist',
        to: 'remote_dir',
        msg: 'what you say!'
    })
    //...
]
</pre>