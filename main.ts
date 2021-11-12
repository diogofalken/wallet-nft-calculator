import { Table } from "https://deno.land/x/cliffy@v0.20.1/table/mod.ts";
import { Wallet } from "./@types/Wallet.ts";

const searchByName = ['101dcbab5b3c6d18f9121613cb999d12600e5e7e77c147d455b51443'];

async function getFloor(search: string) {
  const { results } = await fetchListings(search, true);

  if(results.length === 0) {
    const { results } = await fetchListings(search, false);
    return convertADA(results[0].price);
  }

  return convertADA(results[0].price);
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

function convertADA(price: number) {
  return Math.round(price / 1000000);
}

function createTable(body: any) {
  new Table()
    .header(["NFT", "Quantity", "Price"])
    .body(body)
    .border(true)
    .render();
}

async function main() {
  const [ walletAddress ] = Deno.args;

  const wallet = await fetch(`https://pool.pm/wallet/${walletAddress}`);
  const jsonWallet: Wallet = await wallet.json();
  const table = [];
  let totalADA = 0;
  
  console.log("Loading...");
  for (const token of jsonWallet.tokens) {
    const curValue = await getFloor(searchByName.includes(token.policy) ? token.name.replace(/\d+$/, '') : token.policy);
    totalADA += (token.quantity * curValue);
    table.push([token.name, token.quantity, curValue]);
  }

  table.push(['Total', jsonWallet.tokens.length, `${totalADA}A`]);
  createTable(table);
}

main();