import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Globe, 
  IdCard, 
  Fish, 
  Server,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle 
} from "lucide-react";
import { useSecurityTools } from "@/hooks/use-security-tools";

export function SecurityTools() {
  const [activeResults, setActiveResults] = useState<Record<string, any>>({});
  const { 
    analyzePassword,
    scanWebsite,
    checkSSL,
    detectPhishing,
    analyzeHeaders,
    isLoading 
  } = useSecurityTools();

  const handlePasswordAnalysis = async (password: string) => {
    if (!password) return;
    const result = await analyzePassword(password);
    setActiveResults(prev => ({ ...prev, password: result }));
  };

  const handleWebsiteScan = async (url: string) => {
    if (!url) return;
    const result = await scanWebsite(url);
    setActiveResults(prev => ({ ...prev, website: result }));
  };

  const handleSSLCheck = async (domain: string) => {
    if (!domain) return;
    const result = await checkSSL(domain);
    setActiveResults(prev => ({ ...prev, ssl: result }));
  };

  const handlePhishingCheck = async (url: string) => {
    if (!url) return;
    const result = await detectPhishing(url);
    setActiveResults(prev => ({ ...prev, phishing: result }));
  };

  const handleHeadersCheck = async (url: string) => {
    if (!url) return;
    const result = await analyzeHeaders(url);
    setActiveResults(prev => ({ ...prev, headers: result }));
  };

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'very strong': return 'text-cyber-green';
      case 'strong': return 'text-cyan-400';
      case 'moderate': return 'text-yellow-400';
      case 'weak': return 'text-orange-400';
      default: return 'text-red-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-cyber-green';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      default: return 'text-red-400';
    }
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-cyber-green">Free</span>{" "}
          <span className="text-white">Security Tools</span>
        </h2>
        <p className="text-cyber-text-dim">Professional-grade security tools available at no cost</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Password Strength Analyzer */}
        <Card className="bg-cyber-card border-cyber-border hover:border-cyber-cyan transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-cyber-cyan">
              <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mr-4">
                <Key className="text-cyber-dark text-xl" />
              </div>
              <div>
                <div className="text-lg font-semibold">Password Analyzer</div>
                <div className="text-sm text-cyber-text-dim font-normal">Strength & Security Check</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-cyber-text-dim">
              Real-time password strength analysis with entropy calculation and security recommendations.
            </p>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Enter password to analyze..."
                className="bg-cyber-dark border-cyber-border focus:border-cyber-cyan"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 0) {
                    handlePasswordAnalysis(value);
                  }
                }}
              />
              {activeResults.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyber-text-dim">Strength:</span>
                    <span className={`text-xs font-medium ${getStrengthColor(activeResults.password.strength)}`}>
                      {activeResults.password.strength}
                    </span>
                  </div>
                  <Progress 
                    value={activeResults.password.score} 
                    className="h-2 bg-cyber-dark"
                  />
                  <div className="text-xs text-cyber-text-dim">
                    Entropy: {activeResults.password.entropy?.toFixed(1)} bits
                  </div>
                  <div className="text-xs text-cyber-text-dim">
                    Crack time: {activeResults.password.estimatedCrackTime}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Website Security Scanner */}
        <Card className="bg-cyber-card border-cyber-border hover:border-cyber-cyan transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-cyber-cyan">
              <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mr-4">
                <Globe className="text-cyber-dark text-xl" />
              </div>
              <div>
                <div className="text-lg font-semibold">Security Scanner</div>
                <div className="text-sm text-cyber-text-dim font-normal">Website Vulnerability Check</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-cyber-text-dim">
              Comprehensive website security analysis including SSL, headers, and vulnerabilities.
            </p>
            <div className="space-y-3">
              <Input
                type="url"
                placeholder="https://example.com"
                className="bg-cyber-dark border-cyber-border focus:border-cyber-cyan"
              />
              <Button 
                className="w-full bg-cyber-green text-cyber-dark hover:bg-cyber-cyan transition-colors"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  if (input?.value) handleWebsiteScan(input.value);
                }}
                disabled={isLoading}
              >
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? "Scanning..." : "Scan Website"}
              </Button>
              {activeResults.website && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyber-text-dim">Security Score:</span>
                    <span className="text-xs font-medium text-cyber-green">
                      {activeResults.website.score}/100
                    </span>
                  </div>
                  <div className="space-y-1">
                    {activeResults.website.recommendations?.slice(0, 3).map((rec: string, idx: number) => (
                      <div key={idx} className="text-xs text-cyber-text-dim flex items-center">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SSL IdCard Checker */}
        <Card className="bg-cyber-card border-cyber-border hover:border-cyber-cyan transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-cyber-cyan">
              <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mr-4">
                <IdCard className="text-cyber-dark text-xl" />
              </div>
              <div>
                <div className="text-lg font-semibold">SSL Checker</div>
                <div className="text-sm text-cyber-text-dim font-normal">IdCard Validation</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-cyber-text-dim">
              Validate SSL certificates, check expiration dates, and encryption strength.
            </p>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="domain.com"
                className="bg-cyber-dark border-cyber-border focus:border-cyber-cyan"
              />
              <Button 
                className="w-full bg-cyber-green text-cyber-dark hover:bg-cyber-cyan transition-colors"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  if (input?.value) handleSSLCheck(input.value);
                }}
                disabled={isLoading}
              >
                <IdCard className="mr-2 h-4 w-4" />
                {isLoading ? "Checking..." : "Check SSL"}
              </Button>
              {activeResults.ssl && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {activeResults.ssl.valid ? (
                      <CheckCircle className="h-4 w-4 text-cyber-green" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-xs">
                      {activeResults.ssl.valid ? "Valid IdCard" : "Invalid IdCard"}
                    </span>
                  </div>
                  {activeResults.ssl.valid && (
                    <div className="text-xs text-cyber-text-dim">
                      Expires in {activeResults.ssl.daysUntilExpiry} days
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Phishing URL Detector */}
        <Card className="bg-cyber-card border-cyber-border hover:border-cyber-cyan transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-cyber-cyan">
              <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mr-4">
                <Fish className="text-cyber-dark text-xl" />
              </div>
              <div>
                <div className="text-lg font-semibold">Phishing Detector</div>
                <div className="text-sm text-cyber-text-dim font-normal">URL Safety Analysis</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-cyber-text-dim">
              Analyze URLs for phishing indicators and malicious content detection.
            </p>
            <div className="space-y-3">
              <Input
                type="url"
                placeholder="https://suspicious-url.com"
                className="bg-cyber-dark border-cyber-border focus:border-cyber-cyan"
              />
              <Button 
                className="w-full bg-cyber-green text-cyber-dark hover:bg-cyber-cyan transition-colors"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  if (input?.value) handlePhishingCheck(input.value);
                }}
                disabled={isLoading}
              >
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? "Analyzing..." : "Analyze URL"}
              </Button>
              {activeResults.phishing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyber-text-dim">Risk Level:</span>
                    <Badge className={`text-xs ${getRiskColor(activeResults.phishing.riskLevel)}`}>
                      {activeResults.phishing.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-xs text-cyber-text-dim">
                    Safety Score: {activeResults.phishing.score}/100
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Headers Analyzer */}
        <Card className="bg-cyber-card border-cyber-border hover:border-cyber-cyan transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center text-cyber-cyan">
              <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center mr-4">
                <Server className="text-cyber-dark text-xl" />
              </div>
              <div>
                <div className="text-lg font-semibold">Headers Analyzer</div>
                <div className="text-sm text-cyber-text-dim font-normal">HTTP Security Check</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-cyber-text-dim">
              Analyze HTTP security headers including CSP, HSTS, and security configurations.
            </p>
            <div className="space-y-3">
              <Input
                type="url"
                placeholder="https://website.com"
                className="bg-cyber-dark border-cyber-border focus:border-cyber-cyan"
              />
              <Button 
                className="w-full bg-cyber-green text-cyber-dark hover:bg-cyber-cyan transition-colors"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  if (input?.value) handleHeadersCheck(input.value);
                }}
                disabled={isLoading}
              >
                <Server className="mr-2 h-4 w-4" />
                {isLoading ? "Checking..." : "Check Headers"}
              </Button>
              {activeResults.headers && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyber-text-dim">Security Score:</span>
                    <span className="text-xs font-medium text-cyber-green">
                      {activeResults.headers.score}/100
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-cyber-green">
                      Present: {activeResults.headers.present?.length || 0}
                    </div>
                    <div className="text-xs text-orange-400">
                      Missing: {activeResults.headers.missing?.length || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
