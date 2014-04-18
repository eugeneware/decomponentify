var fs = require('fs');
var path = require('path');

var through = require('through');
var falafel = require('falafel');

module.exports = function (file) {
  if (!/\.js$/.test(file)) return through();
  var data = '';

  var tr = through(write, end);
  return tr;

  function write (buf) { data += buf; }
  function end () {
    var output;
    try { output = parse(); }
    catch (err) {
      this.emit('error', new Error(
        err.toString().replace('Error: ', '') + ' (' + file + ')')
      );
    }

    finish(output);
  }

  function finish (output) {
    tr.queue(String(output));
    tr.queue(null);
  }

  function parse () {
    var output = data;
    if (/^require\.modules \=/m.test(output) &&
        /^require\.aliases \=/m.test(output) &&
        /^require\.resolve \=/m.test(output)) {
      output = falafel(output, function (node) {
        if (node.type === 'Identifier' && node.name === 'require') {
          node.update('_require');
        }
      }).toString();
      output = falafel(output, function (node) {
        if (node.type === 'Identifier' && node.name === '_require' && node.parent.type === 'FunctionDeclaration') {
          node.parent.update(node.parent.source() + ';__require = _require;');
        }
      }).toString();
      output = 'var __require = null;' + output + 'module.exports = __require;';
    }
    return output;
  }
};
