"use client";

import { useState } from "react";
import { AttestFlowSDK, hashData, formatUid } from "@attestflow/sdk";
import { NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_NETWORK_PASSPHRASE, NEXT_PUBLIC_SCHEMA_REGISTRY_ID, NEXT_PUBLIC_ATTESTER_ID } from "@/lib/config";
import { signAndSubmitTx } from "@/lib/freighter";

export default function IssueAttestationForm({ publicKey }: { publicKey: string | null }) {
  const [schemaId, setSchemaId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [data, setData] = useState("");
  const [expiration, setExpiration] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return setStatus("Please connect wallet first");

    setStatus("Building transaction...");
    try {
      const sdk = new AttestFlowSDK({
        rpcUrl: NEXT_PUBLIC_RPC_URL,
        networkPassphrase: NEXT_PUBLIC_NETWORK_PASSPHRASE,
        schemaRegistryContractId: NEXT_PUBLIC_SCHEMA_REGISTRY_ID,
        attesterContractId: NEXT_PUBLIC_ATTESTER_ID,
      });

      const dataHash = hashData(data);
      const uid = formatUid(publicKey, recipient, BigInt(schemaId), Date.now().toString());
      const expTime = expiration ? BigInt(new Date(expiration).getTime()) : 0n;

      const tx = await sdk.buildIssueAttestationTx(
        publicKey,
        recipient,
        BigInt(schemaId),
        dataHash,
        expTime,
        uid
      );
      
      setStatus("Waiting for signature...");
      const hash = await signAndSubmitTx(tx.toXDR());
      setStatus(`Success! Tx Hash: ${hash} | UID: ${uid}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Issue Attestation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schema ID</label>
          <input type="number" value={schemaId} onChange={(e) => setSchemaId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" required placeholder="G..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attestation Data (will be hashed)</label>
          <textarea value={data} onChange={(e) => setData(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" rows={3} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Time (Optional)</label>
          <input type="datetime-local" value={expiration} onChange={(e) => setExpiration(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
          Issue Attestation
        </button>
        {status && <p className="text-sm text-gray-600 mt-2 break-all">{status}</p>}
      </form>
    </div>
  );
}
