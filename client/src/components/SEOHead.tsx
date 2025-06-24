import { useEffect } from "react";
import { useLocation } from "wouter";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEOHead({ 
  title = "CyberGuard AI - Professional Cybersecurity Consultant | AI-Powered Security Analysis",
  description = "Get expert cybersecurity guidance from advanced AI at $5 per consultation. Free security tools, threat analysis, vulnerability assessment. New users get 1 FREE consultation!",
  keywords = "cybersecurity consultant, AI security expert, threat analysis, vulnerability assessment, penetration testing, security audit, cyber threats, data protection, network security, incident response, compliance, GDPR, ISO27001, NIST, security tools, phishing detection, malware analysis, ransomware protection, cyber defense, information security, digital forensics, security architecture, risk assessment, security training, cyber awareness, enterprise security, cloud security, mobile security, IoT security, artificial intelligence security, machine learning cybersecurity, cheap cybersecurity consultant, affordable security audit, AI powered security, automated threat detection, cybersecurity Netherlands, O Francisca cybersecurity",
  canonical,
  ogImage = "https://cyberguardai.site/og-image.jpg"
}: SEOHeadProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Update Open Graph tags
    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:url", `https://cyberguardai.site${location}`);
    updateMetaProperty("og:image", ogImage);

    // Update Twitter tags
    updateMetaProperty("twitter:title", title);
    updateMetaProperty("twitter:description", description);
    updateMetaProperty("twitter:image", ogImage);

    // Update canonical URL
    updateCanonical(canonical || `https://cyberguardai.site${location}`);

    // Update robots meta
    updateMetaTag("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

    // Add structured data for current page
    addStructuredData(title, description, location);

  }, [title, description, keywords, canonical, ogImage, location]);

  return null; // This component doesn't render anything
}

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateCanonical(url: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
}

function addStructuredData(title: string, description: string, path: string) {
  // Remove existing structured data
  const existing = document.querySelector('#dynamic-structured-data');
  if (existing) {
    existing.remove();
  }

  // Add page-specific structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": `https://cyberguardai.site${path}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "CyberGuard AI",
      "url": "https://cyberguardai.site"
    },
    "about": {
      "@type": "Thing",
      "name": "Cybersecurity Consulting"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "CyberGuard AI"
    }
  };

  const script = document.createElement('script');
  script.id = 'dynamic-structured-data';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// SEO-optimized page configurations
export const seoPages = {
  home: {
    title: "CyberGuard AI - Professional Cybersecurity Consultant | AI-Powered Security Analysis",
    description: "Get expert cybersecurity guidance from advanced AI at $5 per consultation. Free security tools, threat analysis, vulnerability assessment. New users get 1 FREE consultation!",
    keywords: "cybersecurity consultant, AI security expert, threat analysis, vulnerability assessment, penetration testing, security audit, cyber threats, data protection, network security, incident response, compliance, GDPR, ISO27001, NIST, security tools, phishing detection, malware analysis, ransomware protection, cyber defense, information security, digital forensics, security architecture, risk assessment, security training, cyber awareness, enterprise security, cloud security, mobile security, IoT security, artificial intelligence security, machine learning cybersecurity, cheap cybersecurity consultant, affordable security audit, AI powered security, automated threat detection, cybersecurity Netherlands, O Francisca cybersecurity"
  },
  privacy: {
    title: "Privacy Policy - CyberGuard AI | Data Protection & Security Compliance",
    description: "Learn how CyberGuard AI protects your privacy and data. Anonymous session-based identification, no email required, GDPR compliant cybersecurity consultation platform.",
    keywords: "privacy policy, data protection, cybersecurity privacy, anonymous consultation, GDPR compliance, data security, privacy cybersecurity, secure consultation"
  },
  terms: {
    title: "Terms of Service - CyberGuard AI | Cybersecurity Consultation Agreement",
    description: "Terms of service for CyberGuard AI cybersecurity consultation platform. $5 per consultation, professional AI-powered security guidance terms and conditions.",
    keywords: "terms of service, cybersecurity consultation terms, AI security service agreement, professional cybersecurity terms, consultation agreement"
  },
  checkout: {
    title: "Secure Payment - CyberGuard AI | Buy Cybersecurity Consultation Credits",
    description: "Secure payment for CyberGuard AI cybersecurity consultation credits. Stripe and PayPal accepted. Professional AI security guidance at $5 per consultation.",
    keywords: "cybersecurity payment, security consultation payment, AI cybersecurity credits, secure payment Stripe PayPal, buy security consultation"
  }
};