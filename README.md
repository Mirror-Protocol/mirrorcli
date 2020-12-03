# mirrorcli <!-- omit in toc -->

Command-line interface for Mirror Protocol on Terra.

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Configuration](#configuration)
  - [Specifying which chain to use [IMPORTANT]](#specifying-which-chain-to-use-important)
- [Usage](#usage)
  - [Execute](#execute)
  - [Query](#query)
- [License](#license)

## Installation

**Requirements**

- Node.js 12+
- NPM
- [`terracli`](https://github.com/terra-project/core) in your path

`mirrorcli` can be installed off NPM.

```bash
$ npm install -g @mirror-protocol/mirrorcli
```

The entrypoint `mirrorcli` should then be available in your `path`:

<pre>
        <div align="left">
        <strong>$ mirrorcli</strong>

        Usage: mirrorcli [options] [command]

        Command-line interface for interacting with Mirror Protocol on Terra

        Options:
          -V, --version   output the version number
          -v,--verbose    Show verbose error logs
          -h, --help      display help for command

        Commands:
          exec|x          Execute a function on a smart contract
          query|q         Run a smart contract query function
          config|c        Access configuration settings
          help [command]  display help for command
        </div>
</pre>

## Configuration

`mirrorcli` will create a configuration file in your home directory: `$HOME/.mirrorclirc.json`.

### Specifying which chain to use [IMPORTANT]

By default, `mirrorcli` will use the `columbus-4` (Terra mainnet) configuration. In order to change the chain, set the `MIRRORCLI_NETWORK` environment variable to the desired chain ID.

For example, to use on the official testnet `tequila-0004`:

```sh
$ MIRRORCLI_NETWORK=tequila-0004 mirrorcli x mint [deposit ...]
```

OR:

```sh
$ export MIRRORCLI_NETWORK=tequila-0004
$ mirrorcli x mint [deposit ...]
```

## Usage

`mirrorcli` allows you to:

- [**execute**](#execute) state-changing functions on Mirror and Terraswap smart contracts
- [**query**](#query) readonly data endpoints on Mirror and Terraswap smart contracts

### Execute

**USAGE: `mirrorcli exec|x [options] [command]`**

```
Execute a function on a smart contract

Options:
  -h, --help              display help for command

Commands:
  collector [options]     Mirror Collector contract functions
  community [options]     Mirror Community contract functions
  factory [options]       Mirror Factory contract functions
  gov [options]           Mirror Gov contract functions
  mint [options]          Mirror Mint contract functions
  oracle [options]        Mirror Oracle contract functions
  staking [options]       Mirror Staking contract functions
  terraswap|ts [options]  Terraswap contract functions
  token [options]         Terraswap CW20 Token contract functions
  help [command]          display help for command
```

### Query

**USAGE: `mirrorcli query|q [options] [command]`**

```
Run a smart contract query function

Options:
  -h, --help              display help for command

Commands:
  collector [options]     Mirror Collector contract queries
  community [options]     Mirror Community contract queries
  factory [options]       Mirror Factory contract queries
  gov [options]           Mirror Gov contract queries
  mint [options]          Mirror Mint contract queries
  oracle [options]        Mirror Oracle contract queries
  staking [options]       Mirror Staking contract queries
  terraswap|ts [options]  Terraswap contract queries
  token [options]         Terraswap CW20 Token contract queries
  help [command]          display help for command
```

## License

This software is licensed under the Apache 2.0 license. Read more about it [here](./LICENSE).

© 2020 Mirror Protocol
