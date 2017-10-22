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
        cwd: 'dist',
        to: 'remote_dir',
        start: '开始上传',
        end: '上传成功',
        ext: []
    })
    //...
]
</pre>