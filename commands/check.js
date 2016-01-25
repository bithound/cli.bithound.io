var
  async = require('async'),
  program = require('commander'),
  request = require('request');

function parse(url) {
  if (!url) { return null; }

  var match = url.match(/github.com[:\/](.*)\/(.*)/) ||
    url.match(/bitbucket.org[:\/](.*)\/(.*)/);

  if (!match) { return null; }

  return {
    url: url,
    owner: match[1],
    name: match[2].replace(/\.git$/, ''),
    provider: match[0].substring(0, match[0].indexOf('.'))
  };
}

function getBranch() {
  var branch = program.branch;

  if (branch) return branch;

  if (process.env.TRAVIS) {
    branch = process.env.TRAVIS_BRANCH;
  } else if (process.env.JENKINS_URL) {
    branch = process.env.GIT_BRANCH;
  } else if (process.env.CIRCLECI) {
    branch = process.env.CIRCLE_BRANCH;
  } else if (process.env.CI_NAME && process.env.CI_NAME === 'codeship') {
    branch = process.env.CI_BRANCH;
  } else if (process.env.WERCKER) {
    branch = process.env.WERCKER_GIT_BRANCH;
  }

  return branch;
}

module.exports = function (url, sha) {
  var path = (process.env.BITHOUND_HOST || 'https://localhost:8443') + '/api/check/';
  var repo = parse(url);
  var branch = getBranch();
  var stillRunning;

  if (!branch) {
    process.stderr.write('Branch could not be determined.');
    return process.exit(1);
  }

  if (!repo) path += [url, branch, sha].join('/'); //They provided a repo token as first arg
  else path += [repo.provider, repo.owner, repo.name, branch, sha].join('/');

  var requestOpts = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'cli.bithound.io'
    },
    type: 'GET',
    url: path
  };
  async.doWhilst(function (done) {
    request(requestOpts, function (err, res, body) {
      var proceed = function () {
        done(err, res.statusCode, body);
      };

      if (err) return done(err);
      if (res.statusCode !== 200) {
        if (res.statusCode === 401) return done(new Error('Authorization failed. Invalid repo token.'));
        if (res.statusCode === 403) return done(new Error('Not permitted.'));
        if (res.statusCode === 404) return done(new Error('Repo not found.'));
        if (res.statusCode === 400) return done(new Error('Invalid request.'));
        
        return done(new Error('Internal server error.'));
      }

      body = JSON.parse(body);

      stillRunning = !body.complete;

      if (body.complete) proceed();
      else setTimeout(proceed, 3000); //Poll for sha status every 3 seconds
    });
  }, function () {
    return stillRunning;
  }, function (err, status, body) {
    if (err) {
      process.stderr.write(err.message);
      return process.exit(1);
    }

    if (body.failing) process.stderr.write(body.message);

    process.exit(body.failing);
  });
};
