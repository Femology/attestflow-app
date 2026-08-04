"use client";

import { useState, useEffect } from "react";
import { AttestFlowSDK, hashData, formatUid } from "@attestflow/sdk";
import { NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_NETWORK_PASSPHRASE, NEXT_PUBLIC_SCHEMA_REGISTRY_ID, NEXT_PUBLIC_ATTESTER_ID, NEXT_PUBLIC_INDEXER_URL } from "@/lib/config";
import { signAndSubmitTx } from "@/lib/freighter";
import { Layers, Send, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export default function IssueAttestationForm({ publicKey }: { publicKey: string | null }) {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<any | null>(null);
  
  const [recipient, setRecipient] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [expiration, setExpiration] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const hexToStr = (hex: string) => {
    try {
      let str = '';
      for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    } catch {
      return "{}";
    }
  };

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_INDEXER_URL}/api/schemas`);
        const data = await res.json();
        
        // Parse hex data back to JSON for UI
        const parsedSchemas = data.map((s: any) => {
          try {
            const decoded = hexToStr(s.schema_data);
            const parsed = JSON.parse(decoded);
            return { ...s, parsed };
          } catch {
            return { ...s, parsed: { name: `Schema #${s.id}`, fields: [] } };
          }
        });
        // Sort by ID descending
        setSchemas(parsedSchemas.sort((a: any, b: any) => b.id - a.id));
      } catch (err) {
        console.error("Failed to load schemas from indexer", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemas();
  }, []);

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return setStatus("Please connect wallet first");
    if (!selectedSchema) return setStatus("Please select a schema");
    if (!recipient) return setStatus("Please enter a recipient address");

    setStatus("Building transaction...");
    try {
      const sdk = new AttestFlowSDK({
        rpcUrl: NEXT_PUBLIC_RPC_URL,
        networkPassphrase: NEXT_PUBLIC_NETWORK_PASSPHRASE,
        schemaRegistryContractId: NEXT_PUBLIC_SCHEMA_REGISTRY_ID,
        attesterContractId: NEXT_PUBLIC_ATTESTER_ID,
      });

      // Combine dynamic form data into a single JSON payload for hashing
      const dataPayload = JSON.stringify(formData);
      const dataHashHex = hashData(dataPayload);
      
      const uid = formatUid(publicKey, recipient, BigInt(selectedSchema.id), Date.now().toString());
      const expTime = expiration ? BigInt(new Date(expiration).getTime()) : 0n;

      const tx = await sdk.buildIssueAttestationTx(
        publicKey,
        recipient,
        BigInt(selectedSchema.id),
        dataHashHex,
        expTime,
        uid
      );
      
      setStatus("Waiting for signature...");
      const hash = await signAndSubmitTx(tx.toXDR());
      setStatus(`Success! Credential Issued. UID: ${uid}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Step 1: Select Schema */}
      <div className="bg-card border border-border rounded-2xl p-5 md:p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif text-foreground">Step 1: Select Schema Blueprint</h2>
            <p className="text-sm text-muted">Choose the type of credential you want to issue.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-muted text-sm animate-pulse">Loading active schemas from blockchain...</div>
        ) : schemas.length === 0 ? (
          <div className="text-muted text-sm flex items-center gap-2">
            <AlertCircle size={16} /> No schemas found. Create one first!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemas.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedSchema(s); setFormData({}); setStatus(""); }}
                className={`text-left p-5 rounded-xl border transition-all duration-200 flex flex-col gap-2 ${
                  selectedSchema?.id === s.id 
                    ? "bg-primary/5 border-primary shadow-[0_0_15px_rgba(249,115,22,0.15)]" 
                    : "bg-background border-border hover:border-zinc-700 hover:bg-card/80"
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <h3 className="font-medium text-foreground">{s.parsed.name || `Schema #${s.id}`}</h3>
                  {selectedSchema?.id === s.id && <CheckCircle2 size={18} className="text-primary" />}
                </div>
                <p className="text-xs text-muted line-clamp-2">
                  {s.parsed.description || "No description provided."}
                </p>
                <div className="mt-2 text-xs font-mono text-muted/60">ID: {s.id}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Dynamic Form */}
      <div className={`bg-card border border-border rounded-2xl p-5 md:p-8 shadow-xl transition-all duration-300 ${selectedSchema ? "opacity-100 translate-y-0" : "opacity-50 pointer-events-none translate-y-4"}`}>
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif text-foreground">Step 2: Issue Credential</h2>
            <p className="text-sm text-muted">Fill out the fields. Data is cryptographically hashed before hitting the blockchain.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Recipient Wallet Address</label>
              <input 
                type="text" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground font-mono text-base sm:text-sm focus:ring-1 focus:ring-primary outline-none" 
                required 
                placeholder="G..." 
              />
            </div>

            {selectedSchema?.parsed.fields?.map((field: any, i: number) => (
              <div key={i}>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                  {field.name} <span className="text-muted/50 lowercase">({field.type})</span>
                </label>
                <input 
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={formData[field.name] || ''} 
                  onChange={(e) => handleFieldChange(field.name, e.target.value)} 
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground text-base sm:text-sm focus:ring-1 focus:ring-primary outline-none" 
                  required 
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Expiration Date (Optional)</label>
              <input 
                type="datetime-local" 
                value={expiration} 
                onChange={(e) => setExpiration(e.target.value)} 
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground text-base sm:text-sm focus:ring-1 focus:ring-primary outline-none [color-scheme:dark]" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Sign & Issue Attestation
            </button>
            
            {status && (
              <div className={`mt-4 p-4 rounded-lg text-sm border font-mono break-all ${status.includes('Success') ? 'bg-verified/10 text-verified border-verified/20' : 'bg-card border-border text-foreground'}`}>
                {status}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
