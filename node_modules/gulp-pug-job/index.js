'use strict';

var through = require('through2');
var path = require('path');
var eol = require('os').EOL;
var gutil = require('gulp-util');
var _ = require('underscore');
var pluginName;
var wrap = require('pug-runtime/wrap');

pluginName = 'gulp-job';

function job(options) {
  _.extend(job.prototype.settings, options || {});

  return through.obj(job.prototype.funnel);
}

job.prototype.pre = function (methodName) {
  var parent = this.settings.parent,
      namespace = this.settings.namespace,
      text;

  text = '(function (' + parent + ') {' + eol +
  parent + '.' + namespace + ' = ' + parent + '.' + namespace + ' || {};' + eol +
  parent + '.' + namespace + '.' + methodName + ' = ';

  return new Buffer(text);
};

job.prototype.post = function () {
  var text = '})(' + this.settings.parent + ');' + eol;

  return new Buffer(text);
};

job.prototype.capitalise = function (word) {
  return word.replace(word.charAt(0), function (char) {
    return char.toUpperCase();
  });
};

job.prototype.camel = function (fileName) {
  var chunks;

  if (this.settings.separator) {
    chunks = fileName.split(this.settings.separator);

    fileName = '';

    _.each(chunks, function (chunk, index) {
      fileName += index ? this.capitalise(chunk) : chunk;
    }, this);
  }

  return fileName;
};

job.prototype.getFileName = function (relative) {
  var fileName = relative.split(path.sep).join('-');
  var parts = fileName.split(/\./);
  parts.pop();
  return parts.join('');
};

job.prototype.wrap = function (file) {
  var methodName = this.camel(this.getFileName(file.relative));
  file.contents = Buffer.concat([
    this.pre(methodName),
    new Buffer(wrap(file.contents).toString()),
    this.post()
  ]);
};

job.prototype.funnel = function (file, enc, callback) {
  if (file.isNull()) {
    return;
  }

  if (file.isStream()) {
    this.emit('error', new gutil.PluginError(pluginName, 'Streaming not supported'));
  }

  if (file.isBuffer()) {
    job.prototype.wrap(file);
  }

  this.push(file);

  return callback();

};

job.prototype.settings = {
  parent: 'window',
  namespace: 'templates',
  separator: '-'
};

module.exports = job;
