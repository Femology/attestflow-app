"use client";

import { useEffect, useState } from "react";
import { NEXT_PUBLIC_INDEXER_URL } from "@/lib/config";
import { ShieldCheck, Download, Home } from "lucide-react";
import Link from "next/link";

export default function PublicVerifyPage({ params }: { params: { uid: string } }) {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttestation = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_INDEXER_URL}/api/attestations/uid/${params.uid}`);
        if (!res.ok) throw new Error("Attestation not found or invalid UID.");
        const data = await res.json();
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttestation();
  }, [params.uid]);

  const getStatus = () => {
    if (!result) return null;
    if (result.revoked) return { label: "REVOKED", color: "text-revoked", bg: "bg-revoked/10", border: "border-revoked/20" };
    if (result.expiration_time > 0 && result.expiration_time <= Date.now()) return { label: "EXPIRED", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
    return { label: "VALID", color: "text-verified", bg: "bg-verified/10", border: "border-verified/20" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted animate-pulse font-mono">Verifying cryptographic proof...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-16 h-16 rounded-full bg-revoked/10 text-revoked flex items-center justify-center">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-serif text-foreground">Verification Failed</h2>
        <p className="text-muted font-mono">{error}</p>
        <Link href="/" className="mt-6 px-6 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-card/80 transition-colors flex items-center gap-2">
          <Home size={16} /> Return Home
        </Link>
      </div>
    );
  }

  const status = getStatus()!;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <Link href="/" className="absolute top-8 left-8 text-muted hover:text-foreground flex items-center gap-2 transition-colors">
        <Home size={18} />
        <span className="font-serif text-lg tracking-tight">AttestFlow</span>
      </Link>

      <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-3xl p-1 shadow-2xl relative overflow-hidden group mt-12">
        {/* Subtle Glow Background based on Status */}
        <div className={`absolute -top-32 -right-32 w-96 h-96 blur-[120px] rounded-full opacity-50 pointer-events-none ${status.label === 'VALID' ? 'bg-verified' : 'bg-revoked'}`} />
        
        <div className="bg-card/90 backdrop-blur-xl border border-zinc-800/50 rounded-[22px] p-8 md:p-12 relative z-10">
          {/* Header: Seal & Status */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-border pb-8 mb-8 gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${status.bg} ${status.color}`}>
                <ShieldCheck size={36} />
              </div>
              <div>
                <h3 className="text-3xl font-serif text-foreground">Digital Attestation</h3>
                <p className="text-sm font-mono text-muted mt-2">Schema ID: {result.schema_id}</p>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 self-start ${status.bg} ${status.color} ${status.border}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${status.label === 'VALID' ? 'bg-verified animate-pulse' : 'bg-revoked'}`} />
              <span className="text-sm font-bold tracking-widest">{status.label}</span>
            </div>
          </div>

          {/* Content: Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
            <div className="space-y-1.5 md:col-span-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Recipient Address</p>
              <p className="font-mono text-sm text-foreground break-all">{result.recipient}</p>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Issuer Address</p>
              <p className="font-mono text-sm text-foreground break-all">{result.issuer}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Issue Date</p>
              <p className="text-sm text-foreground">{new Date(result.issued_at).toLocaleDateString()} {new Date(result.issued_at).toLocaleTimeString()}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Expiration Date</p>
              <p className="text-sm text-foreground">{result.expiration_time > 0 ? new Date(result.expiration_time).toLocaleDateString() : 'Never'}</p>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Cryptographic Hash (SHA-256)</p>
              <p className="font-mono text-xs text-muted bg-background p-4 rounded-lg border border-border break-all">
                {result.data_hash}
              </p>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="mt-10 pt-8 border-t border-border flex items-center justify-between">
            <div className="text-xs text-muted font-mono max-w-[200px] break-all">UID: {result.uid.substring(0, 16)}...</div>
            <button onClick={() => window.print()} className="flex items-center gap-2 text-sm bg-foreground text-background hover:bg-foreground/90 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg">
              <Download size={16} /> Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
