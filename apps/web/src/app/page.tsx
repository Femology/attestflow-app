"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CreateSchemaForm from "@/components/CreateSchemaForm";
import IssueAttestationForm from "@/components/IssueAttestationForm";
import VerifyAttestation from "@/components/VerifyAttestation";
import AttestationExplorer from "@/components/AttestationExplorer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [wallet, setWallet] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onWalletConnect={setWallet} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === "Explore" && <AttestationExplorer />}
        {activeTab === "Create Schema" && <CreateSchemaForm publicKey={wallet} />}
        {activeTab === "Issue" && <IssueAttestationForm publicKey={wallet} />}
        {activeTab === "Verify" && <VerifyAttestation />}
      </main>
    </div>
  );
}
