"use client";

import { useState } from "react";
import { NEXT_PUBLIC_INDEXER_URL } from "@/lib/config";

export default function VerifyAttestation() {
  const [uid, setUid] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${NEXT_PUBLIC_INDEXER_URL}/api/attestations/uid/${uid}`);
      if (!res.ok) throw new Error("Attestation not found");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Verify Attestation</h2>
      <form onSubmit={handleVerify} className="flex gap-4 mb-6">
        <input
          type="text"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="Enter UID (hex)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
          Verify
        </button>
      </form>

      {error && <p className="text-red-500 font-medium">{error}</p>}
      
      {result && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Attestation Details</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.revoked ? "bg-red-100 text-red-700" :
                (result.expiration_time > 0 && result.expiration_time <= Date.now()) ? "bg-yellow-100 text-yellow-700" :
                "bg-green-100 text-green-700"
              }`}
            >
              {result.revoked ? "REVOKED" : (result.expiration_time > 0 && result.expiration_time <= Date.now()) ? "EXPIRED" : "VALID"}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Schema ID:</span> {result.schema_id}</p>
            <p><span className="font-medium text-gray-800">Issuer:</span> <span className="break-all">{result.issuer}</span></p>
            <p><span className="font-medium text-gray-800">Recipient:</span> <span className="break-all">{result.recipient}</span></p>
            <p><span className="font-medium text-gray-800">Data Hash:</span> <span className="break-all">{result.data_hash}</span></p>
            <p><span className="font-medium text-gray-800">Issued At:</span> {new Date(result.issued_at).toLocaleString()}</p>
            {result.expiration_time > 0 && (
              <p><span className="font-medium text-gray-800">Expires At:</span> {new Date(result.expiration_time).toLocaleString()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
