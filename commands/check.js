var
  async = require('async'),
  program = require('commander'),
  request = require('request');

module.exports = function (provider, owner, repo, sha) {
  var token = program.repoToken || process.env.BITHOUND_REPO_TOKEN;
  var args = [provider, owner, repo, sha];
  var stillRunning;

  if (token) args.push(token);

  var requestOpts = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'cli.bithound.io'
    },
    type: 'GET',
    url: process.env.BITHOUND_API + '/api/check/' + args.join('/')
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

    process.exit(body.failing);
  });
};
