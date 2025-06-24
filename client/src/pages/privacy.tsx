import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEOHead, seoPages } from "@/components/SEOHead";

export default function Privacy() {
  return (
    <>
      <SEOHead {...seoPages.privacy} />
      <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-cyber-cyan hover:text-cyber-green">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CyberGuard AI
            </Button>
          </Link>
        </div>

        <Card className="bg-cyber-card border-cyber-border">
          <CardHeader>
            <CardTitle className="text-2xl text-cyber-cyan">Privacy Policy</CardTitle>
            <p className="text-cyber-text-dim">Last updated: December 24, 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">1. Information We Collect</h2>
              <div className="space-y-3 text-cyber-text">
                <p><strong>Automatically Collected:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address for security and fraud prevention</li>
                  <li>Browser fingerprint for session management</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Technical information about your device and browser</li>
                </ul>
                
                <p><strong>Voluntarily Provided:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cybersecurity questions you submit for consultation</li>
                  <li>Payment information (processed securely by Stripe/PayPal)</li>
                  <li>Communication through WhatsApp support</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">2. How We Use Your Information</h2>
              <div className="space-y-2 text-cyber-text">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide AI-powered cybersecurity consultations</li>
                  <li>Process payments and manage your credit balance</li>
                  <li>Prevent fraud and maintain platform security</li>
                  <li>Improve our services and user experience</li>
                  <li>Provide customer support when requested</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">3. Data Security</h2>
              <div className="space-y-2 text-cyber-text">
                <p>We implement industry-standard security measures:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>End-to-end encryption for all communications</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Regular security audits and monitoring</li>
                  <li>No storage of sensitive passwords or personal identification</li>
                  <li>Anonymous session-based user identification</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">4. Data Sharing</h2>
              <div className="space-y-2 text-cyber-text">
                <p>We do not sell, trade, or rent your personal information. We may share data only:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>With AI service providers (OpenAI, Perplexity) for consultation processing</li>
                  <li>With payment processors (Stripe, PayPal) for transaction handling</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In anonymized form for service improvement purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">5. Your Rights</h2>
              <div className="space-y-2 text-cyber-text">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access your data and consultation history</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt-out of data processing for marketing purposes</li>
                  <li>Request data portability in machine-readable format</li>
                  <li>Contact us about any privacy concerns</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">6. Cookies and Tracking</h2>
              <div className="space-y-2 text-cyber-text">
                <p>We use minimal tracking technologies:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Essential cookies for session management</li>
                  <li>Security cookies for fraud prevention</li>
                  <li>No third-party advertising cookies</li>
                  <li>No social media tracking pixels</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">7. Contact Information</h2>
              <div className="bg-cyber-border/20 p-4 rounded-lg">
                <p className="text-cyber-text mb-2">For privacy-related questions or requests:</p>
                <p className="text-cyber-cyan"><strong>CyberGuard AI</strong></p>
                <p className="text-cyber-text">Operated by: O. Francisca</p>
                <p className="text-cyber-text">Website: CyberGuardAI.site</p>
                <p className="text-cyber-text">WhatsApp: +31 628073996</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">8. Changes to This Policy</h2>
              <p className="text-cyber-text">
                We may update this privacy policy from time to time. We will notify users of any material 
                changes by posting the new policy on this page with an updated revision date.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}