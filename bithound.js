var program = require('commander');

program
  .version(require('./package.json').version)
  .option('--repo-token [token]', 'Unique token for private repository (provided by bitHound)')
  .option('--branch [branch]', 'An optional branch argument. If not provided, the command will attempt to discover it through an env variable');

program
  .command('check [url] [sha]')
  .description('Check if a sha passes bitHound analysis')
  .action(require('./commands/check'));

program.parse(process.argv);
