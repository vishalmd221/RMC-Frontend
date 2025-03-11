import { http, createConfig } from 'wagmi';
import { base, mainnet, optimism } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';
import { getDefaultConfig ,Chain } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = '16a8f93018e606bb4e9ea2eadfb16cfc';

const celoTestnet = {
  id: 44787, 
  name: 'Celo Testnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5567.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'CELO', symbol: 'WCELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://alfajores-forno.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { name: 'CeloScan', url: 'https://alfajores.celoscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0x75F59534dd892c1f8a7B172D639FA854D529ada3',
      blockCreated: 4_567_890,
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: '16a8f93018e606bb4e9ea2eadfb16cfc',
  chains: [celoTestnet],
  transports: {
        [celoTestnet.id]: http(celoTestnet.rpcUrls.default.http[0]), 

  },
});
