---
name: dns-manager
description: Manage Porkbun domains and configure DNS records, including automatically linking domains to Vercel projects and verifying them.
---

# DNS Manager Skill

This skill allows you to manage DNS records in Porkbun and link them to Vercel projects automatically.

## Prerequisites

Ensure you have configured `.env.dns.local` in your project root with the following keys:
- `PORKBUN_API_KEY`: Porkbun public API Key (starts with `pk1_`)
- `PORKBUN_SECRET_KEY`: Porkbun secret API Key (starts with `sk1_`)
- `VERCEL_API_TOKEN`: Vercel Personal Access Token
- `VERCEL_PROJECT_ID`: The Vercel project name/ID for this site
- `VERCEL_TEAM_ID`: (Optional) If your Vercel project is in a Team

## Available Operations

Execute these commands through the terminal using Node.js:

### 1. Test Credentials
Verify that your API keys are correct and active:
```bash
node .agents/skills/dns-manager/scripts/dns-tool.cjs test-credentials
```

### 2. List Managed Domains
List all domains in your Porkbun account with API access enabled:
```bash
node .agents/skills/dns-manager/scripts/dns-tool.cjs list-domains
```

### 3. Show DNS Records
Show existing DNS records on Porkbun for a specific domain:
```bash
node .agents/skills/dns-manager/scripts/dns-tool.cjs get-records <domain>
```

### 4. Link Domain to Vercel
Add a domain to your Vercel project, configure the necessary DNS records (A/CNAME and TXT verification) automatically, and verify:
```bash
node .agents/skills/dns-manager/scripts/dns-tool.cjs link-vercel <domain>
```

### 5. Check Vercel Status
Check verification and configuration status of a domain in Vercel:
```bash
node .agents/skills/dns-manager/scripts/dns-tool.cjs status-vercel <domain>
```

### 6. Add/Update a DNS Record
Add or update a single DNS record manually:
```bash
node .agents/skills/dns-manager/scripts/dns-tool.cjs add-record <domain> <type> <subdomain> <content> [ttl]
```
*Note: Use empty string `""` for the root subdomain (e.g. `@`).*

### 7. Delete a DNS Record
Delete a DNS record from Porkbun by record ID:
```bash
node .agents/skills/dns-manager/scripts/dns-tool.cjs delete-record <domain> <recordId>
```
