import { openaiService } from "./openai.js";
import https from "https";
import crypto from "crypto";

export class SecurityToolsService {
  async analyzePasswordStrength(password: string): Promise<any> {
    const analysis = {
      score: 0,
      strength: "Very Weak",
      feedback: [],
      entropy: 0,
      estimatedCrackTime: "",
    };

    // Length check
    if (password.length < 8) {
      analysis.feedback.push("Password should be at least 8 characters long");
    } else if (password.length >= 12) {
      analysis.score += 20;
    } else {
      analysis.score += 10;
    }

    // Character variety checks
    if (/[a-z]/.test(password)) analysis.score += 10;
    if (/[A-Z]/.test(password)) analysis.score += 10;
    if (/[0-9]/.test(password)) analysis.score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) analysis.score += 15;

    // Common patterns
    if (!/(.)\1{2,}/.test(password)) analysis.score += 10;
    if (!/123|abc|qwe|password/i.test(password)) analysis.score += 15;

    // Calculate entropy
    const charSet = this.getCharacterSetSize(password);
    analysis.entropy = Math.log2(Math.pow(charSet, password.length));

    // Determine strength
    if (analysis.score >= 80) analysis.strength = "Very Strong";
    else if (analysis.score >= 60) analysis.strength = "Strong";
    else if (analysis.score >= 40) analysis.strength = "Moderate";
    else if (analysis.score >= 20) analysis.strength = "Weak";

    // Crack time estimation
    analysis.estimatedCrackTime = this.estimateCrackTime(analysis.entropy);

    return analysis;
  }

  async scanWebsiteSecurity(url: string): Promise<any> {
    try {
      const parsedUrl = new URL(url);
      const results = {
        url,
        ssl: await this.checkSSL(parsedUrl.hostname),
        headers: await this.checkSecurityHeaders(url),
        reputation: await this.checkDomainReputation(parsedUrl.hostname),
        vulnerabilities: [],
        score: 0,
        recommendations: [],
      };

      // Calculate overall score
      results.score = this.calculateSecurityScore(results);
      results.recommendations = this.generateSecurityRecommendations(results);

      return results;
    } catch (error) {
      throw new Error(`Website security scan failed: ${(error as Error).message}`);
    }
  }

  async checkSSLCertificate(domain: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: domain,
        port: 443,
        method: 'GET',
        rejectUnauthorized: false,
      };

      const req = https.request(options, (res) => {
        const cert = (res.connection as any).getPeerCertificate();
        
        if (!cert || Object.keys(cert).length === 0) {
          resolve({
            valid: false,
            error: "No certificate found",
            score: 0,
          });
          return;
        }

        const now = new Date();
        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const daysUntilExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        resolve({
          valid: true,
          subject: cert.subject,
          issuer: cert.issuer,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          daysUntilExpiry,
          fingerprint: cert.fingerprint,
          serialNumber: cert.serialNumber,
          signatureAlgorithm: cert.sigalg,
          score: daysUntilExpiry > 30 ? 100 : daysUntilExpiry > 7 ? 75 : 25,
        });
      });

      req.on('error', (error) => {
        resolve({
          valid: false,
          error: error.message,
          score: 0,
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          valid: false,
          error: "Connection timeout",
          score: 0,
        });
      });

      req.end();
    });
  }

  async detectPhishingURL(url: string): Promise<any> {
    try {
      const parsedUrl = new URL(url);
      const analysis = {
        url,
        riskLevel: "Low",
        score: 100,
        indicators: [],
        recommendations: [],
      };

      // Check for suspicious patterns
      const suspiciousPatterns = [
        { pattern: /bit\.ly|tinyurl|t\.co/i, risk: 10, reason: "URL shortener detected" },
        { pattern: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, risk: 20, reason: "IP address instead of domain" },
        { pattern: /-/g, risk: 5, reason: "Multiple hyphens in domain" },
        { pattern: /[0-9]/g, risk: 2, reason: "Numbers in domain" },
      ];

      suspiciousPatterns.forEach(({ pattern, risk, reason }) => {
        if (pattern.test(url)) {
          analysis.score -= risk;
          analysis.indicators.push(reason);
        }
      });

      // Check domain length
      if (parsedUrl.hostname.length > 30) {
        analysis.score -= 15;
        analysis.indicators.push("Unusually long domain name");
      }

      // Determine risk level
      if (analysis.score >= 80) analysis.riskLevel = "Low";
      else if (analysis.score >= 60) analysis.riskLevel = "Medium";
      else if (analysis.score >= 40) analysis.riskLevel = "High";
      else analysis.riskLevel = "Very High";

      // Generate recommendations
      if (analysis.score < 80) {
        analysis.recommendations.push("Exercise caution when visiting this URL");
        analysis.recommendations.push("Verify the URL with the legitimate website");
        analysis.recommendations.push("Check for HTTPS and valid SSL certificate");
      }

      return analysis;
    } catch (error) {
      throw new Error(`Phishing URL detection failed: ${(error as Error).message}`);
    }
  }

  async analyzeSecurityHeaders(url: string): Promise<any> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const headers = Object.fromEntries(response.headers.entries());

      const analysis = {
        url,
        score: 0,
        headers: headers,
        missing: [],
        present: [],
        recommendations: [],
      };

      const securityHeaders = [
        { name: 'strict-transport-security', score: 20, description: 'HSTS' },
        { name: 'content-security-policy', score: 25, description: 'CSP' },
        { name: 'x-frame-options', score: 15, description: 'X-Frame-Options' },
        { name: 'x-content-type-options', score: 10, description: 'X-Content-Type-Options' },
        { name: 'referrer-policy', score: 10, description: 'Referrer Policy' },
        { name: 'permissions-policy', score: 10, description: 'Permissions Policy' },
        { name: 'x-xss-protection', score: 10, description: 'XSS Protection' },
      ];

      securityHeaders.forEach(header => {
        if (headers[header.name]) {
          analysis.score += header.score;
          analysis.present.push(header.description);
        } else {
          analysis.missing.push(header.description);
          analysis.recommendations.push(`Implement ${header.description} header`);
        }
      });

      return analysis;
    } catch (error) {
      throw new Error(`Security headers analysis failed: ${(error as Error).message}`);
    }
  }

  private getCharacterSetSize(password: string): number {
    let size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[^a-zA-Z0-9]/.test(password)) size += 32;
    return size;
  }

  private estimateCrackTime(entropy: number): string {
    const attemptsPerSecond = 1e9; // 1 billion attempts per second
    const secondsToCrack = Math.pow(2, entropy - 1) / attemptsPerSecond;

    if (secondsToCrack < 60) return "Less than a minute";
    if (secondsToCrack < 3600) return `${Math.ceil(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.ceil(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.ceil(secondsToCrack / 86400)} days`;
    return `${Math.ceil(secondsToCrack / 31536000)} years`;
  }

  private async checkSSL(hostname: string): Promise<any> {
    return this.checkSSLCertificate(hostname);
  }

  private async checkSecurityHeaders(url: string): Promise<any> {
    return this.analyzeSecurityHeaders(url);
  }

  private async checkDomainReputation(hostname: string): Promise<any> {
    // Basic domain reputation check
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
    const isSuspicious = suspiciousTlds.some(tld => hostname.endsWith(tld));
    
    return {
      reputation: isSuspicious ? "Poor" : "Good",
      risk: isSuspicious ? "High" : "Low",
    };
  }

  private calculateSecurityScore(results: any): number {
    let score = 0;
    
    if (results.ssl.valid) score += 30;
    if (results.headers.score) score += Math.min(results.headers.score, 40);
    if (results.reputation.reputation === "Good") score += 30;
    
    return Math.min(score, 100);
  }

  private generateSecurityRecommendations(results: any): string[] {
    const recommendations = [];
    
    if (!results.ssl.valid) {
      recommendations.push("Implement valid SSL certificate");
    }
    
    if (results.headers.missing.length > 0) {
      recommendations.push("Add missing security headers");
    }
    
    if (results.reputation.reputation === "Poor") {
      recommendations.push("Consider domain reputation improvement");
    }
    
    return recommendations;
  }
}

export const securityToolsService = new SecurityToolsService();
