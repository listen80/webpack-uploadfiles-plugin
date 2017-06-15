# webpack-uploadfiles-plugin


##Usage
in your webpack.config.js

var webpack-uploadfiles-plugin = require('webpack-uploadfiles-plugin');

<pre>
plugins: [
        new webpack-uploadfiles-plugin({
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