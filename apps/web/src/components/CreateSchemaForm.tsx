"use client";

import { useState } from "react";
import { AttestFlowSDK } from "@attestflow/sdk";
import { NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_NETWORK_PASSPHRASE, NEXT_PUBLIC_SCHEMA_REGISTRY_ID, NEXT_PUBLIC_ATTESTER_ID } from "@/lib/config";
import { signAndSubmitTx } from "@/lib/freighter";

export default function CreateSchemaForm({ publicKey }: { publicKey: string | null }) {
  const [schemaData, setSchemaData] = useState("");
  const [revocable, setRevocable] = useState(true);
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

      const tx = await sdk.buildCreateSchemaTx(publicKey, schemaData, revocable);
      setStatus("Waiting for signature...");
      const hash = await signAndSubmitTx(tx.toXDR());
      setStatus(`Success! Tx Hash: ${hash}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Schema</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schema Data (Hex/String)</label>
          <textarea
            value={schemaData}
            onChange={(e) => setSchemaData(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            rows={4}
            required
            placeholder="e.g. 7b2274797065223a22646567726565227d"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={revocable}
            onChange={(e) => setRevocable(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Revocable</label>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Schema
        </button>
        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
      </form>
    </div>
  );
}
