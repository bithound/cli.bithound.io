var exec = require('child_process').exec;
var open = require('open');

module.exports = function () {
  exec('git remote show origin', { cwd: __dirname }, function (err, output) {
    if (!match) {
      process.stderr.write('Failed to execute git remote', err);
      return process.exit(1);
    }

    var match = output.match(/(Fetch\ URL:\ git@(github|bitbucket).*:)(.*)(\.git)/);

    if (!match) {
      process.stderr.write('Failed to figure out git origin');
      return process.exit(1);
    }

    var provider = match[2];
    var fullname = match[3];

    var url = ['https://bithound.io', 'settings', provider, fullname, 'integrations'].join('/');

    console.log(url);
    open(url);
    process.exit();
  });
};
