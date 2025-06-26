// 引入 scp2 模块，用于实现文件的 SCP 传输
var scp2 = require('scp2');
// 引入 path 模块，用于处理文件路径
var path = require('path');
// 引入 fs 模块，用于文件系统操作
var fs = require('fs');
// 引入 colors 模块，用于控制台输出带颜色的文本
require('colors');

/**
 * scpFile 构造函数，用于初始化 SCP 传输配置
 * @param {Object} opt - 配置对象，包含端口、主机、用户名、密码等信息
 */
function scpFile(opt) {
	// 将配置对象的属性合并到当前实例
	Object.assign(this, opt);
	// 保存当前实例的引用
	var _this = this;
	// 初始化缓存对象
	_this.cache = {}

	// 设置 scp2 的默认配置
	scp2.defaults({
		port: _this.port,
		host: _this.host,
		username: _this.username,
		password: _this.password
	});
}

/**
 * 执行 SFTP 文件传输的方法
 */
scpFile.prototype.sftp = function () {
	/**
	 * 获取指定目录下符合扩展名要求的所有文件
	 * @param {string} dir - 要遍历的目录路径
	 * @param {Array} ext - 允许的文件扩展名数组
	 * @returns {Array} - 符合条件的文件路径数组
	 */
	function getFile(dir, ext) {
		// 用于存储符合条件的文件路径
		var arr = [];

		/**
		 * 递归遍历目录，查找符合条件的文件
		 * @param {string} dir - 当前要遍历的目录或文件路径
		 */
		function recursionGetFile(dir) {
			// 获取文件或目录的状态信息
			var stat = fs.statSync(dir);
			if (stat.isFile()) {
				// 如果是文件，检查扩展名是否符合要求
				if (ext.length && ext.indexOf(path.extname(dir)) === -1) {
					// 扩展名不符合要求，不添加到数组中
					// arr.push(dir)
				} else {
					// 扩展名符合要求，添加到数组中
					arr.push(dir)
				}
			} else if (stat.isDirectory()) {
				// 如果是目录，递归遍历其下的所有文件和子目录
				fs.readdirSync(dir).forEach(function (v) {
					recursionGetFile(path.join(dir, v));
				});
			} else {
				// 既不是文件也不是目录，输出提示信息
				console.log('not file or path');
			}
		}

		// 检查目录是否存在
		if (fs.existsSync(dir)) {
			// 存在则开始递归遍历
			recursionGetFile(dir);
		} else {
			// 不存在则输出提示信息
			console.log('not exist' + dir);
		}

		return arr;
	}

	/**
	 * 递归上传文件的函数
	 * @param {number} i - 当前要上传的文件索引
	 */
	function upload(i) {
		if (filesArr[i]) {
			// 如果还有文件需要上传，输出当前上传进度
			console.log('\n' + (i + 1) + '/' + all + ': ' + filesArr[i]);
			// 计算文件上传的目标路径
			var dist = path.join(_this.to, path.relative(cwd, filesArr[i]));

			// 检查缓存中是否已存在该文件的上传记录，若存在则跳过该文件的上传
			if (_this.cache[filesArr[i]]) {
				console.log('文件 ' + filesArr[i] + ' 已存在于缓存中，跳过上传'.yellow);
				upload(i + 1);
				return;
			}
			// 执行文件上传操作
			scp2.upload(filesArr[i], dist, function (err) {
				if (err) {
					// 上传失败，输出错误信息
					console.error(err);
				} else {
					// 上传成功，输出成功信息并递归上传下一个文件
					var log = 'ok!'.green;
					// 将上传成功的文件路径添加到缓存中
					_this.cache[filesArr[i]] = true;
					console.log(log + ':' + dist);
					upload(i + 1);
				}
			});
		} else {
			// 所有文件上传完成，关闭连接
			scp2.close();
			// 根据上传文件数量输出不同的完成信息
			var log = i === 0 ? '\nNone: done'.red : ('\nAll: done').green;
			// 获取当前时间并设置颜色
			var time = new Date().toLocaleString().red;
			// 输出完成信息和时间
			console.log(log + '@' + time);
			// 如果有结束提示信息，则输出
			_this.end && console.log(_this.end.green)
		}
	}
	// 如果有开始提示信息，则输出
	_this.start && console.log(_this.start.yellow)

	// 保存当前实例的引用
	var _this = this;
	// 获取允许的文件扩展名，默认为空数组
	var ext = _this.ext || [];

	// 获取要上传的文件列表
	var filesArr = getFile(_this.from, ext);
	// 获取文件总数
	var all = filesArr.length;
	// 获取当前工作目录
	var cwd = _this.cwd;

	// 开始上传第一个文件
	upload(0);
}

/**
 * 应用插件到 webpack 编译器的方法
 * @param {Object} compiler - webpack 编译器实例
 */
scpFile.prototype.apply = function (compiler) {
	// 保存当前实例的引用
	var _this = this;
	// 在 webpack 编译完成后执行文件上传操作
	compiler.plugin("done", function (compilation) {
		_this.sftp();
	});
}

// 导出 scpFile 构造函数
module.exports = scpFile;