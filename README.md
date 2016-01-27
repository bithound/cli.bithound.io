# bitHound

[![NPM version][npm-image]][npm-url]
[![bitHound Overall Score](https://www.bithound.io/projects/badges/f907f2c0-bfbd-11e5-b2ad-73729a2991e3/score.svg)](https://www.bithound.io/github/bithound/cli.bithound.io)
[![bitHound Dependencies](https://www.bithound.io/projects/badges/f907f2c0-bfbd-11e5-b2ad-73729a2991e3/dependencies.svg)](https://www.bithound.io/github/bithound/cli.bithound.io/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/projects/badges/f907f2c0-bfbd-11e5-b2ad-73729a2991e3/devDependencies.svg)](https://www.bithound.io/github/bithound/cli.bithound.io/master/dependencies/npm)

## Alpha Pre-release

This command line tool is currently in a closed alpha preview.  If you would like to try it out get in touch with Gord at gord@bithound.io

## Installation:
Add the latest version of `bithound` to your package.json:
```
npm install bithound --save-dev
```

# Usage:

```
  Usage: bithound [options] [command]


  Commands:

    check [url]  Check if a sha passes bitHound analysis

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    --repo-token [token]  Unique token for private repository (provided by bitHound)
    --branch [branch]     An optional branch argument. If not provided, the command will attempt to discover it through an env variable
    --sha [sha]           An optional commit sha argument. If not provided, the command will attempt to discover it through an env variable
```

[npm-url]: https://npmjs.org/package/bithound
[npm-image]: https://img.shields.io/npm/v/bithound.svg

