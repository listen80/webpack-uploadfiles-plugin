let scp2 = require('scp2');
let colors = require('colors');
let path = require('path');
let fs = require('fs');

function sftpFile(opt) {
	this.from = opt.from;
	this.to = opt.to;
	this.port = opt.port;
	this.host = opt.host;
	this.username = opt.username;
	this.password = opt.password;
	this.done = opt.done;
	this.msg = opt.msg || '';
}

sftpFile.prototype.sftp = function() {
	var _this = this;

	scp2.defaults({
		port: _this.port,
		host: _this.host,
		username: _this.username,
		password: _this.password
	});

	function getFile(dir) {
		var arr = [];

		function recursion(dir) {
			fs.readdirSync(dir).forEach(function(v) {
				var t = path.join(dir, v);
				var stat = fs.statSync(t);
				if (stat.isFile()) {
					arr.push(t);
				} else if (stat.isDirectory()) {
					recursion(t);
				} else {
					console.log('error');
				}
			});
		}

		if (fs.existsSync(dir)) {
			var stat = fs.statSync(dir);
			console.log(1)
			if (stat.isFile()) {
				arr.push(dir)
			} else if (stat.isDirectory()) {
				recursion(dir);
			} else {
				console.log('not file or path');
			}
		} else {
			console.log('not exist' + dir);
		}

		return arr;
	}

	var filesArr = getFile(_this.from);

	function upload(i) {
		if (filesArr[i]) {
			scp2.upload(filesArr[i], path.join(_this.to, filesArr[i]), function(err) {
				if (err) {
					console.error(err);
				} else {
					if (i === 0) {
						console.log('\n' + _this.msg.magenta);
						console.log('start uploading to '.cyan + _this.host.yellow)
					}
					let log = path.basename(filesArr[i]).white + ' ok!'.green;
					console.log(log);
					upload(i + 1);
				}
			});
		} else {
			scp2.close();
			let log = i === 0 ? '\nnone is uploaded'.red : ('all done').green;
			let d = new Date;
			let time = ' @' + new Date().toLocaleString();
			console.log(log + time.red);
			_this.done && _this.done();
		}
	}

	upload(0);
}

sftpFile.prototype.apply = function(compiler) {
	var _this = this;
	compiler.plugin("done", function(compilation) {
		_this.sftp();
	});
}

module.exports = sftpFile;