"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CreateSchemaForm from "@/components/CreateSchemaForm";
import IssueAttestationForm from "@/components/IssueAttestationForm";
import VerifyAttestation from "@/components/VerifyAttestation";
import AttestationExplorer from "@/components/AttestationExplorer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const [wallet, setWallet] = useState<string | null>(null);

  const renderLandingPage = () => (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 py-20">
      <div className="flex-1 space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold tracking-wide">
          Soroban Testnet Live
        </div>
        <h1 className="text-5xl lg:text-7xl font-serif font-bold text-foreground leading-tight tracking-tight">
          The Digital Notary for <span className="text-primary">Stellar</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl leading-relaxed">
          Instantly issue, manage, and verify unforgeable credentials on-chain. 
          AttestFlow provides zero-friction data verification for enterprises and individuals.
        </p>
        <div className="flex items-center gap-6 pt-4">
          <button 
            onClick={() => setActiveTab("Explore")}
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          >
            Explore Registry
          </button>
          <button 
            onClick={() => setActiveTab("Verify")}
            className="px-8 py-4 bg-card border border-border hover:border-zinc-700 text-foreground rounded-lg font-medium transition-all"
          >
            Verify a Credential
          </button>
        </div>
      </div>
      
      {/* Interactive Live Demo Widget (Right Side) */}
      <div className="flex-1 w-full max-w-md relative">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full mix-blend-screen" />
        <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="font-serif text-2xl text-foreground">Certificate of Validity</h3>
            <div className="w-8 h-8 rounded-full bg-verified/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-verified animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted uppercase tracking-wider">Issuer</p>
              <p className="font-mono text-sm text-foreground bg-background p-2 rounded border border-border">
                CB4B22...4WPDO
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted uppercase tracking-wider">Credential Hash</p>
              <p className="font-mono text-sm text-foreground bg-background p-2 rounded border border-border overflow-hidden text-ellipsis">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-center">
            <span className="text-verified font-medium tracking-wide flex items-center gap-2">
              ✓ Cryptographically Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onWalletConnect={setWallet} />
      
      <main className="container mx-auto px-6 py-8">
        {activeTab === "Home" && renderLandingPage()}
        {activeTab === "Explore" && <AttestationExplorer />}
        {activeTab === "Create Schema" && <CreateSchemaForm publicKey={wallet} />}
        {activeTab === "Issue" && <IssueAttestationForm publicKey={wallet} />}
        {activeTab === "Verify" && <VerifyAttestation />}
      </main>
    </div>
  );
}
