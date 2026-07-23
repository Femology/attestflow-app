import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { rpc, Transaction } from '@stellar/stellar-sdk';
import { NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_NETWORK_PASSPHRASE } from './config';

export async function checkFreighterInstalled(): Promise<boolean> {
  const res = await isConnected();
  return res.isConnected === true;
}

export async function connectWallet(): Promise<string> {
  const access: any = await requestAccess();
  if (access.error) throw new Error(access.error);
  return access.address || access;
}

export async function signAndSubmitTx(xdr: string): Promise<string> {
  const signedXdr: any = await signTransaction(xdr, { networkPassphrase: NEXT_PUBLIC_NETWORK_PASSPHRASE });
  if (signedXdr.error) throw new Error(signedXdr.error);
  
  const finalXdr = signedXdr.signedTxXdr || signedXdr;
  const server = new rpc.Server(NEXT_PUBLIC_RPC_URL);
  const transaction = new Transaction(finalXdr, NEXT_PUBLIC_NETWORK_PASSPHRASE);
  
  const response = await server.sendTransaction(transaction);
  if (response.status === 'ERROR') {
    throw new Error('Transaction submission failed: ' + JSON.stringify(response));
  }
  
  return response.hash;
}
