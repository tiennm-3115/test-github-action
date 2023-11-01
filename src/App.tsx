import { SignClientTypes } from '@walletconnect/types'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'
import { useCallback, useEffect, useState } from 'react'
import './App.css'
import QrScanner from './components/QrScanner'
import { EIP155_CHAINS, EIP155_SIGNING_METHODS } from './constants/eip-155'
// import { connectToWallet } from "./utils/connect-wallet";
import { createWeb3Wallet, web3wallet } from './utils/web3wallet'

const App = () => {
  const [result, setResult] = useState<string | null>('')
  const [status, setStatus] = useState<string>('')
  const [proposal, setProposal] = useState<
    SignClientTypes.EventArguments['session_proposal'] | null
  >(null)
  const [request, setRequest] = useState<SignClientTypes.EventArguments['session_request'] | null>(
    null,
  )
  // const [uri, setUri] = useState<string>('')

  useEffect(() => {
    chrome.storage.sync.get(['uri'], (result) => {
      setResult(result.uri)
    })
  }, [])

  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      setProposal(proposal)
    },
    [],
  )

  const onSessionRequest = useCallback(
    (request: SignClientTypes.EventArguments['session_request']) => {
      setRequest(request)
    },
    [],
  )

  const initialWallet = async () => {
    await createWeb3Wallet()

    try {
      web3wallet.pair({ uri: result || '' })
      console.log('init success')

      web3wallet.on('session_proposal', onSessionProposal)
      web3wallet.on('session_request', onSessionRequest)
    } catch (error) {
      console.log(error)
    }
  }

  const supportedNamespaces = () => {
    // eip155
    const eip155Chains = Object.keys(EIP155_CHAINS)
    const eip155Methods = Object.values(EIP155_SIGNING_METHODS)

    // Get address form wallet
    const eip155Addresses = ['0x4ED5d522785386f9048fEaB998Afa409a19BD58c']

    return {
      etherum: {
        chains: eip155Chains,
        methods: eip155Methods,
        events: ['accountsChanged', 'chainChanged'],
        accounts: eip155Chains.map((chain) => `${chain}:${eip155Addresses[0]}`).flat(),
      },
    }
  }

  async function onApprove() {
    if (proposal) {
      const { params, id } = proposal
      const { relays } = params
      const namespaces = buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces: supportedNamespaces(),
      })

      setStatus('approving namespaces')

      try {
        await web3wallet.approveSession({
          id,
          relayProtocol: relays[0].protocol,
          namespaces,
        })

        setStatus('approval success')
      } catch (e) {
        return
      }
    }
  }

  async function onReject() {
    if (proposal) {
      try {
        await web3wallet.rejectSession({
          id: proposal.id,
          reason: getSdkError('USER_REJECTED_METHODS'),
        })
        setStatus('reject success')
      } catch (e) {
        return
      }
    }
  }

  useEffect(() => {
    if (result) {
      initialWallet()
    }
  }, [result])

  // useEffect(() => {
  //   connectToWallet();
  // }, []);


  return (
    <>
      <div>
        {!result && <QrScanner onResult={setResult} onError={() => ({})} />}

        {proposal && (
          <div>
            <h4>Session Proposal</h4>
            <div>
              <button onClick={onReject}>Reject</button>
              <button onClick={onApprove}>Approve</button>
            </div>
          </div>
        )}

        {request && (
          <div>
            <h4>Session Proposal</h4>
            <div>
              <button>Reject</button>
              <button>Approve</button>
            </div>
          </div>
        )}

        {status && <p>{status}</p>}
      </div>
    </>
  )
}

export default App

// import { useState, useEffect } from 'react'
// import detectEthereumProvider from '@metamask/detect-provider'

// const App = () => {
//   const [hasProvider, setHasProvider] = useState<boolean | null>(null)

//   useEffect(() => {
//     const getProvider = async () => {
//       const provider = await detectEthereumProvider({ silent: true })
//       console.log(provider)
//       setHasProvider(Boolean(provider)) // transform provider to true or false
//     }

//     getProvider()
//   }, [])

//   return (
//     <div className="App">
//       <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>
//       { hasProvider &&
//         <button>Connect MetaMask</button>
//       }
//     </div>
//   )
// }

// export default App
