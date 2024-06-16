import { http, createConfig } from '@wagmi/vue'
import { injected } from '@wagmi/vue/connectors'


const ogTestnet = {
    id: 16600,
    name: '0G Newton Testnet',
    network: 'og-newton-testnet',
    rpcUrls: {
        default: 'https://rpc-testnet.0g.ai',
    },
    nativeCurrency: {
        name: 'AOGI',
        symbol: 'AOGI',
        decimals: 18,
    },
}

export const config = createConfig({
    chains: [ogTestnet],
    connectors: [
        injected(),
    ],
    transports: {
        [ogTestnet.id]: http()
    },
})