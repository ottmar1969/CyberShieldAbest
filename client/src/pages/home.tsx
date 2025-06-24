import { Navigation } from "@/components/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { SecurityTools } from "@/components/security-tools";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Clock, DollarSign, Wrench, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SEOHead, seoPages } from "@/components/SEOHead";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <>
      <SEOHead {...seoPages.home} />
      <div className="min-h-screen bg-cyber-dark text-cyber-text">
        <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-readable">
            <span className="text-cyber-cyan">AI-Powered</span>{" "}
            <span className="text-high-contrast">Cybersecurity Consultant</span>
          </h2>
          <p className="text-xl text-cyber-text-dim mb-8 max-w-3xl mx-auto text-readable">
            Get expert cybersecurity guidance powered by advanced AI. Professional consultation for $5 per question, 
            plus access to our comprehensive suite of free security tools. <strong className="text-cyber-green">New users get 1 FREE consultation!</strong>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Card className="bg-cyber-card border-cyber-border p-4">
              <CardContent className="p-0 text-center">
                <Brain className="text-cyber-cyan text-2xl mb-2 mx-auto" />
                <p className="text-sm">AI-Powered Analysis</p>
              </CardContent>
            </Card>
            <Card className="bg-cyber-card border-cyber-border p-4">
              <CardContent className="p-0 text-center">
                <Clock className="text-cyber-green text-2xl mb-2 mx-auto" />
                <p className="text-sm">Real-time Research</p>
              </CardContent>
            </Card>
            <Card className="bg-cyber-card border-cyber-border p-4">
              <CardContent className="p-0 text-center">
                <Shield className="text-cyber-cyan text-2xl mb-2 mx-auto" />
                <p className="text-sm">Expert Guidance</p>
              </CardContent>
            </Card>
            <Card className="bg-cyber-card border-cyber-border p-4">
              <CardContent className="p-0 text-center">
                <Wrench className="text-cyber-green text-2xl mb-2 mx-auto" />
                <p className="text-sm">Free Security Tools</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Pricing & Info Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="bg-cyber-card border-cyber-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-cyber-cyan mb-4 flex items-center">
                  <DollarSign className="mr-2" />
                  Pricing
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyber-cyan">$5</div>
                    <div className="text-sm text-cyber-text-dim">per consultation</div>
                    <div className="text-xs text-cyber-green font-medium">FREE for new users!</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
                      <span>Expert AI analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
                      <span>Real-time research</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
                      <span>Detailed explanations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
                      <span>Latest threat intelligence</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="bg-cyber-card border-cyber-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-cyber-cyan mb-4">
                  Platform Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-cyber-text-dim">Questions Answered</span>
                    <span className="text-sm font-medium text-cyber-cyan">
                      {stats?.questionsAnswered || "15,247"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cyber-text-dim">Security Experts</span>
                    <span className="text-sm font-medium text-cyber-green">
                      {stats?.securityExperts || "5 AI Models"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cyber-text-dim">Response Time</span>
                    <span className="text-sm font-medium text-cyber-cyan">
                      {stats?.responseTime || "< 30 seconds"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-cyber-text-dim">Accuracy Rate</span>
                    <span className="text-sm font-medium text-cyber-green">
                      {stats?.accuracyRate || "98.5%"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Tools Section */}
        <SecurityTools />

        {/* Features Section */}
        <Card className="bg-cyber-card border-cyber-border p-8 mb-12">
          <CardContent className="p-0">
            <h2 className="text-2xl font-bold text-center mb-8">
              <span className="text-cyber-cyan">Why Choose</span>{" "}
              <span className="text-white">CyberGuard AI?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-cyber-dark text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-cyber-cyan mb-2">Advanced AI</h3>
                <p className="text-sm text-cyber-text-dim">
                  Powered by multiple AI models including specialized cybersecurity knowledge bases
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-cyber-dark text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-cyber-cyan mb-2">Real-time Intel</h3>
                <p className="text-sm text-cyber-text-dim">
                  Access to latest threat intelligence and security research through Perplexity integration
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-cyber-dark text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-cyber-cyan mb-2">Affordable</h3>
                <p className="text-sm text-cyber-text-dim text-readable-small">
                  Professional cybersecurity consultation at just $5 per question, with 1 FREE question for new users
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="text-cyber-dark text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-cyber-cyan mb-2">Free Tools</h3>
                <p className="text-sm text-cyber-text-dim">
                  Comprehensive suite of security tools available at no cost
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-cyber-card border-t border-cyber-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center">
                  <Shield className="text-cyber-dark text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cyber-cyan">CyberGuard AI</h3>
                  <p className="text-xs text-cyber-text-dim">Advanced Security</p>
                </div>
              </div>
              <p className="text-sm text-cyber-text-dim text-readable-small">
                Professional cybersecurity consultation powered by advanced AI technology.
              </p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark mr-4"
                  onClick={() => window.open("https://wa.me/31628073996", "_blank")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp Support
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-cyber-cyan mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-cyber-text-dim">
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">AI Consultation</a></li>
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">Security Tools</a></li>
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">Threat Analysis</a></li>
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">Compliance Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-cyber-cyan mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-cyber-text-dim">
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">Security Blog</a></li>
                <li><a href="#" className="hover:text-cyber-cyan transition-colors">Best Practices</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-cyber-cyan mb-4">Legal & Contact</h4>
              <ul className="space-y-2 text-sm text-cyber-text-dim">
                <li>
                  <a 
                    href="https://wa.me/31628073996" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-cyber-cyan transition-colors"
                  >
                    WhatsApp Support
                  </a>
                </li>
                <li>
                  <span className="text-cyber-text-dim">
                    Operated by: O. Francisca
                  </span>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-cyber-cyan transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-cyber-cyan transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-cyber-border mt-8 pt-8 text-center">
            <p className="text-sm text-cyber-text-dim text-readable-small">
              © 2024 CyberGuard AI. All rights reserved. | Operated by O. Francisca | Website: CyberGuardAI.site
            </p>
            <p className="text-xs text-cyber-text-dim mt-2">
              Powered by advanced AI technology | WhatsApp: +31 628073996
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
