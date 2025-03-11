import { http, createConfig } from 'wagmi';
import { base, mainnet, optimism } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = '16a8f93018e606bb4e9ea2eadfb16cfc';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: '16a8f93018e606bb4e9ea2eadfb16cfc',
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});
