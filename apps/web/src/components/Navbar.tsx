"use client";

import WalletConnect from "./WalletConnect";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onWalletConnect: (pk: string) => void;
}

export default function Navbar({ activeTab, setActiveTab, onWalletConnect }: NavbarProps) {
  const tabs = ["Explore", "Create Schema", "Issue", "Verify"];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold text-gray-900">AttestFlow</h1>
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <WalletConnect onConnect={onWalletConnect} />
    </nav>
  );
}
