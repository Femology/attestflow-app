"use client";

import WalletConnect from "./WalletConnect";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onWalletConnect: (pk: string) => void;
}

export default function Navbar({ activeTab, setActiveTab, onWalletConnect }: NavbarProps) {
  const tabs = ["Home", "Explore", "Create Schema", "Issue", "Verify"];
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <span className="text-white text-xs">▲</span>
          </div>
          AttestFlow
        </h1>
        <div className="flex space-x-2 hidden md:flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-card border-border text-foreground shadow-sm"
                  : "border-transparent text-muted hover:text-foreground hover:bg-card/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {mounted && (
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-border bg-card text-muted hover:text-foreground hover:border-zinc-700 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        <WalletConnect onConnect={onWalletConnect} />
        <button 
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-4 flex flex-col space-y-2 md:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              className={`px-4 py-3 rounded-lg text-left text-sm transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-card border-border text-foreground shadow-sm"
                  : "border-transparent text-muted hover:text-foreground hover:bg-card/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
