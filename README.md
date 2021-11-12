# Wallet Nft Calculator

Calculate your NFT values

## Table of Contents

- [Install](#install)
- [Using It](#using)
- [As a dependency](#dependency)

### Install

#### Binary

Head to the
[Releases](https://github.com/diogofalken/wallet-nft-calculator/releases) and
download the binary and run it.

#### Deno

Either clone this repository or get the source code from the
[Releases](https://github.com/diogofalken/wallet-nft-calculator/releases).

_Optional:_ `deno install --allow-net lib/main.ts`

### Using

Instructions:

```
wallet-nft-calculator --help
```

### Dependency

You can also this as a dependency of your Deno scripts. Take a look at the what
it [exports](./mod.ts).

```ts
import { fetchWallet, generateReport, version } from "mod.ts"

console.log(`The current version is ${version}`).

const myWallet = "myWalletAddress";
const jsonWallet = await fetchWallet(myWallet);
const report = await generateReport(jsonWallet);
```
