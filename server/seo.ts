import type { Express } from "express";

// SEO-optimized sitemap generation
export function generateSitemap(): string {
  const baseUrl = "https://cyberguardai.site";
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: "daily",
      priority: "1.0"
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.8"
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.8"
    },
    {
      loc: `${baseUrl}/checkout`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: "0.9"
    }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  urls.forEach(url => {
    sitemap += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  });

  sitemap += "\n</urlset>";
  return sitemap;
}

// Generate robots.txt for optimal crawling
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

Sitemap: https://cyberguardai.site/sitemap.xml

# Block unwanted bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;
}

// Advanced SEO meta tags for different pages
export const seoConfig = {
  home: {
    title: "CyberGuard AI - Professional Cybersecurity Consultant | AI-Powered Security Analysis",
    description: "Get expert cybersecurity guidance from advanced AI at $5 per consultation. Free security tools, threat analysis, vulnerability assessment. New users get 1 FREE consultation!",
    keywords: "cybersecurity consultant, AI security expert, threat analysis, vulnerability assessment, penetration testing, security audit, cyber threats, data protection, network security, incident response, compliance, GDPR, ISO27001, NIST, security tools, phishing detection, malware analysis, ransomware protection, cyber defense, information security, digital forensics, security architecture, risk assessment, security training, cyber awareness, enterprise security, cloud security, mobile security, IoT security, artificial intelligence security, machine learning cybersecurity, cheap cybersecurity consultant, affordable security audit, AI powered security, automated threat detection, cybersecurity Netherlands, O Francisca cybersecurity",
    canonical: "https://cyberguardai.site/"
  },
  privacy: {
    title: "Privacy Policy - CyberGuard AI | Data Protection & Security",
    description: "Learn how CyberGuard AI protects your privacy and data. Anonymous session-based identification, no email required, secure cybersecurity consultation platform.",
    keywords: "privacy policy, data protection, cybersecurity privacy, anonymous consultation, GDPR compliance, data security",
    canonical: "https://cyberguardai.site/privacy"
  },
  terms: {
    title: "Terms of Service - CyberGuard AI | Cybersecurity Consultation Agreement",
    description: "Terms of service for CyberGuard AI cybersecurity consultation platform. $5 per consultation, professional AI-powered security guidance terms and conditions.",
    keywords: "terms of service, cybersecurity consultation terms, AI security service agreement, professional cybersecurity terms",
    canonical: "https://cyberguardai.site/terms"
  },
  checkout: {
    title: "Secure Payment - CyberGuard AI | Buy Cybersecurity Consultation Credits",
    description: "Secure payment for CyberGuard AI cybersecurity consultation credits. Stripe and PayPal accepted. Professional AI security guidance at $5 per consultation.",
    keywords: "cybersecurity payment, security consultation payment, AI cybersecurity credits, secure payment Stripe PayPal",
    canonical: "https://cyberguardai.site/checkout"
  }
};

// Register SEO routes
export function registerSEORoutes(app: Express) {
  // Sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    res.set("Content-Type", "application/xml");
    res.send(generateSitemap());
  });

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(generateRobotsTxt());
  });

  // JSON-LD structured data API
  app.get("/api/structured-data", (req, res) => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CyberGuard AI",
      "url": "https://cyberguardai.site",
      "description": "Professional AI-powered cybersecurity consultation service",
      "founder": {
        "@type": "Person",
        "name": "O. Francisca"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+31-628073996",
        "contactType": "customer service"
      },
      "serviceType": "Cybersecurity Consulting",
      "priceRange": "$5"
    };
    
    res.json(structuredData);
  });

  // Meta tags API for dynamic pages
  app.get("/api/meta/:page", (req, res) => {
    const page = req.params.page as keyof typeof seoConfig;
    const meta = seoConfig[page];
    
    if (!meta) {
      return res.status(404).json({ error: "Page not found" });
    }
    
    res.json(meta);
  });

  // Open Graph image endpoint
  app.get("/og-image.jpg", (req, res) => {
    // In production, serve actual OG image
    // For now, redirect to a placeholder
    res.redirect("https://via.placeholder.com/1200x630/0a0e1a/00d4ff?text=CyberGuard+AI+Professional+Cybersecurity+Consultant");
  });

  // Favicon
  app.get("/favicon.ico", (req, res) => {
    // In production, serve actual favicon
    res.redirect("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>");
  });

  // Security.txt for security researchers
  app.get("/.well-known/security.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(`Contact: https://wa.me/31628073996
Expires: 2025-12-31T23:59:59.000Z
Encryption: https://cyberguardai.site/pgp-key.txt
Preferred-Languages: en, nl
Canonical: https://cyberguardai.site/.well-known/security.txt
Policy: https://cyberguardai.site/security-policy`);
  });
}

// SEO keywords for different cybersecurity topics
export const seoKeywords = {
  primary: [
    "cybersecurity consultant",
    "AI security expert", 
    "threat analysis",
    "vulnerability assessment",
    "penetration testing",
    "security audit",
    "cyber threats",
    "data protection",
    "network security",
    "incident response"
  ],
  secondary: [
    "compliance GDPR ISO27001 NIST",
    "security tools",
    "phishing detection", 
    "malware analysis",
    "ransomware protection",
    "cyber defense",
    "information security",
    "digital forensics",
    "security architecture",
    "risk assessment"
  ],
  longTail: [
    "cheap cybersecurity consultant Netherlands",
    "affordable AI security analysis",
    "automated threat detection service",
    "professional cybersecurity guidance $5",
    "AI powered vulnerability assessment",
    "real-time cyber threat intelligence",
    "enterprise security architecture consulting",
    "GDPR compliance cybersecurity expert",
    "incident response planning consultant",
    "cybersecurity risk management Netherlands"
  ],
  local: [
    "cybersecurity consultant Netherlands",
    "cyber security expert NL", 
    "Nederlandse cybersecurity specialist",
    "O Francisca cybersecurity",
    "Amsterdam cybersecurity consultant",
    "Dutch cyber security services"
  ]
};