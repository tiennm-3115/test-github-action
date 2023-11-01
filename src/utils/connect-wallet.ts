import { Core } from '@walletconnect/core'
import { IWeb3Wallet, Web3Wallet } from '@walletconnect/web3wallet'

export let web3wallet: IWeb3Wallet

export async function createWeb3Wallet() {
  const core = new Core({
    projectId: '5970dcaaf2b02b41cad81e0256292cbd',
    relayUrl: 'wss://relay.walletconnect.com',
  })

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'Wallet Extension',
      description: 'React Wallet for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: [],
    },
  })

  try {
    const clientId = await web3wallet.engine.signClient.core.crypto.getClientId()
    console.log('WalletConnect ClientID: ', clientId)
    localStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId)
  } catch (error) {
    console.error('Failed to set WalletConnect clientId in localStorage: ', error)
  }
}
