# webpack-uploadfiles-plugin
`in your webpack.conf.js`

## 安装
`npm install webpack-uploadfiles-plugin --save-dev`
or
`yarn add webpack-uploadfiles-plugin --dev`
## 说明
此插件用于在 webpack项目`开发过程`中，保存文件后，编译完成时，会自动上传文件到服务器。
同时，支持缓存功能，可避免重复上传相同文件，提高上传效率。
## 配置
```js
var webpackUploadfilesPlugin = require('webpack-uploadfiles-plugin');

module.exports = {
  //...
  plugins: [
    //...
    new webpackUploadfilesPlugin({
      // 服务器地址，需替换为实际值
      host: 'host',
      // 服务器端口号，需替换为实际值
      port: 'port',
      // 登录服务器的用户名，需替换为实际值
      username: 'username',
      // 登录服务器的密码，需替换为实际值
      password: 'password',
      // 本地待上传文件的目录，默认为 dist
      from: 'dist',
      // 当前工作目录，默认为 dist，默认dist下文件集会去除cwd路径到to路径
      cwd: 'dist',
      // 服务器上的远程目录，需替换为实际值
      to: 'remote_dir',
      // 开始上传时的提示信息
      start: '开始上传',
      // 上传成功时的提示信息
      end: '上传成功',
      // 需要上传的文件扩展名列表，空数组表示上传所有文件
      ext: []
    })
    //...
  ]
};
```