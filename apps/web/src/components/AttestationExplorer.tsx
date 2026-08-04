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
    <div className="max-w-4xl mx-auto p-5 sm:p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border">
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Recent Schemas</h2>
      {schemas.length === 0 ? (
        <p className="text-muted">No schemas found.</p>
      ) : (
        <div className="space-y-4">
          {schemas.map((s, i) => (
            <div key={i} className="p-4 sm:p-5 border border-border rounded-xl bg-background hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start">
                <span className="font-bold text-lg text-primary">Schema #{s.id}</span>
                <span className={`px-2 py-1 text-xs rounded-md font-medium ${s.revocable ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted/10 text-muted border border-border'}`}>
                  {s.revocable ? 'Revocable' : 'Immutable'}
                </span>
              </div>
              <p className="text-sm text-foreground mt-3"><span className="font-medium text-muted">Creator:</span> <span className="font-mono text-xs">{s.creator.substring(0,8)}...{s.creator.substring(s.creator.length - 8)}</span></p>
              <p className="text-sm text-foreground"><span className="font-medium text-muted">Created At:</span> {new Date(s.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
