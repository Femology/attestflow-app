"use client";

import { useEffect, useState } from "react";
import { NEXT_PUBLIC_INDEXER_URL } from "@/lib/config";

export default function AttestationExplorer() {
  const [schemas, setSchemas] = useState<any[]>([]);
  
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_INDEXER_URL}/api/schemas`)
      .then(res => res.json())
      .then(data => setSchemas(data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Schemas</h2>
      {schemas.length === 0 ? (
        <p className="text-gray-500">No schemas found.</p>
      ) : (
        <div className="space-y-4">
          {schemas.map((s, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between">
                <span className="font-bold text-lg text-indigo-600">Schema #{s.id}</span>
                <span className={`px-2 py-1 text-xs rounded-md ${s.revocable ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                  {s.revocable ? 'Revocable' : 'Immutable'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Creator:</span> {s.creator}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Created At:</span> {new Date(s.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
