"use client";

import { useState } from "react";
import { NEXT_PUBLIC_INDEXER_URL } from "@/lib/config";
import { ShieldCheck, Search, Link as LinkIcon, Download } from "lucide-react";
import Link from "next/link";

export default function VerifyAttestation() {
  const [uid, setUid] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${NEXT_PUBLIC_INDEXER_URL}/api/attestations/uid/${uid}`);
      if (!res.ok) throw new Error("Attestation not found or invalid UID.");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = () => {
    if (result.revoked) return { label: "REVOKED", color: "text-revoked", bg: "bg-revoked/10", border: "border-revoked/20" };
    if (result.expiration_time > 0 && result.expiration_time <= Date.now()) return { label: "EXPIRED", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
    return { label: "VALID", color: "text-verified", bg: "bg-verified/10", border: "border-verified/20" };
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10">
      
      {/* Search Header */}
      <div className="w-full max-w-2xl text-center space-y-4">
        <h2 className="text-3xl font-serif text-foreground">Verify a Credential</h2>
        <p className="text-muted">Enter the unique cryptographic identifier (UID) below to instantly verify its authenticity on the Soroban blockchain.</p>
        
        <form onSubmit={handleVerify} className="relative mt-6 flex items-center">
          <div className="absolute left-4 text-muted">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Paste 64-character UID here..."
            className="w-full bg-card border border-border rounded-xl pl-12 pr-32 py-4 text-foreground font-mono focus:ring-2 focus:ring-primary outline-none transition-all shadow-lg"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-white px-6 rounded-lg font-medium transition-colors"
          >
            {loading ? "..." : "Verify"}
          </button>
        </form>
        {error && <p className="text-revoked font-medium mt-4 bg-revoked/10 border border-revoked/20 py-2 rounded-lg">{error}</p>}
      </div>

      {/* Digital Credential Pass Result */}
      {result && (
        <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-3xl p-1 shadow-2xl relative overflow-hidden group">
          
          {/* Subtle Glow Background based on Status */}
          <div className={`absolute -top-32 -right-32 w-96 h-96 blur-[120px] rounded-full opacity-50 pointer-events-none ${getStatus().label === 'VALID' ? 'bg-verified' : 'bg-revoked'}`} />
          
          <div className="bg-card/90 backdrop-blur-xl border border-zinc-800/50 rounded-[22px] p-8 relative z-10">
            {/* Header: Seal & Status */}
            <div className="flex items-start justify-between border-b border-border pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${getStatus().bg} ${getStatus().color}`}>
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-foreground">Digital Attestation</h3>
                  <p className="text-sm font-mono text-muted mt-1">Schema ID: {result.schema_id}</p>
                </div>
              </div>
              
              <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 ${getStatus().bg} ${getStatus().color} ${getStatus().border}`}>
                <div className={`w-2 h-2 rounded-full ${getStatus().label === 'VALID' ? 'bg-verified animate-pulse' : 'bg-revoked'}`} />
                <span className="text-sm font-bold tracking-widest">{getStatus().label}</span>
              </div>
            </div>

            {/* Content: Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-medium text-muted uppercase tracking-wider">Recipient Address</p>
                <p className="font-mono text-sm text-foreground break-all">{result.recipient}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-medium text-muted uppercase tracking-wider">Issuer Address</p>
                <p className="font-mono text-sm text-foreground break-all">{result.issuer}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted uppercase tracking-wider">Issue Date</p>
                <p className="text-sm text-foreground">{new Date(result.issued_at).toLocaleDateString()} {new Date(result.issued_at).toLocaleTimeString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted uppercase tracking-wider">Expiration Date</p>
                <p className="text-sm text-foreground">{result.expiration_time > 0 ? new Date(result.expiration_time).toLocaleDateString() : 'Never'}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-medium text-muted uppercase tracking-wider">Cryptographic Hash (SHA-256)</p>
                <p className="font-mono text-xs text-muted bg-background p-3 rounded border border-border break-all">
                  {result.data_hash}
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-4">
              <Link href={`/verify/${uid}`} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                <LinkIcon size={16} /> Public Link
              </Link>
              <button onClick={() => window.print()} className="flex items-center gap-2 text-sm bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-lg font-medium transition-colors">
                <Download size={16} /> Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
