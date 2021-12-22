import { Command, Table } from '../deps.ts';
import type { ICell, IRow } from '../deps.ts';
import type { Wallet } from './types/Wallet.ts';
import { version } from './version.ts';

const searchByName = [
  '101dcbab5b3c6d18f9121613cb999d12600e5e7e77c147d455b51443',
];
const ignorePolicies = [
  'a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235',
];

async function getFloor(search: string) {
  const { results } = await fetchListings(search, true);

  if (results.length === 0) {
    const { results } = await fetchListings(search, false);

    return convertADA(results[0]?.price);
  }

  return convertADA(results[0]?.price);
}

async function fetchListings(search: string, verified: boolean) {
  const url = new URL('https://api.cnft.io/market/listings');

  const fetchListing = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      search,
      types: ['listing'],
      project: null,
      sort: {
        price: 1,
      },
      priceMin: null,
      priceMax: null,
      page: 1,
      verified,
      nsfw: false,
      sold: false,
    }),
  });

  return await fetchListing.json();
}

export async function fetchWallet(wallet: string) {
  const walletJson = await fetch(`https://pool.pm/wallet/${wallet}`);
  const jsonWallet: Wallet = await walletJson.json();
  return jsonWallet;
}

export async function generateReport(jsonWallet: Wallet) {
  const report = [];
  let totalADA = 0;

  console.log('Loading...');
  for (const token of jsonWallet.tokens) {
    if (ignorePolicies.includes(token.policy) || token.quantity > 1000)
      continue;

    console.log(token.name);

    const curValue = await getFloor(
      searchByName.includes(token.policy)
        ? token.name.replace(/\d+$/, '')
        : token.policy,
    );
    totalADA += token.quantity * curValue;
    report.push([token.name, token.quantity, curValue]);
  }

  report.push(['Total', jsonWallet.tokens.length, `${totalADA}A`]);
  return report;
}

function convertADA(price: number) {
  if (!price) {
    return 0;
  }

  return Math.round(price / 1000000);
}

function renderTableReport(body: IRow<ICell>[]) {
  new Table()
    .header(['NFT', 'Quantity', 'Price'])
    .body(body)
    .border(true)
    .render();
}

async function main() {
  const { options } = await new Command()
    .name('wallet-nft-calculator')
    .description('Calculate your NFT values')
    .version(version)
    .allowEmpty(false)
    .option('-w, --wallet [wallet-address:string]', 'Your NFT wallet address')
    .option(
      '-s, --search [search:string]',
      'Search by name or policy of the project to get floor',
    )
    .parse(Deno.args);

  const { wallet, search } = options;

  if (wallet) {
    const jsonWallet = await fetchWallet(wallet);
    const report = await generateReport(jsonWallet);
    renderTableReport(report);
  }

  if (search) {
    const floorValue = await getFloor(search);
    console.log(floorValue);
  }
}

if (import.meta.main === true) {
  await main();
}
