"use client";

import { useState, useEffect } from "react";
import { connectWallet, checkFreighterInstalled } from "@/lib/freighter";

export default function WalletConnect({ onConnect }: { onConnect?: (pk: string) => void }) {
  const [address, setAddress] = useState<string | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    checkFreighterInstalled().then(setInstalled);
  }, []);

  const handleConnect = async () => {
    if (!installed) return alert("Freighter wallet not installed");
    try {
      const pk = await connectWallet();
      setAddress(pk);
      if (onConnect) onConnect(pk);
    } catch (err) {
      console.error(err);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
          <div className="w-2 h-2 rounded-full bg-verified animate-pulse" />
          <span className="font-mono text-sm text-foreground">
            {address.substring(0, 5)}...{address.substring(address.length - 4)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] border border-primary/20"
    >
      Connect Freighter
    </button>
  );
}
