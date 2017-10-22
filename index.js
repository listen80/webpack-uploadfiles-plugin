var scp2 = require('scp2');
var colors = require('colors');
var path = require('path');
var fs = require('fs');

function scpFile(opt) {
	Object.assign(this, opt);
	var _this = this;

	scp2.defaults({
		port: _this.port,
		host: _this.host,
		username: _this.username,
		password: _this.password
	});
}

scpFile.prototype.sftp = function() {
	var _this = this;
	var ext = _this.ext || [];
	function getFile(dir) {
		var arr = [];

		function recursion(dir) {
			var stat = fs.statSync(dir);
			if (stat.isFile()) {
				if(ext.length && ext.indexOf(path.extname(dir)) === -1) {
					// arr.push(dir)
				} else {
					arr.push(dir)
				}
			} else if (stat.isDirectory()) {
				fs.readdirSync(dir).forEach(function(v) {
					recursion(path.join(dir, v));
				});
			} else {
				console.log('not file or path');
			}
		}

		if (fs.existsSync(dir)) {
			recursion(dir);
		} else {
			console.log('not exist' + dir);
		}

		return arr;
	}

	var filesArr = getFile(_this.from);
	var all = filesArr.length;
	var cwd = _this.cwd;
	function upload(i) {
		if (filesArr[i]) {
			console.log('\n' + (i + 1) + '/' + all + ': ' + filesArr[i]);
			var dist = path.join(_this.to, path.relative(cwd, filesArr[i]));
			scp2.upload(filesArr[i], dist, function(err) {
				if (err) {
					console.error(err);
				} else {
					var log = 'ok!'.green;
					console.log(log + ':' + dist);
					upload(i + 1);
				}
			});
		} else {
			scp2.close();
			var log = i === 0 ? '\nNone: done'.red : ('\nAll: done').green;
			var time = new Date().toLocaleString().red;
			console.log(log + '@' + time);
			_this.end && console.log(_this.end.green)
		}
	}
	_this.start && console.log(_this.start.yellow)
	upload(0);
}

scpFile.prototype.apply = function(compiler) {
	var _this = this;
	compiler.plugin("done", function(compilation) {
		_this.sftp();
	});
}

module.exports = scpFile;