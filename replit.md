# Replit.md - CyberGuard AI Cybersecurity Consultant

## Overview

CyberGuard AI is a comprehensive cybersecurity consultation platform that combines AI-powered analysis with practical security tools. The application provides professional cybersecurity guidance through a chat interface ($2 per question) and offers a suite of free security analysis tools including password strength analysis, website security scanning, SSL certificate checking, and phishing detection.

## System Architecture

The application follows a full-stack architecture with clear separation between client and server responsibilities:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Custom cybersecurity-themed design system with dark color palette

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES Modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple

### Payment Processing
- **Payment Gateway**: Stripe integration for handling consultation payments
- **Payment Model**: Pay-per-question ($2 per consultation)
- **Credit System**: User credit balance tracking in database

## Key Components

### AI Services Integration
1. **Perplexity API**: Real-time research and information gathering for cybersecurity queries
2. **OpenAI GPT-4o**: Advanced analysis and expert guidance generation
3. **Hybrid Approach**: Combines Perplexity's research capabilities with OpenAI's analytical expertise

### Security Tools Suite
- **Password Strength Analyzer**: Entropy calculation, pattern detection, crack time estimation
- **Website Security Scanner**: SSL/TLS analysis, security headers inspection
- **SSL Certificate Checker**: Certificate validity and configuration analysis
- **Phishing Detection**: URL analysis for malicious patterns
- **Security Headers Analysis**: HTTP security headers evaluation

### Database Schema
- **Users**: Authentication, credits, Stripe customer integration
- **Chat Sessions**: Conversation management and session tracking
- **Chat Messages**: Message history with metadata and cost tracking
- **Tool Usage**: Security tool usage logging and analytics

### UI/UX Design
- **Theme**: Dark cybersecurity aesthetic with cyan/green accent colors
- **Responsive**: Mobile-first design with adaptive layouts
- **Components**: Comprehensive shadcn/ui component library integration
- **Accessibility**: Full keyboard navigation and screen reader support

## Data Flow

### Consultation Workflow
1. User submits cybersecurity question through chat interface
2. System checks user credit balance and creates payment intent if needed
3. Question is processed through Perplexity API for research
4. Combined data is analyzed by OpenAI for expert guidance
5. Response is delivered with citations and metadata
6. Chat history is saved with cost tracking

### Security Tools Workflow
1. User selects security tool and provides input (URL, password, etc.)
2. Tool-specific analysis is performed server-side
3. Results are enhanced with AI-powered insights
4. Comprehensive report is generated and displayed
5. Usage is logged for analytics and rate limiting

### Payment Processing
1. User initiates consultation requiring payment
2. Stripe payment intent is created server-side
3. Client-side Stripe Elements handles secure payment collection
4. Payment confirmation updates user credits
5. Consultation proceeds with confirmed payment

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Stripe**: Payment processing and subscription management
- **Perplexity API**: Real-time research and information retrieval
- **OpenAI API**: Advanced language model analysis

### Development & Deployment
- **Replit**: Development environment and hosting platform
- **Vite**: Frontend build tooling and development server
- **Drizzle Kit**: Database schema management and migrations

### UI Libraries
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module integration
- **Hot Reload**: Vite development server with HMR
- **Environment Variables**: Secure API key management

### Production Build
- **Frontend**: Vite build output to `dist/public`
- **Backend**: ESBuild compilation to `dist/index.js`
- **Static Assets**: Served directly from Express server
- **Process Management**: Single Node.js process with Express

### Configuration
- **Port Management**: Port 5000 mapped to external port 80
- **Environment**: NODE_ENV-based configuration switching
- **Security**: API keys managed through environment variables
- **Monitoring**: Request logging and error tracking

## Changelog

```
Changelog:
- June 24, 2025: Initial setup
- June 24, 2025: Added PayPal payment integration as alternative to Stripe
- June 24, 2025: Made API keys optional with graceful fallbacks for demo mode
- June 24, 2025: Enhanced payment options with dual Stripe/PayPal support
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Company: CyberGuard AI
Operator: O. Francisca  
Website: CyberGuardAI.site
Contact: WhatsApp +31 628073996
Pricing: $5 per consultation (1 FREE for new users)
Security: Anonymous session-based system with IP and fingerprint tracking
Payment: Stripe + PayPal integration
```