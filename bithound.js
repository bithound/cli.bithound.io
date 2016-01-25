var program = require('commander');

program
  .version(require('./package.json').version)
  .option('--repo-token [token]', 'Unique token for private repository (provided by bitHound)');

program
  .command('check [url] [sha]')
  .description('Check if a sha passes bitHound analysis')
  .action(require('./commands/check'));

program.parse(process.argv);
