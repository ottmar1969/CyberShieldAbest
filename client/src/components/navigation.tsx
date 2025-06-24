import { Button } from "@/components/ui/button";
import { Shield, History, Wallet } from "lucide-react";
import { Link } from "wouter";
import { CreditSystem } from "@/components/CreditSystem";

export function Navigation() {
  return (
    <nav className="bg-cyber-card border-b border-cyber-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center">
                <Shield className="text-cyber-dark text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-cyber-cyan">CyberGuard AI</h1>
                <p className="text-xs text-cyber-text-dim">Advanced Security Consultant</p>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-cyber-text-dim hover:text-cyber-cyan transition-colors"
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            
            <CreditSystem />
          </div>
        </div>
      </div>
    </nav>
  );
}
