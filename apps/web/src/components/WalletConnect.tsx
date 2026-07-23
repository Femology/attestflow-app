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
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
        {address.substring(0, 4)}...{address.substring(address.length - 4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
    >
      Connect Freighter
    </button>
  );
}
