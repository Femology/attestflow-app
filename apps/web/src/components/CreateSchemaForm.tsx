"use client";

import { useState } from "react";
import { AttestFlowSDK } from "@attestflow/sdk";
import { NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_NETWORK_PASSPHRASE, NEXT_PUBLIC_SCHEMA_REGISTRY_ID, NEXT_PUBLIC_ATTESTER_ID } from "@/lib/config";
import { signAndSubmitTx } from "@/lib/freighter";
import { Plus, Trash2, FileJson, CheckCircle } from "lucide-react";

export default function CreateSchemaForm({ publicKey }: { publicKey: string | null }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([{ name: "", type: "string" }]);
  const [revocable, setRevocable] = useState(true);
  const [status, setStatus] = useState("");

  const addField = () => setFields([...fields, { name: "", type: "string" }]);
  const removeField = (index: number) => setFields(fields.filter((_, i) => i !== index));
  const updateField = (index: number, key: string, value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const generateSchemaJSON = () => {
    const schema = {
      name: name || "Untitled Schema",
      description: description || "No description provided.",
      fields: fields.filter(f => f.name.trim() !== "")
    };
    return JSON.stringify(schema, null, 2);
  };

  const toHex = (str: string) => {
    return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async () => {
    if (!publicKey) return setStatus("Please connect wallet first");
    
    setStatus("Building transaction...");
    try {
      const sdk = new AttestFlowSDK({
        rpcUrl: NEXT_PUBLIC_RPC_URL,
        networkPassphrase: NEXT_PUBLIC_NETWORK_PASSPHRASE,
        schemaRegistryContractId: NEXT_PUBLIC_SCHEMA_REGISTRY_ID,
        attesterContractId: NEXT_PUBLIC_ATTESTER_ID,
      });

      const jsonStr = generateSchemaJSON();
      const hexData = toHex(jsonStr);

      const tx = await sdk.buildCreateSchemaTx(publicKey, hexData, revocable);
      setStatus("Waiting for signature...");
      const hash = await signAndSubmitTx(tx.toXDR());
      setStatus(`Success! Tx Hash: ${hash.substring(0, 12)}...`);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
      {/* Left Panel: No-Code Builder */}
      <div className="flex-1 bg-card border border-border rounded-2xl p-8 shadow-xl flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-serif text-foreground mb-1">Create Schema Blueprint</h2>
          <p className="text-sm text-muted">Define the fields for your digital credential.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Schema Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., University Diploma"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Issued to graduates of the 2026 class."
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-1 focus:ring-primary outline-none transition-all"
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-muted uppercase tracking-wider">Data Fields</label>
            <button onClick={addField} className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors">
              <Plus size={16} /> Add Field
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(index, "name", e.target.value)}
                  placeholder="Field Name (e.g., Student Name)"
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, "type", e.target.value)}
                  className="w-32 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none appearance-none"
                >
                  <option value="string">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="address">Wallet Address</option>
                </select>
                <button 
                  onClick={() => removeField(index)}
                  className="p-2 text-muted hover:text-revoked transition-colors rounded-lg hover:bg-revoked/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={revocable} onChange={(e) => setRevocable(e.target.checked)} />
            <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border"></div>
          </label>
          <span className="text-sm font-medium text-foreground">Allow Revocation</span>
        </div>

        <div className="pt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Publish Schema to Blockchain
          </button>
          {status && (
            <div className={`mt-4 p-3 rounded-lg text-sm border ${status.includes('Success') ? 'bg-verified/10 text-verified border-verified/20' : 'bg-card border-border text-foreground'}`}>
              {status}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className="flex-1 w-full flex flex-col gap-6">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />
          
          <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-6 flex items-center gap-2">
            <FileJson size={14} /> Live Schema Output
          </h3>

          <div className="bg-[#09090B] border border-border rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-primary font-mono whitespace-pre-wrap">
              {generateSchemaJSON()}
            </pre>
          </div>
          
          <div className="mt-8 border-t border-border pt-6">
             <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-4">How it looks to issuers:</h3>
             <div className="space-y-3 opacity-60 pointer-events-none">
                {fields.filter(f => f.name.trim() !== "").map((f, i) => (
                  <div key={i}>
                    <label className="block text-xs text-muted mb-1">{f.name}</label>
                    <div className="w-full bg-background border border-border rounded-lg h-10"></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
