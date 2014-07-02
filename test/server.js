
var exec = require('child_process').exec;
var express = require('express');
var join = require('path').join;
var write = require('fs').writeFileSync;

/**
 * App.
 */

var app = express()
  .use(rebuild)
  .get('/coverage', coverage)
  .use(express.static(join(__dirname, '..')))
  .use(tests);

/**
 * Listen.
 */

app.listen(process.env.port, function(){
  var file = join(__dirname, 'pid.txt');
  write(file, process.pid);
  console.log();
  console.log('  Testing server running at http://localhost:%s ...', process.env.port);
  console.log();
});

/**
 * Rebuild.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */

function rebuild(req, res, next){
  exec('make', next);
}

/**
 * Coverage reporter.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */

function coverage(req, res, next){
  res.sendfile(join(__dirname, '/coverage.html'));
}

/**
 * Mocha tests.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */

function tests(req, res, next){
  res.sendfile(join(__dirname, '/index.html'));
}
