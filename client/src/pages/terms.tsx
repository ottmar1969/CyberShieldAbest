import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
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
            <CardTitle className="text-2xl text-cyber-cyan">Terms of Service</CardTitle>
            <p className="text-cyber-text-dim">Last updated: December 24, 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">1. Service Description</h2>
              <div className="space-y-3 text-cyber-text">
                <p>
                  CyberGuard AI provides AI-powered cybersecurity consultation services and free security tools. 
                  Our platform combines multiple AI models to deliver professional cybersecurity guidance at 
                  affordable rates.
                </p>
                <p><strong>Services include:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>AI-powered cybersecurity consultations ($5 per question)</li>
                  <li>Free security analysis tools</li>
                  <li>Real-time threat intelligence</li>
                  <li>Security best practices guidance</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">2. Pricing and Payments</h2>
              <div className="space-y-2 text-cyber-text">
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Consultation Fee:</strong> $5 per cybersecurity question</li>
                  <li><strong>Free Services:</strong> Security tools are provided at no cost</li>
                  <li><strong>New User Bonus:</strong> One free consultation question for new users</li>
                  <li><strong>Payment Methods:</strong> Credit card (Stripe) and PayPal accepted</li>
                  <li><strong>Credits:</strong> Purchased credits do not expire</li>
                  <li><strong>Refunds:</strong> Contact support within 24 hours for refund requests</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">3. User Responsibilities</h2>
              <div className="space-y-2 text-cyber-text">
                <p>By using our service, you agree to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide accurate information in your cybersecurity questions</li>
                  <li>Use the service for legitimate cybersecurity purposes only</li>
                  <li>Not attempt to reverse-engineer or exploit our AI systems</li>
                  <li>Not share confidential information that could compromise security</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not use the service for illegal activities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">4. Service Limitations</h2>
              <div className="space-y-2 text-cyber-text">
                <p>Please understand that:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>AI consultations are educational and informational in nature</li>
                  <li>Recommendations should be validated by qualified professionals</li>
                  <li>We do not guarantee specific security outcomes</li>
                  <li>Service availability may be subject to maintenance windows</li>
                  <li>AI responses are based on training data and may not reflect latest threats</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">5. Privacy and Data</h2>
              <div className="space-y-2 text-cyber-text">
                <ul className="list-disc pl-6 space-y-1">
                  <li>We use anonymous session-based identification</li>
                  <li>No email registration required</li>
                  <li>Consultation data is used to improve AI responses</li>
                  <li>Payment information is processed securely by third parties</li>
                  <li>See our Privacy Policy for detailed information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">6. Intellectual Property</h2>
              <div className="space-y-2 text-cyber-text">
                <p>All content and AI responses provided by CyberGuard AI are:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Licensed for your personal or business use</li>
                  <li>Not to be resold as a cybersecurity service</li>
                  <li>Subject to attribution when shared publicly</li>
                  <li>Generated using proprietary AI systems</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">7. Disclaimers</h2>
              <div className="space-y-2 text-cyber-text">
                <p><strong>IMPORTANT:</strong> CyberGuard AI is provided "as is" without warranties of any kind.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>AI consultations are educational tools, not professional security audits</li>
                  <li>Users are responsible for implementing security measures</li>
                  <li>We are not liable for security breaches or incidents</li>
                  <li>Consult qualified cybersecurity professionals for critical systems</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">8. Support and Contact</h2>
              <div className="bg-cyber-border/20 p-4 rounded-lg">
                <p className="text-cyber-text mb-2">For support, questions, or service issues:</p>
                <p className="text-cyber-cyan"><strong>CyberGuard AI</strong></p>
                <p className="text-cyber-text">Operated by: O. Francisca</p>
                <p className="text-cyber-text">Website: CyberGuardAI.site</p>
                <p className="text-cyber-text">WhatsApp Support: +31 628073996</p>
                <p className="text-cyber-text-dim text-sm mt-2">
                  Support available Monday-Friday, 9 AM - 6 PM CET
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">9. Changes to Terms</h2>
              <p className="text-cyber-text">
                These terms may be updated periodically. Continued use of the service after changes 
                constitutes acceptance of the new terms. Material changes will be communicated through 
                our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyber-cyan mb-4">10. Governing Law</h2>
              <p className="text-cyber-text">
                These terms are governed by the laws of the Netherlands. Any disputes will be resolved 
                through binding arbitration or the courts of the Netherlands.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}